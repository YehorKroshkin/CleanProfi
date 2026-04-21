import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { getCurrentUser, logoutUser, type UserProfile } from './api/auth'
import { Header } from './components/Header'
import { AuthPage } from './pages/AuthPage'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import './App.css'

type Language = 'ru' | 'uk' | 'pl'

type Translation = {
  navMenu: string
  about: string
  services: string
  reviews: string
  faq: string
  login: string
  createAccount: string
  heroTitle: string
  heroSubtitle: string
  welcome: string
  cta: string
  aboutText: string
  servicesTitle: string
  servicesItems: string[]
  reviewsTitle: string
  reviewsText: string
  faqTitle: string
  faqText: string
  authTitle: string
  authSubtitle: string
  profile: string
  userInfo: string
  userName: string
  userCity: string
  userDistrict: string
  userStreet: string
  userPhone: string
  logout: string
  name: string
  city: string
  district: string
  street: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  signIn: string
  signUp: string
  currentPassword: string
  newPassword: string
  savePassword: string
  passwordChanged: string
  passwordMismatch: string
  passwordHint: string
  authSuccess: string
  registerSuccess: string
}

const translations: Record<Language, Translation> = {
  ru: {
    navMenu: 'Меню',
    about: 'О нас',
    services: 'Наши услуги',
    reviews: 'Отзывы',
    faq: 'FAQ',
    login: 'Вход',
    createAccount: 'Создать аккаунт',
    heroTitle: 'Профессиональная уборка для дома и офиса',
    heroSubtitle:
      'CleanProfi — мягкий сервис клининга: быстро, бережно и с прозрачной ценой.',
    welcome: 'Приветствуем',
    cta: 'Заказать уборку',
    aboutText:
      'Мы работаем по стандартам качества и используем безопасные средства для ежедневной и генеральной уборки.',
    servicesTitle: 'Наши услуги',
    servicesItems: [
      'Поддерживающая уборка',
      'Генеральная уборка',
      'Уборка после ремонта',
    ],
    reviewsTitle: 'Отзывы',
    reviewsText: 'Клиенты ценят аккуратность, пунктуальность и стабильный результат.',
    faqTitle: 'FAQ',
    faqText: 'Выберите город, услугу и удобное время — остальное мы берём на себя.',
    authTitle: 'Личный кабинет',
    authSubtitle: 'Войдите или создайте аккаунт, чтобы управлять заказами.',
    profile: 'Профиль',
    userInfo: 'Общая информация пользователя',
    userName: 'Имя',
    userCity: 'Город',
    userDistrict: 'Район',
    userStreet: 'Улица',
    userPhone: 'Телефон',
    logout: 'Выйти',
    name: 'Имя',
    city: 'Город',
    district: 'Район',
    street: 'Улица',
    phone: 'Номер телефона',
    email: 'Почта',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    signIn: 'Войти',
    signUp: 'Зарегистрироваться',
    currentPassword: 'Текущий пароль',
    newPassword: 'Новый пароль',
    savePassword: 'Сменить пароль',
    passwordChanged: 'Пароль успешно изменён.',
    passwordMismatch: 'Пароли не совпадают.',
    passwordHint: 'Минимум 10 символов.',
    authSuccess: 'Успешно. Добро пожаловать!',
    registerSuccess: 'Регистрация успешна. Теперь войдите в аккаунт.',
  },
  uk: {
    navMenu: 'Меню',
    about: 'Про нас',
    services: 'Наші послуги',
    reviews: 'Відгуки',
    faq: 'FAQ',
    login: 'Вхід',
    createAccount: 'Створити акаунт',
    heroTitle: 'Професійне прибирання для дому та офісу',
    heroSubtitle:
      'CleanProfi — м’який сервіс клінінгу: швидко, дбайливо та з прозорою ціною.',
    welcome: 'Вітаємо',
    cta: 'Замовити прибирання',
    aboutText:
      'Ми працюємо за стандартами якості та використовуємо безпечні засоби для щоденного і генерального прибирання.',
    servicesTitle: 'Наші послуги',
    servicesItems: [
      'Підтримувальне прибирання',
      'Генеральне прибирання',
      'Прибирання після ремонту',
    ],
    reviewsTitle: 'Відгуки',
    reviewsText: 'Клієнти цінують охайність, пунктуальність і стабільний результат.',
    faqTitle: 'FAQ',
    faqText: 'Оберіть місто, послугу та зручний час — решту ми беремо на себе.',
    authTitle: 'Особистий кабінет',
    authSubtitle: 'Увійдіть або створіть акаунт, щоб керувати замовленнями.',
    profile: 'Профіль',
    userInfo: 'Загальна інформація користувача',
    userName: 'Ім’я',
    userCity: 'Місто',
    userDistrict: 'Район',
    userStreet: 'Вулиця',
    userPhone: 'Телефон',
    logout: 'Вийти',
    name: 'Ім’я',
    city: 'Місто',
    district: 'Район',
    street: 'Вулиця',
    phone: 'Номер телефону',
    email: 'Пошта',
    password: 'Пароль',
    confirmPassword: 'Підтвердіть пароль',
    signIn: 'Увійти',
    signUp: 'Зареєструватися',
    currentPassword: 'Поточний пароль',
    newPassword: 'Новий пароль',
    savePassword: 'Змінити пароль',
    passwordChanged: 'Пароль успішно змінено.',
    passwordMismatch: 'Паролі не збігаються.',
    passwordHint: 'Мінімум 10 символів.',
    authSuccess: 'Успішно. Ласкаво просимо!',
    registerSuccess: 'Реєстрація успішна. Тепер увійдіть в акаунт.',
  },
  pl: {
    navMenu: 'Menu',
    about: 'O nas',
    services: 'Nasze usługi',
    reviews: 'Opinie',
    faq: 'FAQ',
    login: 'Logowanie',
    createAccount: 'Utwórz konto',
    heroTitle: 'Profesjonalne sprzątanie domu i biura',
    heroSubtitle:
      'CleanProfi to miękki serwis sprzątania: szybko, dokładnie i z jasną ceną.',
    welcome: 'Witamy',
    cta: 'Zamów sprzątanie',
    aboutText:
      'Pracujemy według standardów jakości i używamy bezpiecznych środków do sprzątania codziennego i generalnego.',
    servicesTitle: 'Nasze usługi',
    servicesItems: [
      'Sprzątanie regularne',
      'Sprzątanie generalne',
      'Sprzątanie po remoncie',
    ],
    reviewsTitle: 'Opinie',
    reviewsText: 'Klienci cenią nas za dokładność, punktualność i stałą jakość.',
    faqTitle: 'FAQ',
    faqText: 'Wybierz miasto, usługę i dogodny termin — resztą zajmiemy się my.',
    authTitle: 'Konto osobiste',
    authSubtitle: 'Zaloguj się lub utwórz konto, aby zarządzać zamówieniami.',
    profile: 'Profil',
    userInfo: 'Ogólne informacje o użytkowniku',
    userName: 'Imię',
    userCity: 'Miasto',
    userDistrict: 'Dzielnica',
    userStreet: 'Ulica',
    userPhone: 'Telefon',
    logout: 'Wyloguj',
    name: 'Imię',
    city: 'Miasto',
    district: 'Dzielnica',
    street: 'Ulica',
    phone: 'Numer telefonu',
    email: 'E-mail',
    password: 'Hasło',
    confirmPassword: 'Potwierdź hasło',
    signIn: 'Zaloguj się',
    signUp: 'Załóż konto',
    currentPassword: 'Obecne hasło',
    newPassword: 'Nowe hasło',
    savePassword: 'Zmień hasło',
    passwordChanged: 'Hasło zostało zmienione.',
    passwordMismatch: 'Hasła nie są takie same.',
    passwordHint: 'Minimum 10 znaków.',
    authSuccess: 'Sukces. Witamy!',
    registerSuccess: 'Rejestracja udana. Teraz zaloguj się.',
  },
}

const cities = ['Gdansk', 'Sopot', 'Gdynia']

function App() {
  const [language, setLanguage] = useState<Language>('ru')
  const [city, setCity] = useState(cities[0])
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [authReady, setAuthReady] = useState(false)

  const t = translations[language]

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      try {
        const data = await getCurrentUser()
        if (mounted) {
          setCurrentUser(data.user)
        }
      } catch {
        if (mounted) {
          setCurrentUser(null)
        }
      } finally {
        if (mounted) {
          setAuthReady(true)
        }
      }
    }

    void loadSession()

    return () => {
      mounted = false
    }
  }, [])

  async function handleLogout() {
    try {
      await logoutUser()
    } finally {
      setCurrentUser(null)
    }
  }

  return (
    <div className="app-shell">
      <Header
        language={language}
        setLanguage={setLanguage}
        city={city}
        setCity={setCity}
        labels={{
          menu: t.navMenu,
          about: t.about,
          services: t.services,
          reviews: t.reviews,
          faq: t.faq,
          login: t.login,
          profile: t.profile,
          logout: t.logout,
          userInfo: t.userInfo,
        }}
        user={currentUser}
        onLogout={handleLogout}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={<HomePage city={city} labels={t} user={currentUser} />}
          />
          <Route
            path="/auth"
            element={<AuthPage labels={t} onAuthSuccess={setCurrentUser} />}
          />
          <Route
            path="/profile"
            element={
              authReady ? (
                <ProfilePage user={currentUser} labels={t} onLogout={handleLogout} />
              ) : (
                <div className="info-card">Loading...</div>
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
