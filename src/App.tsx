import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { getCurrentUser, logoutUser, type UserProfile } from './api/auth'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { AuthPage } from './pages/AuthPage'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import { ServicesPage } from './pages/ServicesPage'
import './App.css'
import { ContactPage } from './pages/ContactPage'
import { ReviewsPage } from './pages/ReviewsPage'
import { FaqPage } from './pages/FaqPage'
import { OrderPage } from './pages/OrderPage'

type Language = 'en' | 'ru' | 'uk' | 'pl'

type Translation = {
  navMenu: string
  about: string
  services: string
  contact: string
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
  reviewsLinkLabel: string
  footerWorkCitiesText: string
  footerEmailLabel: string
  footerPhoneLabel: string
  faqTitle: string
  faqText: string
  faqLinkLabel: string
  servicesPageTitle: string
  servicesPageSubtitle: string
  servicesPageNote: string
  orderPageTitle: string
  orderPageSubtitle: string
  orderSubmit: string
  orderButton: string
  orderService: string
  orderArea: string
  orderDate: string
  orderTime: string
  orderName: string
  orderPhone: string
  orderAddress: string
  orderComment: string
  orderObjectType: string
  orderFormTitle: string
  orderSuccessTitle: string
  orderSuccessText: string
  authTitle: string
  authSubtitle: string
  profile: string
  profileEditPrompt: string
  profileContactCta: string
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
  en: {
    navMenu: 'Menu',
    about: 'About Us',
    services: 'Our Services',
    contact: 'Contact',
    reviews: 'Reviews',
    faq: 'FAQ',
    login: 'Login',
    createAccount: 'Create Account',
    heroTitle: 'Professional cleaning for home and office',
    heroSubtitle:
      'CleanProfi is a flexible cleaning service: fast, careful, and transparent pricing.',
    welcome: 'Welcome',
    cta: 'Book Cleaning',
    aboutText:
      'We make apartments clean quickly and without unnecessary talk.\n\nYou place an order, we arrive, clean, and hand over a finished result. No hidden fees, no delays, and no “good enough.”\n\nWe work so you do not have to check every corner. If anything is not right, we will fix it.\n\nWhy people choose us:\n• we arrive on time\n• we clean thoroughly, not just “for looks”\n• fixed price with no surprises\n• same-day booking is possible\n• careful and respectful service\n\nYou do not need to spend your time and energy on cleaning, just leave a request.',
    servicesTitle: 'Our Services',
    servicesItems: ['Regular cleaning', 'Deep cleaning', 'Post-renovation cleaning'],
    reviewsTitle: 'Client Reviews',
    reviewsText: 'See what our clients say about us — real reviews from real people.',
    reviewsLinkLabel: 'View reviews',
    footerWorkCitiesText: 'We work in cities: Gdansk, Sopot, Gdynia.',
    footerEmailLabel: 'Email',
    footerPhoneLabel: 'Phone',
    faqTitle: 'How We Work',
    faqText: 'Transparency, punctuality, and quality are the three pillars of our service. Learn more about our approach.',
    faqLinkLabel: 'Learn more',
    servicesPageTitle: 'Our Services',
    servicesPageSubtitle:
      'We match cleaning format to your apartment, house, or office and show exactly what is included.',
    servicesPageNote:
      'The icons below help you quickly choose by space type and cleaning task.',
    orderPageTitle: 'Book Cleaning',
    orderPageSubtitle: 'Fill out a short request and we will prepare your order.',
    orderSubmit: 'Submit Order',
    orderButton: 'Book Cleaning',
    orderService: 'Cleaning type',
    orderArea: 'Area, m²',
    orderDate: 'Date',
    orderTime: 'Time',
    orderName: 'Name',
    orderPhone: 'Phone',
    orderAddress: 'Address',
    orderComment: 'Comment',
    orderObjectType: 'Property type',
    orderFormTitle: 'Order details',
    orderSuccessTitle: 'Order created',
    orderSuccessText: 'Your order has been received. We will contact you to confirm details.',
    authTitle: 'Personal Account',
    authSubtitle: 'Sign in or create an account to manage your orders.',
    profile: 'Profile',
    profileEditPrompt: 'Want to change account details?',
    profileContactCta: 'Contact us',
    userInfo: 'User information',
    userName: 'Name',
    userCity: 'City',
    userDistrict: 'District',
    userStreet: 'Street',
    userPhone: 'Phone',
    logout: 'Log out',
    name: 'Name',
    city: 'City',
    district: 'District',
    street: 'Street',
    phone: 'Phone number',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    signIn: 'Sign in',
    signUp: 'Sign up',
    currentPassword: 'Current password',
    newPassword: 'New password',
    savePassword: 'Change password',
    passwordChanged: 'Password changed successfully.',
    passwordMismatch: 'Passwords do not match.',
    passwordHint: 'At least 10 characters.',
    authSuccess: 'Success. Welcome!',
    registerSuccess: 'Registration complete. Now sign in.',
  },
  ru: {
    navMenu: 'Меню',
    about: 'О нас',
    services: 'Наши услуги',
    contact: 'Контакты',
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
      'Делаем квартиры чистыми быстро и без лишних разговоров.\n\nВы заказываете — мы приезжаем, убираем и сдаём готовый результат. Без скрытых цен, без опозданий и без «и так сойдёт».\n\nРаботаем так, чтобы вам не пришлось проверять каждый угол. Если что-то не устроит — исправим.\n\nПочему выбирают нас:\n• приезжаем вовремя\n• делаем реально чисто, а не «на вид»\n• фиксированная цена без сюрпризов\n• можно заказать на сегодня\n• работаем аккуратно и бережно\n\nВам не нужно тратить время и силы на уборку — просто оставьте заявку.',
    servicesTitle: 'Наши услуги',
    servicesItems: [
      'Поддерживающая уборка',
      'Генеральная уборка',
      'Уборка после ремонта',
    ],
    reviewsTitle: 'Отзывы клиентов',
    reviewsText: 'Посмотрите, что говорят о нас наши клиенты — реальные отзывы от реальных людей.',
    reviewsLinkLabel: 'Смотреть отзывы',
    footerWorkCitiesText: 'Мы работаем в городах: Gdansk, Sopot, Gdynia.',
    footerEmailLabel: 'Почта',
    footerPhoneLabel: 'Телефон',
    faqTitle: 'Наши принципы работы',
    faqText: 'Прозрачность, пунктуальность и качество — три кита, на которых стоит наш сервис. Узнайте подробнее о том, как мы работаем.',
    faqLinkLabel: 'Читать подробнее',
    servicesPageTitle: 'Наши услуги',
    servicesPageSubtitle: 'Подбираем формат уборки под квартиру, дом или офис и показываем, что именно входит в каждый вариант.',
    servicesPageNote: 'Иконки ниже помогают быстрее сориентироваться по типу помещения и задаче.',
    orderPageTitle: 'Заказать уборку',
    orderPageSubtitle: 'Заполните короткую заявку, и мы подготовим заказ под ваш объект.',
    orderSubmit: 'Отправить заявку',
    orderButton: 'Заказать уборку',
    orderService: 'Тип уборки',
    orderArea: 'Площадь, м²',
    orderDate: 'Дата',
    orderTime: 'Время',
    orderName: 'Имя',
    orderPhone: 'Телефон',
    orderAddress: 'Адрес',
    orderComment: 'Комментарий',
    orderObjectType: 'Тип объекта',
    orderFormTitle: 'Параметры заказа',
    orderSuccessTitle: 'Заявка сформирована',
    orderSuccessText: 'Мы получили ваш заказ и свяжемся с вами для подтверждения деталей.',
    authTitle: 'Личный кабинет',
    authSubtitle: 'Войдите или создайте аккаунт, чтобы управлять заказами.',
    profile: 'Профиль',
    profileEditPrompt: 'Хотите изменить данные аккаунта?',
    profileContactCta: 'Свяжитесь с нами',
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
    contact: 'Контакти',
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
      'Робимо квартири чистими швидко та без зайвих розмов.\n\nВи замовляєте — ми приїжджаємо, прибираємо та здаємо готовий результат. Без прихованих цін, без запізнень і без «і так зійде».\n\nПрацюємо так, щоб вам не довелося перевіряти кожен кут. Якщо щось не влаштує — виправимо.\n\nЧому обирають нас:\n• приїжджаємо вчасно\n• прибираємо справді чисто, а не «для вигляду»\n• фіксована ціна без сюрпризів\n• можна замовити на сьогодні\n• працюємо акуратно та дбайливо\n\nВам не потрібно витрачати час і сили на прибирання — просто залиште заявку.',
    servicesTitle: 'Наші послуги',
    servicesItems: [
      'Підтримувальне прибирання',
      'Генеральне прибирання',
      'Прибирання після ремонту',
    ],
    reviewsTitle: 'Відгуки клієнтів',
    reviewsText: 'Подивіться, що кажуть про нас наші клієнти — справжні відгуки від реальних людей.',
    reviewsLinkLabel: 'Дивитися відгуки',
    footerWorkCitiesText: 'Ми працюємо в містах: Gdansk, Sopot, Gdynia.',
    footerEmailLabel: 'Пошта',
    footerPhoneLabel: 'Телефон',
    faqTitle: 'Наші принципи роботи',
    faqText: 'Прозорість, пунктуальність і якість — три основи нашого сервісу. Дізнайтеся більше про те, як ми працюємо.',
    faqLinkLabel: 'Читати детальніше',
    servicesPageTitle: 'Наші послуги',
    servicesPageSubtitle: 'Підбираємо формат прибирання під квартиру, будинок або офіс і показуємо, що саме входить у кожен варіант.',
    servicesPageNote: 'Іконки нижче допомагають швидше зорієнтуватися за типом приміщення та задачею.',
    orderPageTitle: 'Замовити прибирання',
    orderPageSubtitle: 'Заповніть коротку заявку, і ми підготуємо замовлення під ваш об’єкт.',
    orderSubmit: 'Надіслати заявку',
    orderButton: 'Замовити прибирання',
    orderService: 'Тип прибирання',
    orderArea: 'Площа, м²',
    orderDate: 'Дата',
    orderTime: 'Час',
    orderName: 'Ім’я',
    orderPhone: 'Телефон',
    orderAddress: 'Адреса',
    orderComment: 'Коментар',
    orderObjectType: 'Тип об’єкта',
    orderFormTitle: 'Параметри замовлення',
    orderSuccessTitle: 'Заявку сформовано',
    orderSuccessText: 'Ми отримали ваше замовлення та зв’яжемося для підтвердження деталей.',
    authTitle: 'Особистий кабінет',
    authSubtitle: 'Увійдіть або створіть акаунт, щоб керувати замовленнями.',
    profile: 'Профіль',
    profileEditPrompt: 'Хочете змінити дані акаунта?',
    profileContactCta: 'Звʼяжіться з нами',
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
    contact: 'Kontakt',
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
      'Sprzątamy mieszkania szybko i bez zbędnych rozmów.\n\nTy składasz zamówienie, my przyjeżdżamy, sprzątamy i oddajemy gotowy efekt. Bez ukrytych opłat, bez spóźnień i bez „jakoś to będzie”.\n\nPracujemy tak, abyś nie musiał sprawdzać każdego kąta. Jeśli coś Cię nie zadowoli, poprawimy to.\n\nDlaczego wybierają nas:\n• przyjeżdżamy punktualnie\n• sprzątamy naprawdę dokładnie, a nie tylko „na oko”\n• stała cena bez niespodzianek\n• możliwe zamówienie na dziś\n• pracujemy ostrożnie i z dbałością\n\nNie musisz tracić czasu i energii na sprzątanie, po prostu zostaw zgłoszenie.',
    servicesTitle: 'Nasze usługi',
    servicesItems: [
      'Sprzątanie regularne',
      'Sprzątanie generalne',
      'Sprzątanie po remoncie',
    ],
    reviewsTitle: 'Opinie klientów',
    reviewsText: 'Sprawdź, co mówią o nas nasi klienci — prawdziwe opinie od prawdziwych ludzi.',
    reviewsLinkLabel: 'Zobacz opinie',
    footerWorkCitiesText: 'Pracujemy w miastach: Gdansk, Sopot, Gdynia.',
    footerEmailLabel: 'E-mail',
    footerPhoneLabel: 'Telefon',
    faqTitle: 'Nasze zasady pracy',
    faqText: 'Przejrzystość, punktualność i jakość — trzy filary naszego serwisu. Dowiedz się więcej o tym, jak działamy.',
    faqLinkLabel: 'Czytaj więcej',
    servicesPageTitle: 'Nasze usługi',
    servicesPageSubtitle: 'Dobieramy zakres sprzątania do mieszkania, domu lub biura i pokazujemy, co dokładnie zawiera każdy wariant.',
    servicesPageNote: 'Ikony poniżej pomagają szybciej rozpoznać typ przestrzeni i zadanie.',
    orderPageTitle: 'Zamów sprzątanie',
    orderPageSubtitle: 'Wypełnij krótkie zgłoszenie, a przygotujemy zamówienie dla Twojego obiektu.',
    orderSubmit: 'Wyślij zgłoszenie',
    orderButton: 'Zamów sprzątanie',
    orderService: 'Rodzaj sprzątania',
    orderArea: 'Powierzchnia, m²',
    orderDate: 'Data',
    orderTime: 'Godzina',
    orderName: 'Imię',
    orderPhone: 'Telefon',
    orderAddress: 'Adres',
    orderComment: 'Komentarz',
    orderObjectType: 'Typ obiektu',
    orderFormTitle: 'Parametry zamówienia',
    orderSuccessTitle: 'Zgłoszenie zostało utworzone',
    orderSuccessText: 'Otrzymaliśmy Twoje zamówienie i skontaktujemy się w celu potwierdzenia szczegółów.',
    authTitle: 'Konto osobiste',
    authSubtitle: 'Zaloguj się lub utwórz konto, aby zarządzać zamówieniami.',
    profile: 'Profil',
    profileEditPrompt: 'Chcesz zmienić dane konta?',
    profileContactCta: 'Skontaktuj się z nami',
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

const languageOptions: Language[] = ['en', 'ru', 'uk', 'pl']
const languageCookieKey = 'cp_lang'
const cityCookieKey = 'cp_city'

function getLanguageFromCookie(): Language {
  const cookieValue = document.cookie
    .split('; ')
    .find((cookiePart) => cookiePart.startsWith(`${languageCookieKey}=`))
    ?.split('=')[1]

  if (cookieValue && languageOptions.includes(cookieValue as Language)) {
    return cookieValue as Language
  }

  return 'pl'
}

function getCityFromCookie(): string {
  const cookieValue = document.cookie
    .split('; ')
    .find((cookiePart) => cookiePart.startsWith(`${cityCookieKey}=`))
    ?.split('=')[1]

  if (cookieValue && cities.includes(cookieValue)) {
    return cookieValue
  }

  return cities[0]
}

function App() {
  const location = useLocation()
  const [language, setLanguage] = useState<Language>(() => getLanguageFromCookie())
  const [city, setCity] = useState(() => getCityFromCookie())
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [authReady, setAuthReady] = useState(false)

  const t = translations[language]

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'CleanProfi',
      '/about': `${t.about} | CleanProfi`,
      '/services': `${t.services} | CleanProfi`,
      '/reviews': `${t.reviews} | CleanProfi`,
      '/faq': `${t.faq} | CleanProfi`,
      '/contact': `${t.contact} | CleanProfi`,
      '/order': `${t.orderPageTitle} | CleanProfi`,
      '/auth': `${t.authTitle} | CleanProfi`,
      '/profile': `${t.profile} | CleanProfi`,
    }

    document.title = titles[location.pathname] ?? 'CleanProfi'
  }, [location.pathname, t.about, t.authTitle, t.contact, t.faq, t.orderPageTitle, t.profile, t.reviews, t.services])

  useEffect(() => {
    document.cookie = `${languageCookieKey}=${language}; path=/; max-age=31536000; SameSite=Lax`
  }, [language])

  useEffect(() => {
    document.cookie = `${cityCookieKey}=${city}; path=/; max-age=31536000; SameSite=Lax`
  }, [city])

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
          contact: t.contact,
          order: t.orderButton,
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
            element={<HomePage city={city} labels={t} user={currentUser} language={language} />}
          />
          <Route
            path="/about"
            element={<HomePage city={city} labels={t} user={currentUser} language={language} showWelcome={false} />}
          />
          <Route
            path="/services"
            element={
              <ServicesPage city={city} language={language} labels={t} />
            }
          />
          <Route
            path="/reviews"
            element={<ReviewsPage language={language} city={city} />}
          />
          <Route
            path="/faq"
            element={<FaqPage language={language} city={city} />}
          />
          <Route
            path="/contact"
            element={<ContactPage language={language} city={city} />}
          />
          <Route
            path="/order"
            element={<OrderPage language={language} city={city} labels={t} user={currentUser ?? undefined} />}
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

      <Footer
        labels={{
          about: t.about,
          reviews: t.reviews,
          services: t.services,
          servicesItems: t.servicesItems,
          workCitiesText: t.footerWorkCitiesText,
          emailLabel: t.footerEmailLabel,
          phoneLabel: t.footerPhoneLabel,
        }}
      />
    </div>
  )
}

export default App
