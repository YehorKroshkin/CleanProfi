import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'
import path from 'path'
import { z } from 'zod'

dotenv.config({ path: '.env.local' })
dotenv.config()

const {
  PORT = '5000',
  MONGODB_URI,
  MONGODB_DB_NAME = 'CleanProfi',
  JWT_SECRET,
  CLIENT_ORIGIN = 'http://localhost:5173',
  NODE_ENV = 'development',
} = process.env

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI in environment')
}

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be present and at least 32 characters long')
}

await mongoose.connect(MONGODB_URI, {
  dbName: MONGODB_DB_NAME,
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clientDistPath = path.resolve(__dirname, '..', 'dist')

const orderBaseServiceOptions = ['regular', 'deep', 'post_renovation', 'office']
const orderAdditionalServiceOptions = [
  'sofa_chem_2p',
  'chairs_chem',
  'carpet_chem_3m',
  'mattress_chem_2p',
  'bed_chem_2p',
  'kitchen_wet_cleaning',
  'stove_hood_chem',
  'full_premises_chem',
]
const orderServiceOptions = [...orderBaseServiceOptions, ...orderAdditionalServiceOptions]
const orderObjectTypeOptions = ['apartment', 'house', 'office', 'garage']

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true, collection: 'users' },
)

const User = mongoose.model('User', userSchema)

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    user: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, trim: true, lowercase: true },
    },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    area: { type: Number, required: true, min: 1 },
    objectType: { type: String, required: true, enum: orderObjectTypeOptions },
    baseService: { type: String, required: true, enum: orderBaseServiceOptions },
    additionalItems: {
      type: [String],
      required: true,
      default: [],
      enum: orderAdditionalServiceOptions,
    },
    furnitureCount: { type: Number, required: true, min: 0, max: 200, default: 0 },
    scheduledDate: { type: String, required: true, trim: true },
    scheduledTime: { type: String, required: true, trim: true },
    comment: { type: String, trim: true, default: '' },
    estimatedCost: { type: Number, required: true, min: 0 },
    pricingBreakdown: {
      basePrice: { type: Number, required: true, min: 0 },
      areaSurcharge: { type: Number, required: true, min: 0 },
      addOnsTotal: { type: Number, required: true, min: 0 },
      currency: { type: String, required: true, default: 'PLN' },
    },
    status: { type: String, required: true, default: 'new' },
  },
  { timestamps: true, collection: 'orders' },
)

const Order = mongoose.model('Order', orderSchema)

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(120),
  district: z.string().trim().min(2).max(120),
  street: z.string().trim().min(2).max(200),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9()\-\s]{8,20}$/),
  email: z.string().trim().email().max(180),
  password: z.string().min(10).max(128),
})

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(10).max(128),
})

const orderCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9()\-\s]{8,20}$/),
  city: z.string().trim().min(2).max(120),
  address: z.string().trim().min(4).max(220),
  area: z.coerce.number().int().min(1).max(2000),
  objectType: z.enum(orderObjectTypeOptions),
  baseService: z.enum(orderBaseServiceOptions),
  additionalItems: z.array(z.enum(orderAdditionalServiceOptions)).max(20).optional().default([]),
  furnitureCount: z.coerce.number().int().min(0).max(200).optional().default(0),
  date: z.string().trim().min(1).max(32),
  time: z.string().trim().min(1).max(32),
  comment: z.string().trim().max(500).optional().default(''),
})

const app = express()
app.disable('x-powered-by')
app.use(helmet())
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, try again later.' },
})

const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many order requests, try again later.' },
})

function hasTrustedRequestOrigin(req) {
  const origin = req.get('origin')
  if (origin) {
    return origin === CLIENT_ORIGIN
  }

  const referer = req.get('referer')
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin
      return refererOrigin === CLIENT_ORIGIN
    } catch {
      return false
    }
  }

  return false
}

function requireTrustedOrigin(req, res, next) {
  if (NODE_ENV !== 'production') {
    return next()
  }

  if (hasTrustedRequestOrigin(req)) {
    return next()
  }

  return res.status(403).json({ message: 'Forbidden origin' })
}

function makeToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '7d' },
  )
}

function setAuthCookie(res, token) {
  res.cookie('cp_token', token, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  })
}

function clearAuthCookie(res) {
  res.clearCookie('cp_token', {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

async function getOptionalAuthUser(req) {
  try {
    const token = req.cookies.cp_token
    if (!token) {
      return null
    }

    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(payload.sub).select('name city phone email')
    return user || null
  } catch {
    return null
  }
}

function buildOrderNumber() {
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')

  return `CP-${Date.now().toString(36).toUpperCase()}-${random}`
}

function calculateEstimatedCost({ serviceItems, objectType, area }) {
  const baseServicePricing = {
    regular: { base: 200, extraPerSqm: 6.99 },
    deep: { base: 250, extraPerSqm: 6.99 },
    post_renovation: { base: 170, extraPerSqm: 7.99 },
    office: { base: 100, extraPerSqm: 5 },
  }

  const addOnPricing = {
    sofa_chem_2p: 150,
    chairs_chem: 50,
    carpet_chem_3m: 200,
    mattress_chem_2p: 100,
    bed_chem_2p: 150,
    kitchen_wet_cleaning: 100,
    stove_hood_chem: 100,
    full_premises_chem: 0,
  }

  const areaAfterIncluded = Math.max(0, area - 38)
  const basePricing = baseServicePricing[serviceItems.baseService]
  const basePrice = basePricing.base
  const areaSurcharge = Math.round(areaAfterIncluded * basePricing.extraPerSqm * 100) / 100

  const addOnsTotalWithoutFurniture = serviceItems.additionalItems.reduce((total, item) => {
    return total + (addOnPricing[item] || 0)
  }, 0)

  const furnitureSurcharge = serviceItems.additionalItems.includes('full_premises_chem')
    ? Math.max(0, serviceItems.furnitureCount) * 50
    : 0

  const addOnsTotal = addOnsTotalWithoutFurniture + furnitureSurcharge
  const total = Math.round((basePrice + areaSurcharge + addOnsTotal) * 100) / 100

  return {
    total,
    pricingBreakdown: {
      basePrice,
      areaSurcharge,
      addOnsTotal,
      currency: 'PLN',
    },
  }
}

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.cp_token
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(payload.sub).select(
      'name city district street phone email createdAt updatedAt',
    )

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/auth/register', requireTrustedOrigin, authLimiter, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parsed.error.flatten() })
  }

  const data = {
    ...parsed.data,
    email: parsed.data.email.toLowerCase(),
    phone: parsed.data.phone.replace(/\s+/g, ''),
  }

  const existing = await User.findOne({
    $or: [{ email: data.email }, { phone: data.phone }],
  }).select('_id email phone')

  if (existing) {
    return res.status(409).json({ message: 'Email or phone already exists' })
  }

  const passwordHash = await bcrypt.hash(data.password, 12)

  const created = await User.create({
    name: data.name,
    city: data.city,
    district: data.district,
    street: data.street,
    phone: data.phone,
    email: data.email,
    passwordHash,
  })

  return res.status(201).json({
    message: 'Registration successful. Please sign in.',
    user: {
      id: created._id,
      name: created.name,
      city: created.city,
      district: created.district,
      street: created.street,
      phone: created.phone,
      email: created.email,
    },
  })
})

app.post('/api/auth/login', requireTrustedOrigin, authLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input' })
  }

  const email = parsed.data.email.toLowerCase()
  const user = await User.findOne({ email }).select('passwordHash name city district street phone email')

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash)
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const token = makeToken(user)
  setAuthCookie(res, token)

  return res.json({
    user: {
      id: user._id,
      name: user.name,
      city: user.city,
      district: user.district,
      street: user.street,
      phone: user.phone,
      email: user.email,
    },
  })
})

app.post('/api/auth/logout', requireTrustedOrigin, (_req, res) => {
  clearAuthCookie(res)
  res.status(204).send()
})

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

app.post('/api/auth/change-password', requireTrustedOrigin, requireAuth, authLimiter, async (req, res) => {
  const parsed = changePasswordSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input' })
  }

  const userRecord = await User.findById(req.user._id).select('passwordHash')
  if (!userRecord) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const isCurrentValid = await bcrypt.compare(
    parsed.data.currentPassword,
    userRecord.passwordHash,
  )

  if (!isCurrentValid) {
    return res.status(400).json({ message: 'Current password is incorrect' })
  }

  const sameAsOld = await bcrypt.compare(parsed.data.newPassword, userRecord.passwordHash)
  if (sameAsOld) {
    return res.status(400).json({ message: 'New password must be different' })
  }

  userRecord.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12)
  await userRecord.save()

  return res.json({ message: 'Password changed successfully' })
})

app.post('/api/orders', requireTrustedOrigin, orderLimiter, async (req, res) => {
  const parsed = orderCreateSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parsed.error.flatten() })
  }

  const data = parsed.data
  const authUser = await getOptionalAuthUser(req)
  const orderNumber = buildOrderNumber()
  const uniqueAdditionalItems = [...new Set(data.additionalItems)]
  const normalizedFurnitureCount = uniqueAdditionalItems.includes('full_premises_chem')
    ? data.furnitureCount
    : 0
  const serviceItemsForPricing = {
    baseService: data.baseService,
    additionalItems: uniqueAdditionalItems,
    furnitureCount: normalizedFurnitureCount,
  }
  const priceResult = calculateEstimatedCost({
    serviceItems: serviceItemsForPricing,
    objectType: data.objectType,
    area: data.area,
  })
  const estimatedCost = priceResult.total

  const created = await Order.create({
    orderNumber,
    userId: authUser?._id,
    user: {
      name: data.name,
      phone: data.phone.replace(/\s+/g, ''),
      email: authUser?.email,
    },
    city: data.city,
    address: data.address,
    area: data.area,
    objectType: data.objectType,
    baseService: data.baseService,
    additionalItems: uniqueAdditionalItems,
    furnitureCount: normalizedFurnitureCount,
    scheduledDate: data.date,
    scheduledTime: data.time,
    comment: data.comment,
    estimatedCost,
    pricingBreakdown: priceResult.pricingBreakdown,
    status: 'new',
  })

  return res.status(201).json({
    message: 'Order created',
    order: {
      id: created._id,
      orderNumber: created.orderNumber,
      estimatedCost: created.estimatedCost,
      city: created.city,
      baseService: created.baseService,
      objectType: created.objectType,
      additionalItems: created.additionalItems,
      furnitureCount: created.furnitureCount,
      pricingBreakdown: created.pricingBreakdown,
      status: created.status,
    },
  })
})

if (NODE_ENV === 'production') {
  app.use(express.static(clientDistPath, { index: false }))

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next()
    }

    if (req.method !== 'GET') {
      return next()
    }

    return res.sendFile(path.join(clientDistPath, 'index.html'))
  })
}

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(Number(PORT), () => {
  console.log(`API running on http://localhost:${PORT}`)
})
