type Language = 'en' | 'ru' | 'uk' | 'pl'

type ContactPageProps = {
  language: Language
  city: string
}

const contactByLanguage: Record<Language, {
  title: string
  subtitle: string
  phoneLabel: string
  emailLabel: string
  hoursLabel: string
  addressLabel: string
  hoursValue: string
  addressValue: string
}> = {
  en: {
    title: 'Contact Us',
    subtitle: 'Reach us via phone or email. We reply quickly during business hours.',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    hoursLabel: 'Working hours',
    addressLabel: 'Service area',
    hoursValue: 'Mon-Sat, 08:00-20:00',
    addressValue: 'Gdansk, Sopot, Gdynia',
  },
  ru: {
    title: 'Контакты',
    subtitle: 'Свяжитесь с нами по телефону или почте. Быстро отвечаем в рабочее время.',
    phoneLabel: 'Телефон',
    emailLabel: 'Почта',
    hoursLabel: 'Время работы',
    addressLabel: 'Зона обслуживания',
    hoursValue: 'Пн-Сб, 08:00-20:00',
    addressValue: 'Gdansk, Sopot, Gdynia',
  },
  uk: {
    title: 'Контакти',
    subtitle: 'Звʼяжіться з нами телефоном або поштою. Швидко відповідаємо у робочий час.',
    phoneLabel: 'Телефон',
    emailLabel: 'Пошта',
    hoursLabel: 'Графік роботи',
    addressLabel: 'Зона обслуговування',
    hoursValue: 'Пн-Сб, 08:00-20:00',
    addressValue: 'Gdansk, Sopot, Gdynia',
  },
  pl: {
    title: 'Kontakt',
    subtitle: 'Skontaktuj się z nami telefonicznie lub mailowo. Odpowiadamy szybko w godzinach pracy.',
    phoneLabel: 'Telefon',
    emailLabel: 'E-mail',
    hoursLabel: 'Godziny pracy',
    addressLabel: 'Obszar obsługi',
    hoursValue: 'Pon-Sob, 08:00-20:00',
    addressValue: 'Gdansk, Sopot, Gdynia',
  },
}

export function ContactPage({ language, city }: ContactPageProps) {
  const labels = contactByLanguage[language]

  return (
    <div className="contact-page">
      <section className="hero-block">
        <p className="city-pill">{city}</p>
        <h1>{labels.title}</h1>
        <p className="hero-subtitle">{labels.subtitle}</p>
      </section>

      <section className="contact-grid">
        <article className="contact-card">
          <h2>{labels.phoneLabel}</h2>
          <p><a href="tel:+48571444555">+48 793 189 664</a></p>
        </article>
        <article className="contact-card">
          <h2>{labels.emailLabel}</h2>
          <p><a href="mailto:hello@cleanprofi.pl">dryhome18@gmail.com</a></p>
        </article>
        <article className="contact-card">
          <h2>{labels.hoursLabel}</h2>
          <p>{labels.hoursValue}</p>
        </article>
        <article className="contact-card">
          <h2>{labels.addressLabel}</h2>
          <p>{labels.addressValue}</p>
        </article>
      </section>
    </div>
  )
}
