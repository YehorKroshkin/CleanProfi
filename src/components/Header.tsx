import { Link } from 'react-router-dom'
import type { UserProfile } from '../api/auth'
import { useRef } from 'react'
import './Header.css'

type Language = 'ru' | 'uk' | 'pl'

type HeaderLabels = {
  menu: string
  about: string
  services: string
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
          CP
        </span>
        <span className="brand-name">CleanProfi</span>
      </Link>

      <div className="header-controls">
        <div className="language-switch" role="group" aria-label="Language switch">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={language === lang.code ? 'lang-btn active' : 'lang-btn'}
              onClick={() => setLanguage(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <label className="city-select-wrap">
          <span className="sr-only">City</span>
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
          <span className="account-icon" aria-hidden="true">
            👤
          </span>
        </Link>

        <details className="menu-dropdown" ref={menuRef}>
          <summary>{labels.menu}</summary>
          <ul>
            {user ? (
              <li className="menu-user-meta">
                <strong>{labels.userInfo}</strong>
                <span>{user.name}</span>
                <span>{user.email}</span>
              </li>
            ) : null}
            <li>
              <Link to={user ? '/profile' : '/auth'} onClick={closeMenu}>
                {user ? labels.profile : labels.login}
              </Link>
            </li>
            <li>
              <a href="/#services" onClick={closeMenu}>{labels.services}</a>
            </li>
            <li>
              <a href="/#reviews" onClick={closeMenu}>{labels.reviews}</a>
            </li>
            <li>
              <a href="/#about" onClick={closeMenu}>{labels.about}</a>
            </li>
            <li>
              <a href="/#faq" onClick={closeMenu}>{labels.faq}</a>
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
