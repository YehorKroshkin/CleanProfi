type Language = 'en' | 'ru' | 'uk' | 'pl'

type ServiceItem = {
  title: string
  description: string
  icon: string
  alt: string
}

const serviceCatalog: Record<Language, ServiceItem[]> = {
  en: [
    {
      title: 'Apartments and houses',
      description: 'Regular and deep cleaning for residential spaces of any size.',
      icon: '/bed.png',
      alt: 'Apartment cleaning',
    },
    {
      title: 'Offices and workspaces',
      description: 'Clean offices, meeting rooms, and shared zones without workflow disruption.',
      icon: '/office-building.png',
      alt: 'Office cleaning',
    },
    {
      title: 'Post-renovation cleaning',
      description: 'We remove construction dust, finishing marks, and heavy contamination.',
      icon: '/construction.png',
      alt: 'Post-renovation cleaning',
    },
    {
      title: 'Windows and balconies',
      description: 'Streak-free glass, clean frames, and tidy window sills.',
      icon: '/window.png',
      alt: 'Window cleaning',
    },
    {
      title: 'Upholstered furniture',
      description: 'We refresh sofas, armchairs, and other upholstery with gentle care.',
      icon: '/sofa.png',
      alt: 'Upholstery cleaning',
    },
    {
      title: 'Carpets and mattresses',
      description: 'Deep cleaning for carpets, mattresses, and textiles with hygiene focus.',
      icon: '/carpet.png',
      alt: 'Carpet and mattress cleaning',
    },
  ],
  ru: [
    {
      title: 'Квартиры и дома',
      description: 'Поддерживающая и генеральная уборка для жилых пространств любой площади.',
      icon: '/bed.png',
      alt: 'Уборка квартиры',
    },
    {
      title: 'Офисы и рабочие пространства',
      description: 'Чистота в офисе, переговорных и общих зонах без остановки рабочих процессов.',
      icon: '/office-building.png',
      alt: 'Уборка офиса',
    },
    {
      title: 'После ремонта',
      description: 'Удаляем строительную пыль, следы отделочных материалов и тяжёлые загрязнения.',
      icon: '/construction.png',
      alt: 'Уборка после ремонта',
    },
    {
      title: 'Окна и балконы',
      description: 'Прозрачные стёкла, чистые рамы и аккуратные подоконники без разводов.',
      icon: '/window.png',
      alt: 'Мойка окон',
    },
    {
      title: 'Мягкая мебель',
      description: 'Освежаем диваны, кресла и другую обивку, сохраняя материал и цвет.',
      icon: '/sofa.png',
      alt: 'Чистка мягкой мебели',
    },
    {
      title: 'Ковры и матрасы',
      description: 'Глубокая чистка ковров, матрасов и текстиля с акцентом на свежесть и гигиену.',
      icon: '/carpet.png',
      alt: 'Чистка ковров и матрасов',
    },
  ],
  uk: [
    {
      title: 'Квартири та будинки',
      description: 'Підтримувальне та генеральне прибирання для житлових просторів будь-якої площі.',
      icon: '/bed.png',
      alt: 'Прибирання квартири',
    },
    {
      title: 'Офіси та робочі простори',
      description: 'Чистота в офісі, переговорних і спільних зонах без зупинки роботи.',
      icon: '/office-building.png',
      alt: 'Прибирання офісу',
    },
    {
      title: 'Після ремонту',
      description: 'Прибираємо будівельний пил, сліди оздоблення та складні забруднення.',
      icon: '/construction.png',
      alt: 'Прибирання після ремонту',
    },
    {
      title: 'Вікна та балкони',
      description: 'Прозоре скло, чисті рами та охайні підвіконня без розводів.',
      icon: '/window.png',
      alt: 'Миття вікон',
    },
    {
      title: 'М’які меблі',
      description: 'Освіжаємо дивани, крісла та іншу оббивку, зберігаючи матеріал і колір.',
      icon: '/sofa.png',
      alt: 'Чистка м’яких меблів',
    },
    {
      title: 'Килими та матраци',
      description: 'Глибоке очищення килимів, матраців і текстилю з акцентом на свіжість і гігієну.',
      icon: '/carpet.png',
      alt: 'Чистка килимів і матраців',
    },
  ],
  pl: [
    {
      title: 'Mieszkania i domy',
      description: 'Sprzątanie bieżące i generalne dla przestrzeni mieszkalnych każdej wielkości.',
      icon: '/bed.png',
      alt: 'Sprzątanie mieszkania',
    },
    {
      title: 'Biura i przestrzenie pracy',
      description: 'Czystość w biurach, salach spotkań i częściach wspólnych bez przerywania pracy.',
      icon: '/office-building.png',
      alt: 'Sprzątanie biura',
    },
    {
      title: 'Po remoncie',
      description: 'Usuwamy pył budowlany, ślady po wykończeniu i trudne zabrudzenia.',
      icon: '/construction.png',
      alt: 'Sprzątanie po remoncie',
    },
    {
      title: 'Okna i balkony',
      description: 'Przezroczyste szyby, czyste ramy i schludne parapety bez smug.',
      icon: '/window.png',
      alt: 'Mycie okien',
    },
    {
      title: 'Meble tapicerowane',
      description: 'Odświeżamy sofy, fotele i inną tapicerkę, dbając o materiał i kolor.',
      icon: '/sofa.png',
      alt: 'Czyszczenie mebli tapicerowanych',
    },
    {
      title: 'Dywany i materace',
      description: 'Głębokie czyszczenie dywanów, materacy i tekstyliów z naciskiem na świeżość.',
      icon: '/carpet.png',
      alt: 'Czyszczenie dywanów i materacy',
    },
  ],
}

export default serviceCatalog;