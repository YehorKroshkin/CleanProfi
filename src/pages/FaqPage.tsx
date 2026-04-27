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
      question: 'What types of cleaning do you offer?',
      answer: 'We provide regular cleaning, deep cleaning, post-renovation cleaning, and move-in/move-out cleaning.',
    },
    {
      question: 'What is included in standard cleaning?',
      answer: 'Standard cleaning includes dusting, floor washing, kitchen and bathroom cleaning, trash removal, and cleaning mirrors and surfaces.',
    },
    {
      question: 'Do I need to provide my own products and equipment?',
      answer: 'No, our specialists arrive with everything needed: professional cleaning products and equipment.',
    },
    {
      question: 'How long does cleaning take?',
      answer: 'Usually from 2 to 6 hours, depending on apartment size and selected cleaning type.',
    },
    {
      question: 'Can I book cleaning for a specific time?',
      answer: 'Yes, you can choose a convenient date and time when placing your order.',
    },
    {
      question: 'What if I am not at home during cleaning?',
      answer: 'That is not a problem, you can hand over keys in a convenient way. We guarantee safety and confidentiality.',
    },
    {
      question: 'Do you clean after renovation?',
      answer: 'Yes, we offer a dedicated post-renovation service with removal of construction dust and heavy dirt.',
    },
    {
      question: 'What should I do if I am not satisfied with the result?',
      answer: 'Contact us and we will fix the issues free of charge.',
    },
    {
      question: 'How can I pay for services?',
      answer: 'Cash payment is available.',
    },
    {
      question: 'Do you work on weekends?',
      answer: 'Yes, we work every day without days off.',
    },
    {
      question: 'Do I need to book cleaning in advance?',
      answer: 'We recommend booking 1-2 days in advance, but sometimes same-day service is possible.',
    },
  ],
  ru: [
    {
      question: 'Какие виды уборки вы предлагаете?',
      answer: 'Мы выполняем поддерживающую, генеральную уборку, уборку после ремонта и перед/после переезда.',
    },
    {
      question: 'Что входит в стандартную уборку?',
      answer: 'В стандартную уборку входит: протирка пыли, мытьё полов, уборка кухни и ванной, вынос мусора, чистка зеркал и поверхностей.',
    },
    {
      question: 'Нужно ли предоставлять свои средства и инвентарь?',
      answer: 'Нет, наши специалисты приезжают со всем необходимым: профессиональной химией и оборудованием.',
    },
    {
      question: 'Сколько времени занимает уборка?',
      answer: 'Обычно от 2 до 6 часов — зависит от размера квартиры и выбранного типа уборки.',
    },
    {
      question: 'Можно ли заказать уборку на конкретное время?',
      answer: 'Да, вы можете выбрать удобную дату и время при оформлении заказа.',
    },
    {
      question: 'Что если я не буду дома во время уборки?',
      answer: 'Это не проблема — можно передать ключи удобным способом. Мы гарантируем безопасность и конфиденциальность.',
    },
    {
      question: 'Вы убираете после ремонта?',
      answer: 'Да, у нас есть отдельная услуга уборки после ремонта с удалением строительной пыли и загрязнений.',
    },
    {
      question: 'Что делать, если мне не понравится результат?',
      answer: 'Свяжитесь с нами — мы бесплатно исправим недочёты.',
    },
    {
      question: 'Как оплатить услуги?',
      answer: 'Доступна оплата наличными.',
    },
    {
      question: 'Вы работаете в выходные?',
      answer: 'Да, мы работаем без выходных.',
    },
    {
      question: 'Нужно ли заранее бронировать уборку?',
      answer: 'Рекомендуем бронировать за 1–2 дня, но иногда возможен выезд в день заказа.',
    },
  ],
  uk: [
    {
      question: 'Які види прибирання ви пропонуєте?',
      answer: 'Ми виконуємо підтримувальне, генеральне прибирання, прибирання після ремонту та до/після переїзду.',
    },
    {
      question: 'Що входить у стандартне прибирання?',
      answer: 'У стандартне прибирання входить: протирання пилу, миття підлоги, прибирання кухні та ванної, винесення сміття, чистка дзеркал і поверхонь.',
    },
    {
      question: 'Чи потрібно надавати свої засоби та інвентар?',
      answer: 'Ні, наші фахівці приїжджають з усім необхідним: професійною хімією та обладнанням.',
    },
    {
      question: 'Скільки часу займає прибирання?',
      answer: 'Зазвичай від 2 до 6 годин — залежить від розміру квартири та обраного типу прибирання.',
    },
    {
      question: 'Чи можна замовити прибирання на конкретний час?',
      answer: 'Так, ви можете вибрати зручну дату та час під час оформлення замовлення.',
    },
    {
      question: 'Що, якщо мене не буде вдома під час прибирання?',
      answer: 'Це не проблема — ключі можна передати зручним способом. Ми гарантуємо безпеку та конфіденційність.',
    },
    {
      question: 'Ви прибираєте після ремонту?',
      answer: 'Так, у нас є окрема послуга прибирання після ремонту з видаленням будівельного пилу та забруднень.',
    },
    {
      question: 'Що робити, якщо мені не сподобається результат?',
      answer: 'Звʼяжіться з нами — ми безкоштовно виправимо недоліки.',
    },
    {
      question: 'Як оплатити послуги?',
      answer: 'Доступна оплата готівкою.',
    },
    {
      question: 'Ви працюєте у вихідні?',
      answer: 'Так, ми працюємо без вихідних.',
    },
    {
      question: 'Чи потрібно бронювати прибирання заздалегідь?',
      answer: 'Рекомендуємо бронювати за 1-2 дні, але інколи можливий виїзд у день замовлення.',
    },
  ],
  pl: [
    {
      question: 'Jakie rodzaje sprzątania oferujecie?',
      answer: 'Wykonujemy sprzątanie regularne, generalne, po remoncie oraz przed i po przeprowadzce.',
    },
    {
      question: 'Co obejmuje standardowe sprzątanie?',
      answer: 'Standardowe sprzątanie obejmuje: wycieranie kurzu, mycie podłóg, sprzątanie kuchni i łazienki, wyniesienie śmieci oraz czyszczenie luster i powierzchni.',
    },
    {
      question: 'Czy muszę zapewnić własne środki i sprzęt?',
      answer: 'Nie, nasi specjaliści przyjeżdżają ze wszystkim, co potrzebne: profesjonalną chemią i sprzętem.',
    },
    {
      question: 'Ile trwa sprzątanie?',
      answer: 'Zwykle od 2 do 6 godzin, w zależności od wielkości mieszkania i wybranego rodzaju usługi.',
    },
    {
      question: 'Czy można zamówić sprzątanie na konkretną godzinę?',
      answer: 'Tak, podczas składania zamówienia możesz wybrać dogodną datę i godzinę.',
    },
    {
      question: 'Co jeśli nie będzie mnie w domu podczas sprzątania?',
      answer: 'To nie problem, klucze można przekazać w wygodny sposób. Gwarantujemy bezpieczeństwo i poufność.',
    },
    {
      question: 'Czy sprzątacie po remoncie?',
      answer: 'Tak, mamy osobną usługę sprzątania po remoncie z usuwaniem pyłu budowlanego i zabrudzeń.',
    },
    {
      question: 'Co zrobić, jeśli nie spodoba mi się efekt?',
      answer: 'Skontaktuj się z nami, a bezpłatnie poprawimy niedociągnięcia.',
    },
    {
      question: 'Jak opłacić usługi?',
      answer: 'Dostępna jest płatność gotówką.',
    },
    {
      question: 'Czy pracujecie w weekendy?',
      answer: 'Tak, pracujemy codziennie, bez dni wolnych.',
    },
    {
      question: 'Czy trzeba rezerwować sprzątanie z wyprzedzeniem?',
      answer: 'Zalecamy rezerwację 1-2 dni wcześniej, ale czasem możliwy jest wyjazd tego samego dnia.',
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
