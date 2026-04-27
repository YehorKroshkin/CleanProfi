import { Link } from 'react-router-dom'
import type { UserProfile } from '../api/auth'
import serviceCatalog from '../data/ServiceCatalog';
type Language = 'en' | 'ru' | 'uk' | 'pl'
type Translation = {
  faqLinkLabel: string
  reviewsLinkLabel: string
  heroTitle: string
  heroSubtitle: string
  welcome: string
  cta: string
  about: string
  aboutText: string
  servicesTitle: string
  orderButton: string
  reviewsTitle: string
  reviewsText: string
  faqTitle: string
  faqText: string
}

type HomePageProps = {
  city: string
  labels: Translation
  user: UserProfile | null
  language: Language
  showWelcome?: boolean
}

export function HomePage({ city, labels, user, language, showWelcome = true }: HomePageProps) {
  return (
    <div className="home-page">
      {showWelcome && user ? (
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
        <Link className="primary-btn inline-btn" to="/order">
          {labels.cta}
        </Link>
      </section>

      <section id="about" className="info-card">
        <h2>{labels.about}</h2>
        <p className="about-text">{labels.aboutText}</p>
      </section>

      <section id="services" className="info-card">
        <h2>{labels.servicesTitle}</h2>
        <div className="services-grid" style={{ marginTop: 16 }}>
          {serviceCatalog[language].map((service) => (
            <article className="service-card" key={service.title}>
              <div className="service-icon-wrap" aria-hidden="true">
                <img className="service-icon" src={service.icon} alt={service.alt} />
              </div>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="reviews" className="info-card" style={{ textAlign: 'center' }}>
        <h2>{labels.reviewsTitle}</h2>
        <p>{labels.reviewsText}</p>
        <Link className="primary-btn inline-btn" to="/reviews">
          {labels.reviewsLinkLabel}
        </Link>
      </section>

      <section id="faq" className="info-card" style={{ textAlign: 'center' }}>
        <h2>{labels.faqTitle}</h2>
        <p>{labels.faqText}</p>
        <Link className="primary-btn inline-btn" to="/faq">
          {labels.faqLinkLabel}
        </Link>
      </section>
    </div>
  )
}
