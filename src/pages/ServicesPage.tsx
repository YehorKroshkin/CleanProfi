import { Link } from 'react-router-dom'
import serviceCatalog from '../data/ServiceCatalog';
type Language = 'en' | 'ru' | 'uk' | 'pl'

type Translation = {
  servicesPageTitle: string
  servicesPageSubtitle: string
  servicesPageNote: string
  orderButton: string
}

type ServicesPageProps = {
  language: Language
  city: string
  labels: Translation
}



export function ServicesPage({ language, city, labels }: ServicesPageProps) {
  const services = serviceCatalog[language]

  return (
    <div className="services-page">
      <section className="hero-block">
        <p className="city-pill">{city}</p>
        <h1>{labels.servicesPageTitle}</h1>
        <p className="hero-subtitle">{labels.servicesPageSubtitle}</p>
        <p className="services-hero-note">{labels.servicesPageNote}</p>
        <Link className="primary-btn inline-btn" to="/order">
          {labels.orderButton}
        </Link>
      </section>

      <section className="services-grid">
        {services.map((service) => (
          <article className="service-card" key={service.title}>
            <div className="service-icon-wrap" aria-hidden="true">
              <img className="service-icon" src={service.icon} alt={service.alt} />
            </div>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </article>
        ))}
      </section>
    </div>
  )
}