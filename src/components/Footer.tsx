import { Link } from 'react-router-dom'

type FooterLabels = {
  about: string
  reviews: string
  services: string
  servicesItems: string[]
  workCitiesText: string
  emailLabel: string
  phoneLabel: string
}

type FooterProps = {
  labels: FooterLabels
}

export function Footer({ labels }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-logo-column">
          <span className="footer-logo-wrap" aria-hidden="true">
            <img className="footer-logo" src="/Logo_CleanProfi.png" alt="" />
          </span>
        </div>

        <div className="footer-divider" aria-hidden="true" />

        <div className="footer-brand-column">
          <h3>CleanProfi</h3>
          <div className="footer-services-rule" aria-hidden="true" />
          <nav className="footer-links" aria-label="Footer navigation">
            <Link to="/about">{labels.about}</Link>
            <Link to="/reviews">{labels.reviews}</Link>
            <Link to="/services">{labels.services}</Link>
          </nav>
        </div>

        <div className="footer-divider" aria-hidden="true" />

        <div className="footer-services-column">
          <h3>{labels.services}</h3>
          <div className="footer-services-rule" aria-hidden="true" />
          <ul>
            {labels.servicesItems.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="footer-cities">{labels.workCitiesText}</p>

      <div className="footer-contacts">
        <a href="mailto:dryhome18@gmail.com" className="footer-contact-item">
          <img src="/gmail.png" alt="" aria-hidden="true" />
          <span>{labels.emailLabel}: dryhome18@gmail.com</span>
        </a>
        <a href="tel:+48793189664" className="footer-contact-item">
          <img src="/phone-call.png" alt="" aria-hidden="true" />
          <span>{labels.phoneLabel}: +48 793 189 664</span>
        </a>
      </div>
    </footer>
  )
}
