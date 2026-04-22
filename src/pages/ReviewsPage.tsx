type Language = 'en' | 'ru' | 'uk' | 'pl'

type ReviewsPageProps = {
  language: Language
  city: string
}

type ServiceKey =
  | 'regular'
  | 'deep'
  | 'post_renovation'
  | 'windows'
  | 'office'
  | 'garage'
  | 'upholstery'

type TextKey =
  | 'deep_on_time'
  | 'regular_stable'
  | 'windows_clean'
  | 'post_reno_dust'
  | 'office_evening'
  | 'garage_good'
  | 'upholstery_fresh'
  | 'regular_delay_minor'
  | 'kitchen_details'
  | 'weekly_easy'

type NameKey =
  | 'anna_kowalska'
  | 'kamil_witkowski'
  | 'emma_johnson'
  | 'mikolaj_szafranski'
  | 'monika_krupa'
  | 'agnieszka_piotrowska'
  | 'liam_walker'
  | 'karolina_zawadzka'
  | 'marek_sobczak'
  | 'sofia_rossi'
  | 'joanna_kurek'
  | 'james_parker'
  | 'iga_zalewska'
  | 'mina_kim'
  | 'emilia_kozlowska'
  | 'omar_hassan'
  | 'luca_moretti'
  | 'yuki_tanaka'
  | 'maria_garcia'

type ReviewSeed = {
  id: string
  nameKey: NameKey
  city: string
  rating: number
  date: string
  service: ServiceKey
  text: TextKey
}

type Review = {
  name: string
  city: string
  rating: number
  date: string
  text: string
  service: string
}

const pageTitles: Record<Language, { title: string; subtitle: string }> = {
  en: {
    title: 'Client Reviews',
    subtitle: 'Feedback from people who booked cleaning in your area.',
  },
  ru: {
    title: 'Отзывы клиентов',
    subtitle: 'Мнения людей, которые уже заказывали уборку в вашем городе.',
  },
  uk: {
    title: 'Відгуки клієнтів',
    subtitle: 'Враження людей, які вже замовляли прибирання у вашому місті.',
  },
  pl: {
    title: 'Opinie klientów',
    subtitle: 'Opinie osób, które zamawiały sprzątanie w Twoim mieście.',
  },
}

const serviceLabels: Record<Language, Record<ServiceKey, string>> = {
  en: {
    regular: 'Regular cleaning',
    deep: 'Deep cleaning',
    post_renovation: 'Post-renovation cleaning',
    windows: 'Window and balcony cleaning',
    office: 'Office cleaning',
    garage: 'Garage cleaning',
    upholstery: 'Carpet and upholstery cleaning',
  },
  ru: {
    regular: 'Поддерживающая уборка',
    deep: 'Генеральная уборка',
    post_renovation: 'Уборка после ремонта',
    windows: 'Мойка окон и балкона',
    office: 'Уборка офиса',
    garage: 'Уборка гаража',
    upholstery: 'Чистка ковров и мягкой мебели',
  },
  uk: {
    regular: 'Підтримувальне прибирання',
    deep: 'Генеральне прибирання',
    post_renovation: 'Прибирання після ремонту',
    windows: 'Миття вікон і балкона',
    office: 'Прибирання офісу',
    garage: 'Прибирання гаража',
    upholstery: 'Чистка килимів і м’яких меблів',
  },
  pl: {
    regular: 'Sprzątanie regularne',
    deep: 'Sprzątanie generalne',
    post_renovation: 'Sprzątanie po remoncie',
    windows: 'Mycie okien i balkonu',
    office: 'Sprzątanie biura',
    garage: 'Sprzątanie garażu',
    upholstery: 'Czyszczenie dywanów i tapicerki',
  },
}

const reviewTexts: Record<Language, Record<TextKey, string>> = {
  en: {
    deep_on_time:
      'Booked deep cleaning before guests arrived. Team came exactly on time and finished faster than expected.',
    regular_stable:
      'Third booking already. Bathroom and kitchen are always done very carefully, no need to remind anything.',
    windows_clean:
      'Windows were cleaned really well. Team called 20 minutes before arrival, which was convenient.',
    post_reno_dust:
      'After renovation there was dust everywhere. One visit was enough, including lamps and baseboards.',
    office_evening:
      'Reliable evening cleaning for our office. Good communication and no disruption to work.',
    garage_good:
      'Ordered garage cleaning before spring. Floor and storage area were done thoroughly within agreed time.',
    upholstery_fresh:
      'Sofa and carpet look visibly cleaner and smell fresh. The result is exactly what we expected.',
    regular_delay_minor:
      'Overall clean, but the team was late by around 20 minutes and one shelf was missed.',
    kitchen_details:
      'Very detailed approach, especially in the kitchen and bathroom corners. We will book again.',
    weekly_easy:
      'Convenient weekly schedule and stable quality. Easy to reschedule by message when needed.',
  },
  ru: {
    deep_on_time:
      'Заказывали генеральную уборку перед приездом гостей. Команда приехала точно вовремя и закончила быстрее, чем ожидали.',
    regular_stable:
      'Это уже третий заказ. Ванная и кухня каждый раз убраны очень аккуратно, ничего не нужно напоминать.',
    windows_clean:
      'Окна отмыли действительно хорошо. За 20 минут до приезда позвонили, это удобно.',
    post_reno_dust:
      'После ремонта пыль была везде. За один выезд всё убрали, включая светильники и плинтусы.',
    office_evening:
      'Надёжная вечерняя уборка для офиса. Хорошая коммуникация, рабочему процессу не мешают.',
    garage_good:
      'Заказывали уборку гаража перед весной. Пол и зоны хранения убрали тщательно и в оговоренное время.',
    upholstery_fresh:
      'Диван и ковёр стали заметно чище и свежее. Результат полностью оправдал ожидания.',
    regular_delay_minor:
      'В целом чисто, но команда опоздала примерно на 20 минут и одну полку в коридоре пропустили.',
    kitchen_details:
      'Очень детальный подход, особенно по углам на кухне и в ванной. Будем заказывать снова.',
    weekly_easy:
      'Удобный еженедельный график и стабильное качество. При необходимости легко перенести через сообщение.',
  },
  uk: {
    deep_on_time:
      'Замовляли генеральне прибирання перед приїздом гостей. Команда приїхала вчасно і завершила швидше, ніж очікували.',
    regular_stable:
      'Це вже третє замовлення. Ванна й кухня щоразу прибрані дуже акуратно, нічого не треба нагадувати.',
    windows_clean:
      'Вікна відмили справді якісно. За 20 хвилин до приїзду зателефонували, це зручно.',
    post_reno_dust:
      'Після ремонту пил був усюди. За один візит усе прибрали, включно зі світильниками й плінтусами.',
    office_evening:
      'Надійне вечірнє прибирання для офісу. Комунікація хороша, робочому процесу не заважають.',
    garage_good:
      'Замовляли прибирання гаража перед весною. Підлогу і зони зберігання прибрали ретельно та вчасно.',
    upholstery_fresh:
      'Диван і килим стали помітно чистішими і свіжішими. Результат повністю виправдав очікування.',
    regular_delay_minor:
      'Загалом чисто, але команда запізнилася приблизно на 20 хвилин і одну полицю в коридорі пропустили.',
    kitchen_details:
      'Дуже уважний підхід, особливо до кутів у кухні та ванній. Замовлятимемо ще.',
    weekly_easy:
      'Зручний щотижневий графік і стабільна якість. За потреби легко перенести через повідомлення.',
  },
  pl: {
    deep_on_time:
      'Zamówiliśmy sprzątanie generalne przed przyjazdem gości. Zespół przyjechał punktualnie i skończył szybciej niż zakładaliśmy.',
    regular_stable:
      'To już trzecie zamówienie. Łazienka i kuchnia są zawsze bardzo dokładnie posprzątane.',
    windows_clean:
      'Okna zostały umyte bardzo dobrze. Zespół zadzwonił 20 minut przed przyjazdem, co było wygodne.',
    post_reno_dust:
      'Po remoncie kurz był wszędzie. Jedna wizyta wystarczyła, łącznie z lampami i listwami.',
    office_evening:
      'Solidne sprzątanie wieczorne dla biura. Dobry kontakt i brak zakłóceń pracy.',
    garage_good:
      'Zamówiliśmy sprzątanie garażu przed wiosną. Podłoga i strefa przechowywania zostały doczyszczone bardzo dokładnie.',
    upholstery_fresh:
      'Sofa i dywan są wyraźnie czystsze i świeższe. Efekt dokładnie taki, jak oczekiwaliśmy.',
    regular_delay_minor:
      'Ogólnie czysto, ale ekipa spóźniła się około 20 minut i pominęła jedną półkę w przedpokoju.',
    kitchen_details:
      'Bardzo dokładne podejście, szczególnie do narożników w kuchni i łazience. Zamówimy ponownie.',
    weekly_easy:
      'Wygodny cotygodniowy harmonogram i stabilna jakość. W razie potrzeby łatwo przełożyć termin wiadomością.',
  },
}

const reviewNames: Record<Language, Record<NameKey, string>> = {
  en: {
    anna_kowalska: 'Anna Kowalska',
    kamil_witkowski: 'Kamil Witkowski',
    emma_johnson: 'Emma Johnson',
    mikolaj_szafranski: 'Mikolaj Szafranski',
    monika_krupa: 'Monika Krupa',
    agnieszka_piotrowska: 'Agnieszka Piotrowska',
    liam_walker: 'Liam Walker',
    karolina_zawadzka: 'Karolina Zawadzka',
    marek_sobczak: 'Marek Sobczak',
    sofia_rossi: 'Sofia Rossi',
    joanna_kurek: 'Joanna Kurek',
    james_parker: 'James Parker',
    iga_zalewska: 'Iga Zalewska',
    mina_kim: 'Mina Kim',
    emilia_kozlowska: 'Emilia Kozlowska',
    omar_hassan: 'Omar Hassan',
    luca_moretti: 'Luca Moretti',
    yuki_tanaka: 'Yuki Tanaka',
    maria_garcia: 'Maria Garcia',
  },
  ru: {
    anna_kowalska: 'Анна Ковальская',
    kamil_witkowski: 'Камиль Витковский',
    emma_johnson: 'Эмма Джонсон',
    mikolaj_szafranski: 'Миколай Шафраньский',
    monika_krupa: 'Моника Крупа',
    agnieszka_piotrowska: 'Агнешка Петровска',
    liam_walker: 'Лиам Уокер',
    karolina_zawadzka: 'Каролина Завадзка',
    marek_sobczak: 'Марек Собчак',
    sofia_rossi: 'София Росси',
    joanna_kurek: 'Йоанна Курек',
    james_parker: 'Джеймс Паркер',
    iga_zalewska: 'Ига Залевска',
    mina_kim: 'Мина Ким',
    emilia_kozlowska: 'Эмилия Козловска',
    omar_hassan: 'Омар Хассан',
    luca_moretti: 'Лука Моретти',
    yuki_tanaka: 'Юки Танака',
    maria_garcia: 'Мария Гарсия',
  },
  uk: {
    anna_kowalska: 'Анна Ковальська',
    kamil_witkowski: 'Каміль Вітковський',
    emma_johnson: 'Емма Джонсон',
    mikolaj_szafranski: 'Миколай Шафранський',
    monika_krupa: 'Моніка Крупа',
    agnieszka_piotrowska: 'Агнешка Пйотровська',
    liam_walker: 'Ліам Вокер',
    karolina_zawadzka: 'Кароліна Завадська',
    marek_sobczak: 'Марек Собчак',
    sofia_rossi: 'Софія Россі',
    joanna_kurek: 'Йоанна Курек',
    james_parker: 'Джеймс Паркер',
    iga_zalewska: 'Іга Залевська',
    mina_kim: 'Міна Кім',
    emilia_kozlowska: 'Емілія Козловська',
    omar_hassan: 'Омар Хассан',
    luca_moretti: 'Лука Моретті',
    yuki_tanaka: 'Юкі Танака',
    maria_garcia: 'Марія Гарсія',
  },
  pl: {
    anna_kowalska: 'Anna Kowalska',
    kamil_witkowski: 'Kamil Witkowski',
    emma_johnson: 'Emma Johnson',
    mikolaj_szafranski: 'Mikolaj Szafranski',
    monika_krupa: 'Monika Krupa',
    agnieszka_piotrowska: 'Agnieszka Piotrowska',
    liam_walker: 'Liam Walker',
    karolina_zawadzka: 'Karolina Zawadzka',
    marek_sobczak: 'Marek Sobczak',
    sofia_rossi: 'Sofia Rossi',
    joanna_kurek: 'Joanna Kurek',
    james_parker: 'James Parker',
    iga_zalewska: 'Iga Zalewska',
    mina_kim: 'Mina Kim',
    emilia_kozlowska: 'Emilia Kozlowska',
    omar_hassan: 'Omar Hassan',
    luca_moretti: 'Luca Moretti',
    yuki_tanaka: 'Yuki Tanaka',
    maria_garcia: 'Maria Garcia',
  },
}

const reviewsByCity: Record<string, ReviewSeed[]> = {
  Gdansk: [
    { id: 'gd-1', nameKey: 'anna_kowalska', city: 'Gdansk', rating: 5, date: '2026-04-18', service: 'deep', text: 'deep_on_time' },
    { id: 'gd-2', nameKey: 'kamil_witkowski', city: 'Gdansk', rating: 5, date: '2026-04-15', service: 'regular', text: 'regular_stable' },
    { id: 'gd-3', nameKey: 'emma_johnson', city: 'Gdansk', rating: 4, date: '2026-04-12', service: 'windows', text: 'windows_clean' },
    { id: 'gd-4', nameKey: 'mikolaj_szafranski', city: 'Gdansk', rating: 5, date: '2026-04-10', service: 'post_renovation', text: 'post_reno_dust' },
    { id: 'gd-5', nameKey: 'monika_krupa', city: 'Gdansk', rating: 3, date: '2026-03-21', service: 'regular', text: 'regular_delay_minor' },
  ],
  Sopot: [
    { id: 'sp-1', nameKey: 'agnieszka_piotrowska', city: 'Sopot', rating: 5, date: '2026-04-19', service: 'regular', text: 'weekly_easy' },
    { id: 'sp-2', nameKey: 'liam_walker', city: 'Sopot', rating: 4, date: '2026-04-14', service: 'deep', text: 'kitchen_details' },
    { id: 'sp-3', nameKey: 'karolina_zawadzka', city: 'Sopot', rating: 5, date: '2026-04-11', service: 'post_renovation', text: 'post_reno_dust' },
    { id: 'sp-4', nameKey: 'marek_sobczak', city: 'Sopot', rating: 5, date: '2026-04-09', service: 'office', text: 'office_evening' },
    { id: 'sp-5', nameKey: 'sofia_rossi', city: 'Sopot', rating: 5, date: '2026-03-29', service: 'upholstery', text: 'upholstery_fresh' },
    { id: 'sp-6', nameKey: 'omar_hassan', city: 'Sopot', rating: 5, date: '2026-03-26', service: 'garage', text: 'garage_good' },
    { id: 'sp-7', nameKey: 'luca_moretti', city: 'Sopot', rating: 4, date: '2026-03-20', service: 'windows', text: 'windows_clean' },
    { id: 'sp-8', nameKey: 'yuki_tanaka', city: 'Sopot', rating: 5, date: '2026-03-16', service: 'regular', text: 'regular_stable' },
  ],
  Gdynia: [
    { id: 'gy-1', nameKey: 'joanna_kurek', city: 'Gdynia', rating: 5, date: '2026-04-20', service: 'regular', text: 'regular_stable' },
    { id: 'gy-2', nameKey: 'james_parker', city: 'Gdynia', rating: 5, date: '2026-04-16', service: 'deep', text: 'kitchen_details' },
    { id: 'gy-3', nameKey: 'iga_zalewska', city: 'Gdynia', rating: 4, date: '2026-04-13', service: 'windows', text: 'windows_clean' },
    { id: 'gy-4', nameKey: 'mina_kim', city: 'Gdynia', rating: 5, date: '2026-04-07', service: 'garage', text: 'garage_good' },
    { id: 'gy-5', nameKey: 'emilia_kozlowska', city: 'Gdynia', rating: 5, date: '2026-04-04', service: 'post_renovation', text: 'deep_on_time' },
    { id: 'gy-6', nameKey: 'maria_garcia', city: 'Gdynia', rating: 4, date: '2026-03-30', service: 'office', text: 'office_evening' },
  ],
}

function localizeReviews(language: Language, city: string): Review[] {
  const source = reviewsByCity[city] ?? []
  return source.map((review) => ({
    name: reviewNames[language][review.nameKey],
    city: review.city,
    rating: review.rating,
    date: review.date,
    service: serviceLabels[language][review.service],
    text: reviewTexts[language][review.text],
  }))
}

export function ReviewsPage({ language, city }: ReviewsPageProps) {
  const labels = pageTitles[language]
  const reviews = localizeReviews(language, city)

  return (
    <div className="reviews-page">
      <section className="hero-block">
        <p className="city-pill">{city}</p>
        <h1>{labels.title}</h1>
        <p className="hero-subtitle">{labels.subtitle}</p>
      </section>

      <section className="reviews-grid">
        {reviews.map((review) => (
          <article key={`${review.name}-${review.date}`} className="review-card">
            <div className="review-head">
              <h2>{review.name}</h2>
              <span className="review-rating" aria-label={`Rating ${review.rating} of 5`}>
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </span>
            </div>
            <p className="review-meta">{review.city} • {review.date} • {review.service}</p>
            <p>{review.text}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
