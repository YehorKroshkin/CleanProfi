import { Link } from 'react-router-dom'
import type { UserProfile } from '../api/auth'
import { useRef } from 'react'
import './Header.css'

type Language = 'en' | 'ru' | 'uk' | 'pl'

type HeaderLabels = {
  menu: string
  about: string
  services: string
  contact: string
  order: string
  reviews: string
  faq: string
  login: string
  profile: string
  logout: string
  userInfo: string
}

type HeaderProps = {
  language: Language
  setLanguage: (language: Language) => void
  city: string
  setCity: (city: string) => void
  labels: HeaderLabels
  user: UserProfile | null
  onLogout: () => void | Promise<void>
}

const languages: Array<{ code: Language; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'uk', label: 'Українська' },
  { code: 'pl', label: 'Polski' },
]

const cities = ['Gdansk', 'Sopot', 'Gdynia']

export function Header({
  language,
  setLanguage,
  city,
  setCity,
  labels,
  user,
  onLogout,
}: HeaderProps) {
  const menuRef = useRef<HTMLDetailsElement>(null)

  function closeMenu() {
    if (menuRef.current) {
      menuRef.current.open = false
    }
  }

  async function handleLogoutClick() {
    await onLogout()
    closeMenu()
  }

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <span className="brand-logo" aria-hidden="true">
          <img className="brand-logo-image" src="/Logo_CleanProfi.png" alt="" />
        </span>
        <span className="brand-name">CleanProfi</span>
      </Link>

      <div className="header-controls">
        <label className="language-select-wrap">
          <span className="sr-only">Language</span>
          <img className="language-icon" src="/language.png" alt="" aria-hidden="true" />
          <select
            className="language-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </label>

        <label className="city-select-wrap">
          <span className="sr-only">City</span>
          <img className="city-icon" src="/city.png" alt="" aria-hidden="true" />
          <select
            className="city-select"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          >
            {cities.map((currentCity) => (
              <option key={currentCity} value={currentCity}>
                {currentCity}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="header-right">
        <Link
          className="account-link"
          to={user ? '/profile' : '/auth'}
          aria-label={user ? labels.profile : labels.login}
        >
          <img className="account-icon-image" src="/user.png" alt="" aria-hidden="true" />
        </Link>

        <details className="menu-dropdown" ref={menuRef}>
          <summary>{labels.menu}</summary>
          <ul>
            <li>
              <Link to={user ? '/profile' : '/auth'} onClick={closeMenu}>
                {user ? labels.profile : labels.login}
              </Link>
            </li>
            <li>
              <Link to="/services" onClick={closeMenu}>
                {labels.services}
              </Link>
            </li>
            <li>
              <Link to="/order" onClick={closeMenu}>
                {labels.order}
              </Link>
            </li>
            <li>
              <Link to="/reviews" onClick={closeMenu}>
                {labels.reviews}
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={closeMenu}>
                {labels.about}
              </Link>
            </li>
            <li>
              <Link to="/faq" onClick={closeMenu}>
                {labels.faq}
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={closeMenu}>
                {labels.contact}
              </Link>
            </li>
            {user ? (
              <li>
                <button type="button" className="menu-action" onClick={() => void handleLogoutClick()}>
                  {labels.logout}
                </button>
              </li>
            ) : null}
          </ul>
        </details>
      </div>
    </header>
  )
}
