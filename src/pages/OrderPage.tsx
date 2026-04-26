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

type ServiceKey = 'regular' | 'deep' | 'post_renovation'
type ObjectTypeKey = 'apartment' | 'house' | 'office' | 'garage'

type OrderFormState = {
  serviceItems: ServiceKey[]
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

const serviceBasePrice: Record<ServiceKey, number> = {
  regular: 90,
  deep: 150,
  post_renovation: 210,
}

const objectMultiplier: Record<ObjectTypeKey, number> = {
  apartment: 1,
  house: 1.25,
  office: 1.4,
  garage: 1.1,
}

const serviceLabels: Record<Language, Record<ServiceKey, string>> = {
  en: {
    regular: 'Regular cleaning',
    deep: 'Deep cleaning',
    post_renovation: 'Post-renovation cleaning',
  },
  ru: {
    regular: 'Поддерживающая уборка',
    deep: 'Генеральная уборка',
    post_renovation: 'Уборка после ремонта',
  },
  uk: {
    regular: 'Підтримувальне прибирання',
    deep: 'Генеральне прибирання',
    post_renovation: 'Прибирання після ремонту',
  },
  pl: {
    regular: 'Sprzątanie regularne',
    deep: 'Sprzątanie generalne',
    post_renovation: 'Sprzątanie po remoncie',
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

const uiText: Record<Language, {
  estimateTitle: string
  estimateRange: string
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
    estimateRange: 'Final price may vary depending on real condition and details on site.',
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
    estimateRange: 'Итоговая цена может немного меняться после уточнения деталей на объекте.',
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
    estimateRange: 'Підсумкова ціна може трохи змінюватися після уточнення деталей на обʼєкті.',
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
    estimateRange: 'Cena końcowa może się nieznacznie różnić po doprecyzowaniu szczegółów na miejscu.',
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

const serviceKeys: ServiceKey[] = ['regular', 'deep', 'post_renovation']
const objectTypeKeys: ObjectTypeKey[] = ['apartment', 'house', 'office', 'garage']

function estimateCost(form: OrderFormState) {
  const areaNumber = Number(form.area || 0)
  const servicesTotal = form.serviceItems.reduce((total, item) => total + serviceBasePrice[item], 0)
  const raw = (servicesTotal + areaNumber * 1.2) * objectMultiplier[form.objectType]
  const rounded = Math.round(raw)

  return {
    min: Math.max(0, Math.round(rounded * 0.9)),
    max: Math.max(0, Math.round(rounded * 1.1)),
  }
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

export function OrderPage({ language, city, labels, user }: OrderPageProps) {
  const [form, setForm] = useState<OrderFormState>({
    serviceItems: [],
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
    () => form.serviceItems.map((service) => serviceLabels[language][service]).join(', '),
    [form.serviceItems, language],
  )

  function updateField<Field extends keyof OrderFormState>(field: Field, value: OrderFormState[Field]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function toggleService(service: ServiceKey) {
    setForm((current) => {
      const exists = current.serviceItems.includes(service)
      if (exists) {
        const remaining = current.serviceItems.filter((value) => value !== service)
        return {
          ...current,
          serviceItems: remaining.length > 0 ? remaining : current.serviceItems,
        }
      }

      return {
        ...current,
        serviceItems: [...current.serviceItems, service],
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

    if (form.serviceItems.length === 0) {
      setErrorText('Please select at least one cleaning type.')
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
        serviceItems: form.serviceItems,
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
              <legend>{labels.orderService}</legend>
              <div className="order-services-list">
                {serviceKeys.map((service) => (
                  <label key={service} className="service-check-row">
                    <input
                      type="checkbox"
                      checked={form.serviceItems.includes(service)}
                      onChange={() => toggleService(service)}
                    />
                    <span className="service-check-name">{serviceLabels[language][service]}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="form-grid">
              <label>
                {labels.orderObjectType}
                <select
                  value={form.objectType}
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
                  <span>{createdOrder.estimatedCost} PLN</span>
                </div>
                <div className="order-summary-row">
                  <strong>{labels.orderService}</strong>
                  <span>
                    {createdOrder.serviceItems
                      .map((item) => serviceLabels[language][item as ServiceKey])
                      .join(', ')}
                  </span>
                </div>
                <div className="order-summary-row">
                  <strong>{labels.orderObjectType}</strong>
                  <span>{objectTypeLabels[language][createdOrder.objectType]}</span>
                </div>
              </>
            ) : (
              <>
                <div className="order-summary-row">
                  <strong>{labels.orderService}</strong>
                  <span>{serviceText}</span>
                </div>
                <div className="order-summary-row">
                  <strong>{labels.orderObjectType}</strong>
                  <span>{objectTypeLabels[language][form.objectType]}</span>
                </div>
                <div className="order-summary-row">
                  <strong>{uiText[language].estimatedCost}</strong>
                  <span>{estimate.min} - {estimate.max} PLN</span>
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
                <span>{createdOrder.estimatedCost} PLN</span>
              </div>
              <div className="order-summary-row">
                <strong>{labels.orderService}</strong>
                <span>
                  {createdOrder.serviceItems
                    .map((item) => serviceLabels[language][item as ServiceKey])
                    .join(', ')}
                </span>
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
                  serviceItems: [],
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
