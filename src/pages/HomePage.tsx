import type { UserProfile } from '../api/auth'

type Translation = {
  heroTitle: string
  heroSubtitle: string
  welcome: string
  cta: string
  about: string
  aboutText: string
  servicesTitle: string
  servicesItems: string[]
  reviewsTitle: string
  reviewsText: string
  faqTitle: string
  faqText: string
}

type HomePageProps = {
  city: string
  labels: Translation
  user: UserProfile | null
}

export function HomePage({ city, labels, user }: HomePageProps) {
  return (
    <div className="home-page">
      {user ? (
        <section className="welcome-banner">
          <p>
            {labels.welcome} <strong>{user.name}</strong>!
          </p>
        </section>
      ) : null}

      <section className="hero-block">
        <p className="city-pill">{city}</p>
        <h1>{labels.heroTitle}</h1>
        <p className="hero-subtitle">{labels.heroSubtitle}</p>
        <button type="button" className="primary-btn">
          {labels.cta}
        </button>
      </section>

      <section id="about" className="info-card">
        <h2>{labels.about}</h2>
        <p>{labels.aboutText}</p>
      </section>

      <section id="services" className="info-card">
        <h2>{labels.servicesTitle}</h2>
        <ul>
          {labels.servicesItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="reviews" className="info-card">
        <h2>{labels.reviewsTitle}</h2>
        <p>{labels.reviewsText}</p>
      </section>

      <section id="faq" className="info-card">
        <h2>{labels.faqTitle}</h2>
        <p>{labels.faqText}</p>
      </section>
    </div>
  )
}
