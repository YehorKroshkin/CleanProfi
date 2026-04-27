import { useMemo, useState, type FormEvent } from 'react'
import { createOrder, type CreatedOrder } from '../api/orders'

type Language = 'en' | 'ru' | 'uk' | 'pl'

type Translation = {
  orderPageTitle: string
  orderPageSubtitle: string
  orderSubmit: string
  orderService: string
  orderArea: string
  orderDate: string
  orderTime: string
  orderName: string
  orderPhone: string
  orderAddress: string
  orderComment: string
  orderObjectType: string
  orderFormTitle: string
  orderSuccessTitle: string
  orderSuccessText: string
}

type UserProfile = {
  name: string
  phone: string
  city: string
  email: string
}

type OrderPageProps = {
  language: Language
  city: string
  labels: Translation
  user?: UserProfile
}

type BaseServiceKey = 'regular' | 'deep' | 'post_renovation' | 'office'
type AdditionalServiceKey =
  | 'sofa_chem_2p'
  | 'chairs_chem'
  | 'carpet_chem_3m'
  | 'mattress_chem_2p'
  | 'bed_chem_2p'
  | 'kitchen_wet_cleaning'
  | 'stove_hood_chem'
  | 'full_premises_chem'
type ObjectTypeKey = 'apartment' | 'house' | 'office' | 'garage'

type OrderFormState = {
  baseService: BaseServiceKey | ''
  additionalItems: AdditionalServiceKey[]
  furnitureCount: string
  objectType: ObjectTypeKey
  area: string
  date: string
  time: string
  name: string
  phone: string
  address: string
  comment: string
  acceptedTerms: boolean
}

const baseServiceLabels: Record<Language, Record<BaseServiceKey, string>> = {
  en: {
    regular: 'Regular cleaning',
    deep: 'Deep cleaning',
    post_renovation: 'Post-renovation cleaning',
    office: 'Office cleaning',
  },
  ru: {
    regular: 'Поддерживающая уборка',
    deep: 'Генеральная уборка',
    post_renovation: 'Уборка после ремонта',
    office: 'Уборка офисов',
  },
  uk: {
    regular: 'Підтримувальне прибирання',
    deep: 'Генеральне прибирання',
    post_renovation: 'Прибирання після ремонту',
    office: 'Прибирання офісів',
  },
  pl: {
    regular: 'Sprzątanie regularne',
    deep: 'Sprzątanie generalne',
    post_renovation: 'Sprzątanie po remoncie',
    office: 'Sprzątanie biur',
  },
}

const additionalServiceLabels: Record<Language, Record<AdditionalServiceKey, string>> = {
  en: {
    sofa_chem_2p: 'Sofa dry cleaning (2-seater) - 150 zł',
    chairs_chem: 'Chair dry cleaning - 50 zł',
    carpet_chem_3m: 'Carpet dry cleaning (~3m) - 200 zł',
    mattress_chem_2p: 'Mattress dry cleaning (2-seater) - 100 zł',
    bed_chem_2p: 'Bed dry cleaning (2-seater) - 150 zł',
    kitchen_wet_cleaning: 'Kitchen wet cleaning (without stove and hood) - 100 zł',
    stove_hood_chem: 'Chemical stove + hood cleaning - 100 zł',
    full_premises_chem: 'Chemical cleaning of full room +50 zł per furniture item',
  },
  ru: {
    sofa_chem_2p: 'Химчистка дивана (2-спальный) - 150 zł',
    chairs_chem: 'Химчистка стульев - 50 zł',
    carpet_chem_3m: 'Химчистка ковра (~3м) - 200 zł',
    mattress_chem_2p: 'Химчистка матраса (2-спальный) - 100 zł',
    bed_chem_2p: 'Химчистка кровати (2-спальная) - 150 zł',
    kitchen_wet_cleaning: 'Влажная уборка кухни (без плиты и вытяжки) - 100 zł',
    stove_hood_chem: 'Химчистка плиты и вытяжки - 100 zł',
    full_premises_chem: 'Химическое мытье помещения +50 zł за каждую мебель',
  },
  uk: {
    sofa_chem_2p: 'Хімчистка дивана (2-місний) - 150 zł',
    chairs_chem: 'Хімчистка стільців - 50 zł',
    carpet_chem_3m: 'Хімчистка килима (~3м) - 200 zł',
    mattress_chem_2p: 'Хімчистка матраца (2-місний) - 100 zł',
    bed_chem_2p: 'Хімчистка ліжка (2-місне) - 150 zł',
    kitchen_wet_cleaning: 'Вологе прибирання кухні (без плити та витяжки) - 100 zł',
    stove_hood_chem: 'Хімчистка плити та витяжки - 100 zł',
    full_premises_chem: 'Хімічне миття всього приміщення +50 zł за кожну мебель',
  },
  pl: {
    sofa_chem_2p: 'Pranie kanapy (2-osobowej) - 150 zł',
    chairs_chem: 'Pranie krzeseł - 50 zł',
    carpet_chem_3m: 'Pranie dywanu (~3m) - 200 zł',
    mattress_chem_2p: 'Pranie materaca (2-osobowego) - 100 zł',
    bed_chem_2p: 'Pranie łóżka (2-osobowego) - 150 zł',
    kitchen_wet_cleaning: 'Mokre sprzątanie kuchni (bez płyty i okapu) - 100 zł',
    stove_hood_chem: 'Chemiczne mycie płyty i okapu - 100 zł',
    full_premises_chem: 'Chemiczne mycie całego pomieszczenia +50 zł za każdy mebel',
  },
}

const objectTypeLabels: Record<Language, Record<ObjectTypeKey, string>> = {
  en: {
    apartment: 'Apartment',
    house: 'House',
    office: 'Office',
    garage: 'Garage',
  },
  ru: {
    apartment: 'Квартира',
    house: 'Дом',
    office: 'Офис',
    garage: 'Гараж',
  },
  uk: {
    apartment: 'Квартира',
    house: 'Будинок',
    office: 'Офіс',
    garage: 'Гараж',
  },
  pl: {
    apartment: 'Mieszkanie',
    house: 'Dom',
    office: 'Biuro',
    garage: 'Garaż',
  },
}

const baseServiceDetails: Record<Language, Record<BaseServiceKey, string[]>> = {
  en: {
    regular: [
      'Starting from 200 zł for 1 room + 1 toilet (30-38 m²).',
      'For area above 38 m²: +6.99 zł per each extra m².',
      'Includes vacuuming, floor washing, dust wiping, and basic kitchen cleaning with dish washing.',
    ],
    deep: [
      'Starting from 250 zł for 1 room + 1 toilet (30-38 m²).',
      'For area above 38 m²: +6.99 zł per each extra m².',
      'Includes windows, shower cabin, bath, toilet, cabinet washing, plus everything from regular cleaning and full kitchen chemical cleaning.',
    ],
    post_renovation: [
      'Starting from 170 zł for 30-38 m².',
      'For area above 38 m²: +7.99 zł per each extra m².',
      'Includes trash cleanup, dust removal, vacuuming, and wet cleaning.',
    ],
    office: [
      'Starting from 100 zł for 30-38 m².',
      'For area above 38 m²: +5 zł per each extra m².',
      'Includes wet cleaning, vacuuming, floor washing, and dust cleaning. Kitchen cleaning is available separately for 100 zł.',
    ],
  },
  ru: {
    regular: [
      'Старт от 200 zł за 1 комнату и 1 туалет (30-38 м²).',
      'Если площадь больше 38 м²: +6.99 zł за каждый следующий м².',
      'Входит: пылесос, мытьё полов, вытирание пыли, базовая уборка кухни и мытьё посуды.',
    ],
    deep: [
      'Старт от 250 zł за 1 комнату и 1 туалет (30-38 м²).',
      'Если площадь больше 38 м²: +6.99 zł за каждый следующий м².',
      'Входит: мытьё окон, душевой кабины, ванной (если есть), туалета, шкафов, плюс всё из обычной уборки и полная мойка кухни химией.',
    ],
    post_renovation: [
      'Старт от 170 zł за помещение (30-38 м²).',
      'Если площадь больше 38 м²: +7.99 zł за каждый следующий м².',
      'Входит: уборка мусора, очистка от пыли, пылесос и влажная уборка.',
    ],
    office: [
      'Старт от 100 zł за помещение (30-38 м²).',
      'Если площадь больше 38 м²: +5 zł за каждый следующий м².',
      'Входит: влажная уборка, пылесос, мытьё полов, чистка от пыли. Уборка кухни - отдельно за 100 zł.',
    ],
  },
  uk: {
    regular: [
      'Старт від 200 zł за 1 кімнату і 1 туалет (30-38 м²).',
      'Якщо площа більша за 38 м²: +6.99 zł за кожен наступний м².',
      'Входить: пилосос, миття підлоги, витирання пилу, базове прибирання кухні та миття посуду.',
    ],
    deep: [
      'Старт від 250 zł за 1 кімнату і 1 туалет (30-38 м²).',
      'Якщо площа більша за 38 м²: +6.99 zł за кожен наступний м².',
      'Входить: миття вікон, душової кабіни, ванни (якщо є), туалету, шаф, плюс усе зі звичайного прибирання та повне миття кухні хімією.',
    ],
    post_renovation: [
      'Старт від 170 zł за приміщення (30-38 м²).',
      'Якщо площа більша за 38 м²: +7.99 zł за кожен наступний м².',
      'Входить: прибирання сміття, очистка від пилу, пилосос і вологе прибирання.',
    ],
    office: [
      'Старт від 100 zł за приміщення (30-38 м²).',
      'Якщо площа більша за 38 м²: +5 zł за кожен наступний м².',
      'Входить: вологе прибирання, пилосос, миття підлоги, очистка від пилу. Прибирання кухні - окремо за 100 zł.',
    ],
  },
  pl: {
    regular: [
      'Start od 200 zł za 1 pokój i 1 toaletę (30-38 m²).',
      'Powyżej 38 m²: +6.99 zł za każdy dodatkowy m².',
      'W cenie: odkurzanie, mycie podłogi, ścieranie kurzu, podstawowe sprzątanie kuchni i mycie naczyń.',
    ],
    deep: [
      'Start od 250 zł za 1 pokój i 1 toaletę (30-38 m²).',
      'Powyżej 38 m²: +6.99 zł za każdy dodatkowy m².',
      'W cenie: mycie okien, kabiny prysznicowej, wanny (jeśli jest), toalety, szafek, plus wszystko z regularnego sprzątania i pełne mycie kuchni chemią.',
    ],
    post_renovation: [
      'Start od 170 zł za pomieszczenie (30-38 m²).',
      'Powyżej 38 m²: +7.99 zł za każdy dodatkowy m².',
      'W cenie: usunięcie śmieci, czyszczenie kurzu, odkurzanie i mycie na mokro.',
    ],
    office: [
      'Start od 100 zł za pomieszczenie (30-38 m²).',
      'Powyżej 38 m²: +5 zł za każdy dodatkowy m².',
      'W cenie: sprzątanie na mokro, odkurzanie, mycie podłogi, usuwanie kurzu. Sprzątanie kuchni osobno - 100 zł.',
    ],
  },
}

const uiText: Record<Language, {
  estimateTitle: string
  estimateRange: string
  baseServicesTitle: string
  addOnsTitle: string
  detailsLabel: string
  furnitureCountLabel: string
  selectBaseServiceError: string
  pricingBaseLabel: string
  pricingAreaLabel: string
  pricingAddonsLabel: string
  terms: string
  orderNumber: string
  estimatedCost: string
  saved: string
  validationDate: string
  validationTerms: string
  fillFormBtn: string
  closeBtn: string
}> = {
  en: {
    estimateTitle: 'Approximate estimate',
    estimateRange: 'If any questions arise, we will contact you to clarify the details.',
    baseServicesTitle: 'Base cleaning service',
    addOnsTitle: 'Additional services',
    detailsLabel: 'What is included',
    furnitureCountLabel: 'Furniture pieces count',
    selectBaseServiceError: 'Please select a base cleaning service.',
    pricingBaseLabel: 'Base service',
    pricingAreaLabel: 'Area surcharge',
    pricingAddonsLabel: 'Additional services',
    terms: 'I agree to personal data processing and order confirmation call.',
    orderNumber: 'Order No.',
    estimatedCost: 'Estimated cost',
    saved: 'Order has been sent successfully.',
    validationDate: 'Please choose today or a future date.',
    validationTerms: 'Please accept terms before submitting.',
    fillFormBtn: 'Fill form with my user data',
    closeBtn: 'Close',
  },
  ru: {
    estimateTitle: 'Ориентировочная стоимость',
    estimateRange: 'При возникновении вопросов мы свяжемся для уточнения.',
    baseServicesTitle: 'Базовый тип уборки',
    addOnsTitle: 'Дополнительные услуги',
    detailsLabel: 'Что входит',
    furnitureCountLabel: 'Количество единиц мебели',
    selectBaseServiceError: 'Выберите базовый тип уборки.',
    pricingBaseLabel: 'Базовая услуга',
    pricingAreaLabel: 'Доплата за площадь',
    pricingAddonsLabel: 'Дополнительные услуги',
    terms: 'Согласен на обработку персональных данных и звонок для подтверждения заказа.',
    orderNumber: 'Номер заказа',
    estimatedCost: 'Оценочная стоимость',
    saved: 'Заявка успешно отправлена.',
    validationDate: 'Выберите сегодняшнюю или будущую дату.',
    validationTerms: 'Подтвердите согласие перед отправкой.',
    fillFormBtn: 'Заполнить мои данные',
    closeBtn: 'Закрыть',
  },
  uk: {
    estimateTitle: 'Орієнтовна вартість',
    estimateRange: 'У разі виникнення запитань ми зв’яжемося для уточнення.',
    baseServicesTitle: 'Базовий тип прибирання',
    addOnsTitle: 'Додаткові послуги',
    detailsLabel: 'Що входить',
    furnitureCountLabel: 'Кількість одиниць меблів',
    selectBaseServiceError: 'Оберіть базовий тип прибирання.',
    pricingBaseLabel: 'Базова послуга',
    pricingAreaLabel: 'Доплата за площу',
    pricingAddonsLabel: 'Додаткові послуги',
    terms: 'Погоджуюсь на обробку персональних даних і дзвінок для підтвердження замовлення.',
    orderNumber: 'Номер замовлення',
    estimatedCost: 'Орієнтовна вартість',
    saved: 'Заявку успішно надіслано.',
    validationDate: 'Оберіть сьогоднішню або майбутню дату.',
    validationTerms: 'Підтвердьте згоду перед надсиланням.',
    fillFormBtn: 'Заповнити мої дані',
    closeBtn: 'Закрити',
  },
  pl: {
    estimateTitle: 'Szacunkowy koszt',
    estimateRange: 'W razie pytań skontaktujemy się w celu doprecyzowania.',
    baseServicesTitle: 'Podstawowy typ sprzątania',
    addOnsTitle: 'Dodatkowe usługi',
    detailsLabel: 'Co obejmuje',
    furnitureCountLabel: 'Liczba mebli',
    selectBaseServiceError: 'Wybierz podstawowy typ sprzątania.',
    pricingBaseLabel: 'Usługa bazowa',
    pricingAreaLabel: 'Dopłata za metraż',
    pricingAddonsLabel: 'Dodatkowe usługi',
    terms: 'Wyrażam zgodę na przetwarzanie danych i kontakt telefoniczny w celu potwierdzenia zamówienia.',
    orderNumber: 'Numer zamówienia',
    estimatedCost: 'Szacunkowy koszt',
    saved: 'Zgłoszenie zostało wysłane.',
    validationDate: 'Wybierz dzisiejszą lub przyszłą datę.',
    validationTerms: 'Zaakceptuj zgodę przed wysłaniem.',
    fillFormBtn: 'Wypełnij formularz moimi danymi',
    closeBtn: 'Zamknij',
  },
}

const baseServiceKeys: BaseServiceKey[] = ['regular', 'deep', 'post_renovation', 'office']
const additionalServiceKeys: AdditionalServiceKey[] = [
  'sofa_chem_2p',
  'chairs_chem',
  'carpet_chem_3m',
  'mattress_chem_2p',
  'bed_chem_2p',
  'kitchen_wet_cleaning',
  'stove_hood_chem',
  'full_premises_chem',
]
const additionalServiceCodes: Record<AdditionalServiceKey, string> = {
  sofa_chem_2p: '/extra-service/seater-sofa.png',
  chairs_chem: '/extra-service/chair.png',
  carpet_chem_3m: '/extra-service/adornment.png',
  mattress_chem_2p: '/extra-service/air-mattress.png',
  bed_chem_2p: '/extra-service/double-bed.png',
  kitchen_wet_cleaning: '/extra-service/kitchen.png',
  stove_hood_chem: '/extra-service/stove.png',
  full_premises_chem: '/extra-service/cleaning-liquid.png',
}
const additionalServicePriceBadges: Record<AdditionalServiceKey, string> = {
  sofa_chem_2p: '150 zł',
  chairs_chem: '50 zł',
  carpet_chem_3m: '200 zł',
  mattress_chem_2p: '100 zł',
  bed_chem_2p: '150 zł',
  kitchen_wet_cleaning: '100 zł',
  stove_hood_chem: '100 zł',
  full_premises_chem: '+50 zł',
}
const objectTypeKeys: ObjectTypeKey[] = ['apartment', 'house', 'office', 'garage']

function getAdditionalServiceTitle(service: AdditionalServiceKey, label: string) {
  if (service === 'full_premises_chem') {
    return label.replace(/\s*\+\d+(?:[.,]\d+)?\s*zł.*$/iu, '').trim()
  }

  const splitMarker = ' - '
  const markerIndex = label.indexOf(splitMarker)

  if (markerIndex === -1) {
    return label
  }

  return label.slice(0, markerIndex).trim()
}

function estimateCost(form: OrderFormState) {
  const areaNumber = Number(form.area || 0)
  const basePricing: Record<BaseServiceKey, { base: number; extraPerSqm: number }> = {
    regular: { base: 200, extraPerSqm: 6.99 },
    deep: { base: 250, extraPerSqm: 6.99 },
    post_renovation: { base: 170, extraPerSqm: 7.99 },
    office: { base: 100, extraPerSqm: 5 },
  }
  const addOnPricing: Record<AdditionalServiceKey, number> = {
    sofa_chem_2p: 150,
    chairs_chem: 50,
    carpet_chem_3m: 200,
    mattress_chem_2p: 100,
    bed_chem_2p: 150,
    kitchen_wet_cleaning: 100,
    stove_hood_chem: 100,
    full_premises_chem: 0,
  }

  if (!form.baseService) {
    return {
      total: 0,
      basePrice: 0,
      areaSurcharge: 0,
      addOnsTotal: 0,
    }
  }

  const basePrice = basePricing[form.baseService].base
  const areaSurcharge = Math.max(0, areaNumber - 38) * basePricing[form.baseService].extraPerSqm
  const addOnsCore = form.additionalItems.reduce((total, item) => total + addOnPricing[item], 0)
  const furnitureCount = Number(form.furnitureCount || 0)
  const furnitureSurcharge = form.additionalItems.includes('full_premises_chem')
    ? Math.max(0, furnitureCount) * 50
    : 0
  const addOnsTotal = addOnsCore + furnitureSurcharge
  const total = basePrice + areaSurcharge + addOnsTotal

  return {
    total: Math.round(total * 100) / 100,
    basePrice: Math.round(basePrice * 100) / 100,
    areaSurcharge: Math.round(areaSurcharge * 100) / 100,
    addOnsTotal: Math.round(addOnsTotal * 100) / 100,
  }
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

export function OrderPage({ language, city, labels, user }: OrderPageProps) {
  const [form, setForm] = useState<OrderFormState>({
    baseService: '',
    additionalItems: [],
    furnitureCount: '',
    objectType: 'apartment',
    area: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    address: '',
    comment: '',
    acceptedTerms: false,
  })
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const estimate = useMemo(() => estimateCost(form), [form])
  const serviceText = useMemo(
    () => form.additionalItems.map((service) => additionalServiceLabels[language][service]).join(', '),
    [form.additionalItems, language],
  )

  function updateField<Field extends keyof OrderFormState>(field: Field, value: OrderFormState[Field]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function selectBaseService(service: BaseServiceKey) {
    setForm((current) => ({
      ...current,
      baseService: service,
      objectType: service === 'office' ? 'office' : current.objectType,
    }))
  }

  function toggleAdditionalService(service: AdditionalServiceKey) {
    setForm((current) => {
      const exists = current.additionalItems.includes(service)
      if (exists) {
        const remaining = current.additionalItems.filter((value) => value !== service)
        return {
          ...current,
          additionalItems: remaining,
          furnitureCount:
            service === 'full_premises_chem' ? '' : current.furnitureCount,
        }
      }

      return {
        ...current,
        additionalItems: [...current.additionalItems, service],
      }
    })
  }

  function fillFormWithUserData() {
    if (!user) return
    setForm((current) => ({
      ...current,
      name: user.name,
      phone: user.phone,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorText('')

    if (!form.baseService) {
      setErrorText(uiText[language].selectBaseServiceError)
      return
    }

    if (!form.acceptedTerms) {
      setErrorText(uiText[language].validationTerms)
      return
    }

    if (form.date < todayIsoDate()) {
      setErrorText(uiText[language].validationDate)
      return
    }

    try {
      setIsSubmitting(true)
      const result = await createOrder({
        name: form.name.trim(),
        phone: form.phone.trim(),
        city,
        address: form.address.trim(),
        area: Number(form.area),
        objectType: form.objectType,
        baseService: form.baseService,
        additionalItems: form.additionalItems,
        furnitureCount: form.additionalItems.includes('full_premises_chem')
          ? Number(form.furnitureCount || 0)
          : 0,
        date: form.date,
        time: form.time,
        comment: form.comment.trim(),
      })

      setCreatedOrder(result.order)
      setShowSuccessModal(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed'
      setErrorText(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValidBase =
    form.baseService.length > 0 &&
    form.name.trim().length >= 2 &&
    form.phone.trim().length >= 8 &&
    form.address.trim().length >= 5 &&
    Number(form.area) > 0 &&
    form.date.length > 0 &&
    form.time.length > 0

  return (
    <div className="order-page">
      <section className="hero-block">
        <p className="city-pill">{city}</p>
        <h1>{labels.orderPageTitle}</h1>
        <p className="hero-subtitle">{labels.orderPageSubtitle}</p>
      </section>

      <div className="order-layout">
        <section className="order-form-card">
          <h2>{labels.orderFormTitle}</h2>
          <form className="order-form" onSubmit={(event) => void handleSubmit(event)}>
            <fieldset className="order-services-fieldset">
              <legend>{uiText[language].baseServicesTitle}</legend>
              <div className="order-services-cards">
                {baseServiceKeys.map((service) => (
                  <label key={service} className="service-option-card">
                    <div className="service-option-head">
                      <input
                        type="radio"
                        name="baseService"
                        checked={form.baseService === service}
                        onChange={() => selectBaseService(service)}
                      />
                      <span className="service-check-name">{baseServiceLabels[language][service]}</span>
                    </div>
                    <details className="service-details-popup">
                      <summary>{uiText[language].detailsLabel}</summary>
                      <ul>
                        {baseServiceDetails[language][service].map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </details>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="order-services-fieldset">
              <legend>{uiText[language].addOnsTitle}</legend>
              <div className="order-services-list">
                {additionalServiceKeys.map((service) => {
                  const rawLabel = additionalServiceLabels[language][service]
                  const serviceTitle = getAdditionalServiceTitle(service, rawLabel)

                  return (
                    <label key={service} className="service-check-row">
                      <input
                        type="checkbox"
                        checked={form.additionalItems.includes(service)}
                        onChange={() => toggleAdditionalService(service)}
                      />
                      <span className="service-code-badge" aria-hidden="true">
                        <img
                          className="service-code-icon"
                          src={additionalServiceCodes[service]}
                          alt=""
                        />
                      </span>
                      <span className="service-check-name">{serviceTitle}</span>
                      <span className="service-price-pill">{additionalServicePriceBadges[service]}</span>
                    </label>
                  )
                })}
              </div>
              {form.additionalItems.includes('full_premises_chem') ? (
                <label className="furniture-count-field">
                  {uiText[language].furnitureCountLabel}
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.furnitureCount}
                    onChange={(event) => updateField('furnitureCount', event.target.value)}
                    placeholder="0"
                  />
                </label>
              ) : null}
            </fieldset>

            <div className="form-grid">
              <label>
                {labels.orderObjectType}
                <select
                  value={form.objectType}
                  disabled={form.baseService === 'office'}
                  onChange={(event) => updateField('objectType', event.target.value as ObjectTypeKey)}
                >
                  {objectTypeKeys.map((option) => (
                    <option key={option} value={option}>
                      {objectTypeLabels[language][option]}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                {labels.orderArea}
                <input
                  type="number"
                  min="1"
                  value={form.area}
                  onChange={(event) => updateField('area', event.target.value)}
                  placeholder="70"
                  required
                />
              </label>
            </div>

            <div className="form-grid">
              <label>
                {labels.orderDate}
                <input
                  type="date"
                  min={todayIsoDate()}
                  value={form.date}
                  onChange={(event) => updateField('date', event.target.value)}
                  required
                />
              </label>

              <label>
                {labels.orderTime}
                <input
                  type="time"
                  value={form.time}
                  onChange={(event) => updateField('time', event.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-grid">
              <label>
                {labels.orderName}
                <input
                  type="text"
                  minLength={2}
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  required
                />
              </label>

              <label>
                {labels.orderPhone}
                <input
                  type="tel"
                  pattern="^\\+?[0-9()\\-\\s]{8,20}$"
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  required
                />
              </label>
            </div>

            <label>
              {labels.orderAddress}
              <input
                type="text"
                minLength={5}
                value={form.address}
                onChange={(event) => updateField('address', event.target.value)}
                required
              />
            </label>

            {user && (
              <button
                type="button"
                className="fill-form-btn"
                onClick={fillFormWithUserData}
              >
                {uiText[language].fillFormBtn}
              </button>
            )}

            <label>
              {labels.orderComment}
              <textarea
                value={form.comment}
                onChange={(event) => updateField('comment', event.target.value)}
              />
            </label>

            <label className="terms-row">
              <span>{uiText[language].terms}</span>
              <input
                className="terms-checkbox"
                type="checkbox"
                checked={form.acceptedTerms}
                onChange={(event) => updateField('acceptedTerms', event.target.checked)}
              />
            </label>

            {errorText ? <p className="auth-error">{errorText}</p> : null}

            <button type="submit" className="primary-btn" disabled={isSubmitting || !isValidBase}>
              {labels.orderSubmit}
            </button>
          </form>
        </section>

        <aside className="order-summary-card">
          <h2>{uiText[language].estimateTitle}</h2>
          <div className="order-summary">
            {createdOrder ? (
              <>
                <div className="order-summary-row">
                  <strong>{uiText[language].orderNumber}</strong>
                  <span>{createdOrder.orderNumber}</span>
                </div>
                <div className="order-summary-row">
                  <strong>{uiText[language].estimatedCost}</strong>
                  <span>{createdOrder.estimatedCost} zł</span>
                </div>
                <div className="order-summary-row">
                  <strong>{uiText[language].pricingBaseLabel}</strong>
                  <span>
                    {baseServiceLabels[language][createdOrder.baseService]}
                  </span>
                </div>
                <div className="order-summary-row">
                  <strong>{uiText[language].pricingAreaLabel}</strong>
                  <span>{createdOrder.pricingBreakdown.areaSurcharge} zł</span>
                </div>
                <div className="order-summary-row">
                  <strong>{uiText[language].pricingAddonsLabel}</strong>
                  <span>{createdOrder.pricingBreakdown.addOnsTotal} zł</span>
                </div>
                <div className="order-summary-row">
                  <strong>{labels.orderObjectType}</strong>
                  <span>{objectTypeLabels[language][createdOrder.objectType]}</span>
                </div>
              </>
            ) : (
              <>
                <div className="order-summary-row">
                  <strong>{uiText[language].pricingBaseLabel}</strong>
                  <span>
                    {form.baseService
                      ? baseServiceLabels[language][form.baseService]
                      : '—'}
                  </span>
                </div>
                <div className="order-summary-row">
                  <strong>{uiText[language].pricingAreaLabel}</strong>
                  <span>{estimate.areaSurcharge} zł</span>
                </div>
                <div className="order-summary-row">
                  <strong>{uiText[language].pricingAddonsLabel}</strong>
                  <span>{serviceText || '—'}</span>
                </div>
                <div className="order-summary-row">
                  <strong>{labels.orderObjectType}</strong>
                  <span>{objectTypeLabels[language][form.objectType]}</span>
                </div>
                <div className="order-summary-row">
                  <strong>{uiText[language].estimatedCost}</strong>
                  <span>{estimate.total} zł</span>
                </div>
                <div className="order-summary-row">
                  <strong>{labels.orderArea}</strong>
                  <span>{form.area ? `${form.area} m²` : '—'}</span>
                </div>
              </>
            )}
          </div>
          <p className="estimate-info">
            <span>{uiText[language].estimateRange}</span>
            <img className="estimate-info-icon" src="/letter-i.png" alt="" aria-hidden="true" />
          </p>
        </aside>
        
      </div>

      {showSuccessModal && createdOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{labels.orderSuccessTitle}</h2>
            <p>{labels.orderSuccessText}</p>
            <div className="order-summary">
              <div className="order-summary-row">
                <strong>{uiText[language].orderNumber}</strong>
                <span>{createdOrder.orderNumber}</span>
              </div>
              <div className="order-summary-row">
                <strong>{uiText[language].estimatedCost}</strong>
                <span>{createdOrder.estimatedCost} zł</span>
              </div>
              <div className="order-summary-row">
                <strong>{uiText[language].pricingBaseLabel}</strong>
                <span>
                  {baseServiceLabels[language][createdOrder.baseService]}
                </span>
              </div>
              <div className="order-summary-row">
                <strong>{uiText[language].pricingAreaLabel}</strong>
                <span>{createdOrder.pricingBreakdown.areaSurcharge} zł</span>
              </div>
              <div className="order-summary-row">
                <strong>{uiText[language].pricingAddonsLabel}</strong>
                <span>{createdOrder.additionalItems.length ? createdOrder.additionalItems.map((item) => additionalServiceLabels[language][item as AdditionalServiceKey]).join(', ') : '—'}</span>
              </div>
              <div className="order-summary-row">
                <strong>{labels.orderObjectType}</strong>
                <span>{objectTypeLabels[language][createdOrder.objectType]}</span>
              </div>
            </div>
            <button
              className="modal-close-btn"
              onClick={() => {
                setShowSuccessModal(false)
                setCreatedOrder(null)
                setForm({
                  baseService: '',
                  additionalItems: [],
                  furnitureCount: '',
                  objectType: 'apartment',
                  area: '',
                  date: '',
                  time: '',
                  name: '',
                  phone: '',
                  address: '',
                  comment: '',
                  acceptedTerms: false,
                })
              }}
            >
              {uiText[language].closeBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

