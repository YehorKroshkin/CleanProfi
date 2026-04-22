import { Link } from 'react-router-dom'

type Language = 'en' | 'ru' | 'uk' | 'pl'

type FaqPageProps = {
  language: Language
  city: string
}

type FaqItem = {
  question: string
  answer: string
}

const pageTitles: Record<Language, { title: string; subtitle: string; contactCta: string; contactBtn: string }> = {
  en: {
    title: 'Frequently Asked Questions',
    subtitle: 'Basic answers before booking cleaning service.',
    contactCta: 'Did not find your question? Contact us and we will help choose the best option.',
    contactBtn: 'Contact Us',
  },
  ru: {
    title: 'Часто задаваемые вопросы',
    subtitle: 'Базовые ответы перед заказом клининга.',
    contactCta: 'Не нашли ответ? Напишите нам, и мы поможем подобрать лучший вариант уборки.',
    contactBtn: 'Связаться с нами',
  },
  uk: {
    title: 'Поширені запитання',
    subtitle: 'Базові відповіді перед замовленням прибирання.',
    contactCta: 'Не знайшли відповідь? Напишіть нам, і ми підберемо найкращий формат прибирання.',
    contactBtn: 'Звʼязатися з нами',
  },
  pl: {
    title: 'Najczęściej zadawane pytania',
    subtitle: 'Podstawowe odpowiedzi przed zamówieniem sprzątania.',
    contactCta: 'Nie znalazłeś odpowiedzi? Napisz do nas, pomożemy dobrać najlepszą usługę.',
    contactBtn: 'Skontaktuj się z nami',
  },
}

const faqByLanguage: Record<Language, FaqItem[]> = {
  en: [
    {
      question: 'How much time does cleaning take?',
      answer: 'Usually from 2 to 6 hours depending on area, service type, and condition of the space.',
    },
    {
      question: 'Do I need to provide cleaning products?',
      answer: 'No. Our team brings professional products and equipment for selected service.',
    },
    {
      question: 'Can I reschedule booked time?',
      answer: 'Yes, please notify us in advance and we will move your booking to another available slot.',
    },
    {
      question: 'Do you clean offices and garages?',
      answer: 'Yes. We work with apartments, houses, offices, and garages.',
    },
  ],
  ru: [
    {
      question: 'Сколько времени занимает уборка?',
      answer: 'Обычно от 2 до 6 часов в зависимости от площади, типа услуги и состояния помещения.',
    },
    {
      question: 'Нужно ли предоставлять свои средства?',
      answer: 'Нет. Команда приезжает со своей профессиональной химией и инвентарём.',
    },
    {
      question: 'Можно ли перенести заказ на другое время?',
      answer: 'Да, заранее напишите нам, и мы подберём ближайший свободный слот.',
    },
    {
      question: 'Вы работаете с офисами и гаражами?',
      answer: 'Да, мы выполняем уборку квартир, домов, офисов и гаражей.',
    },
  ],
  uk: [
    {
      question: 'Скільки часу займає прибирання?',
      answer: 'Зазвичай від 2 до 6 годин залежно від площі, типу послуги та стану приміщення.',
    },
    {
      question: 'Чи потрібні мої засоби для прибирання?',
      answer: 'Ні. Ми приїжджаємо зі своїми професійними засобами та обладнанням.',
    },
    {
      question: 'Чи можна перенести час замовлення?',
      answer: 'Так, напишіть нам заздалегідь, і ми перенесемо замовлення на доступний слот.',
    },
    {
      question: 'Ви прибираєте офіси та гаражі?',
      answer: 'Так, ми працюємо з квартирами, будинками, офісами та гаражами.',
    },
  ],
  pl: [
    {
      question: 'Ile trwa sprzątanie?',
      answer: 'Zwykle od 2 do 6 godzin, w zależności od metrażu, rodzaju usługi i stanu lokalu.',
    },
    {
      question: 'Czy muszę zapewnić własne środki?',
      answer: 'Nie. Nasz zespół przywozi profesjonalne środki i sprzęt.',
    },
    {
      question: 'Czy mogę zmienić termin zamówienia?',
      answer: 'Tak, daj nam znać wcześniej, a przeniesiemy usługę na dostępny termin.',
    },
    {
      question: 'Czy sprzątacie biura i garaże?',
      answer: 'Tak, obsługujemy mieszkania, domy, biura oraz garaże.',
    },
  ],
}

export function FaqPage({ language, city }: FaqPageProps) {
  const labels = pageTitles[language]
  const faq = faqByLanguage[language]

  return (
    <div className="faq-page">
      <section className="hero-block">
        <p className="city-pill">{city}</p>
        <h1>{labels.title}</h1>
        <p className="hero-subtitle">{labels.subtitle}</p>
      </section>

      <section className="faq-list">
        {faq.map((item) => (
          <article className="faq-item" key={item.question}>
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>

      <section className="faq-contact-cta info-card">
        <p>{labels.contactCta}</p>
        <Link className="primary-btn inline-btn" to="/contact">
          {labels.contactBtn}
        </Link>
      </section>
    </div>
  )
}
