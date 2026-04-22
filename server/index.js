import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
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

const orderServiceOptions = ['regular', 'deep', 'post_renovation']
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
    serviceItems: {
      type: [String],
      required: true,
      enum: orderServiceOptions,
      validate: [(value) => value.length > 0, 'At least one service item is required'],
    },
    scheduledDate: { type: String, required: true, trim: true },
    scheduledTime: { type: String, required: true, trim: true },
    comment: { type: String, trim: true, default: '' },
    estimatedCost: { type: Number, required: true, min: 0 },
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
  serviceItems: z.array(z.enum(orderServiceOptions)).min(1).max(3),
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
  const serviceBasePrice = {
    regular: 90,
    deep: 150,
    post_renovation: 210,
  }
  const objectMultiplier = {
    apartment: 1,
    house: 1.25,
    office: 1.4,
    garage: 1.1,
  }

  const servicesTotal = serviceItems.reduce((total, currentService) => {
    return total + (serviceBasePrice[currentService] || 0)
  }, 0)

  const areaPart = area * 1.2
  const total = (servicesTotal + areaPart) * (objectMultiplier[objectType] || 1)

  return Math.round(total)
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

app.post('/api/auth/register', authLimiter, async (req, res) => {
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

app.post('/api/auth/login', authLimiter, async (req, res) => {
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

app.post('/api/auth/logout', (_req, res) => {
  clearAuthCookie(res)
  res.status(204).send()
})

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

app.post('/api/auth/change-password', requireAuth, authLimiter, async (req, res) => {
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

app.post('/api/orders', async (req, res) => {
  const parsed = orderCreateSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parsed.error.flatten() })
  }

  const data = parsed.data
  const authUser = await getOptionalAuthUser(req)
  const orderNumber = buildOrderNumber()
  const estimatedCost = calculateEstimatedCost(data)

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
    serviceItems: [...new Set(data.serviceItems)],
    scheduledDate: data.date,
    scheduledTime: data.time,
    comment: data.comment,
    estimatedCost,
    status: 'new',
  })

  return res.status(201).json({
    message: 'Order created',
    order: {
      id: created._id,
      orderNumber: created.orderNumber,
      estimatedCost: created.estimatedCost,
      city: created.city,
      objectType: created.objectType,
      serviceItems: created.serviceItems,
      status: created.status,
    },
  })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(Number(PORT), () => {
  console.log(`API running on http://localhost:${PORT}`)
})
