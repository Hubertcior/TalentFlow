import type { Talent, Company, BattleTask, Submission, Decision } from "./types.js";

const now = Date.now();
const days = (n: number) => new Date(now + n * 86400000).toISOString();

const SEED_TALENTS: Talent[] = [
  {
    id: "t-me", name: "Zofia Malinowska", initials: "ZM", role: "Marketing & Komunikacja",
    bio: "Selfmade content creatorka. Prowadzę konta brandowe od 15 r.ż. — bez studiów marketingowych, tylko praktyka i efekty.",
    age: 19, city: "Wrocław", availability: "now", portfolioUrl: "https://behance.net",
    interests: ["marketing cyfrowy", "social media", "copywriting", "SEO", "Canva / Adobe"],
    badges: [{ id: "b-1", company: "MediaPulse", taskTitle: "Content plan dla kawiarni", rank: 1, total: 42, awardedAt: days(-40) }],
    isMe: true,
  },
  {
    id: "t-2", name: "Kasia Wojciechowska", initials: "KW", role: "UX Design & Frontend",
    bio: "Liceum + samodzielna nauka Figmy i Reacta. Pasjonuje mnie projektowanie z perspektywy użytkownika.",
    age: 18, city: "Kraków", availability: "now",
    interests: ["projektowanie UX", "Figma", "React", "CSS animacje", "badania użytkowników"],
    badges: [
      { id: "b-2", company: "TechFlow", taskTitle: "UX flow aplikacji praktyk", rank: 1, total: 38, awardedAt: days(-30) },
      { id: "b-3", company: "MediaPulse", taskTitle: "Content plan dla kawiarni", rank: 2, total: 42, awardedAt: days(-90) },
    ],
  },
  {
    id: "t-3", name: "Mateusz Jankowski", initials: "MJ", role: "IT i Sieci Komputerowe",
    bio: "Homelab z Kubernetesem, pasjonat cyberbezpieczeństwa. Certyfikat CompTIA A+ na własną rękę.",
    age: 22, city: "Warszawa", availability: "soon",
    interests: ["sieci komputerowe", "cyberbezpieczeństwo", "Linux", "cloud (AWS)", "DevOps"],
    badges: [{ id: "b-4", company: "TechFlow", taskTitle: "UX flow aplikacji praktyk", rank: 2, total: 38, awardedAt: days(-15) }],
  },
  {
    id: "t-4", name: "Ola Nowicka", initials: "ON", role: "Turystyka i Hotelarstwo",
    bio: "Technikum hotelarskie + praca sezonowa w recepcji. Umiem obsługiwać PMS i mówię po angielsku i niemiecku.",
    age: 20, city: "Poznań", availability: "now",
    interests: ["obsługa gości", "organizacja eventów", "turystyka i pilotaż", "MICE", "systemy rezerwacji (PMS)"],
    badges: [{ id: "b-5", company: "Hotel Amber Palace", taskTitle: "Weekend package dla rodzin", rank: 1, total: 24, awardedAt: days(-50) }],
  },
  {
    id: "t-5", name: "Kuba Lis", initials: "KL", role: "Gastronomia i Kuchnia",
    bio: "Technikum gastronomiczne, praktyki w restauracji gwiazdkowej. Specjalizuję się w pastry i kuchni fusion.",
    age: 17, city: "Gdańsk", availability: "busy",
    interests: ["kuchnia europejska", "pastry i cukiernictwo", "HACCP i higiena", "food cost", "barista"],
    badges: [{ id: "b-6", company: "Hotel Amber Palace", taskTitle: "Weekend package dla rodzin", rank: 2, total: 24, awardedAt: days(-50) }],
  },
  {
    id: "t-6", name: "Zosia Kamińska", initials: "ZK", role: "Prawo i Obsługa Prawna",
    bio: "Studia prawnicze (II rok), aktywna w kołach naukowych. Interesuję się prawem handlowym i ochroną danych.",
    age: 21, city: "Wrocław", availability: "soon",
    interests: ["prawo cywilne", "prawo pracy", "umowy handlowe", "prawo administracyjne", "RODO / ochrona danych"],
    badges: [],
  },
  {
    id: "t-7", name: "Antek Wójcik", initials: "AW", role: "Opieka Zdrowotna i Pielęgniarstwo",
    bio: "Szkoła medyczna (pielęgniarstwo), wolontariat w hospicjum. Zależy mi na opiece skoncentrowanej na pacjencie.",
    age: 18, city: "Łódź", availability: "now",
    interests: ["opieka nad pacjentem", "pierwsza pomoc i RKO", "opieka geriatryczna", "farmakologia", "dokumentacja medyczna"],
    badges: [],
  },
  {
    id: "t-8", name: "Hania Pawlak", initials: "HP", role: "Edukacja i Pedagogika",
    bio: "Liceum pedagogiczne, praktyki w szkole podstawowej. Prowadzę kółko artystyczne dla dzieci od 14 r.ż.",
    age: 17, city: "Warszawa", availability: "now",
    interests: ["pedagogika wczesnoszkolna", "praca z dziećmi", "edukacja specjalna", "logopedia", "terapia zabawą"],
    badges: [],
  },
  {
    id: "t-me-2", name: "Piotr Nowak", initials: "PN", role: "Rachunkowość i Finanse",
    bio: "Technikum ekonomiczne, kurs księgowości. Obsługuję program Symfonia i znam Excela na poziomie zaawansowanym.",
    age: 22, city: "Warszawa", availability: "soon", portfolioUrl: "https://github.com",
    interests: ["rachunkowość", "Excel / Power BI", "VAT i podatki", "analiza finansowa", "audyt wewnętrzny"],
    badges: [{ id: "b-me2-1", company: "Biuro Rachunkowe ProFin", taskTitle: "Bilans dla mikroprzedsiębiorcy", rank: 1, total: 19, awardedAt: days(-20) }],
  },
];

const SEED_COMPANIES: Company[] = [
  { id: "c-me", name: "TechFlow", mentorName: "Kamil Wiśniewski", industry: "Product Studio", isMe: true },
  { id: "c-1", name: "MediaPulse", mentorName: "Kasia Zielińska", industry: "Agencja marketingowa" },
  { id: "c-2", name: "Kancelaria Nowak & Wspólnicy", mentorName: "Marcin Nowak", industry: "Prawo" },
  { id: "c-3", name: "Hotel Amber Palace", mentorName: "Agnieszka Morawska", industry: "Hotelarstwo" },
  { id: "c-4", name: "Centrum Zdrowia Vita", mentorName: "dr Piotr Kowalski", industry: "Opieka zdrowotna" },
  { id: "c-5", name: "Biuro Rachunkowe ProFin", mentorName: "Tomasz Dąbrowski", industry: "Rachunkowość" },
];

const SEED_TASKS: BattleTask[] = [
  { id: "task-1", companyId: "c-me", title: "Zaprojektuj UX flow aplikacji do szukania praktyk", brief: "Nasz startup buduje platformę praktyk zawodowych dla młodych. Zaprojektuj flow onboardingu kandydata — od rejestracji do pierwszego zgłoszenia. Figma lub inna narzędzie. Pokaż 3–5 ekranów i uzasadnij decyzje.", reward: "Rozmowa z zespołem + staż", industry: "IT & Technologie", status: "open", dueAt: days(6), createdAt: days(-2) },
  { id: "task-2", companyId: "c-1", title: "Content plan na 30 dni dla lokalnej kawiarni", brief: "Kawiarnia 'Złoty Kubek' (Kraków) chce zaistnieć na Instagramie. Opracuj plan 30 postów — tematyka, format (reel/post/story), optymalny czas publikacji, 3 pomysły na kampanię sezonową. Cel: +200 obserwujących.", reward: "Praktyki 3 miesiące + mentoring", industry: "Marketing", status: "judging", dueAt: days(-1), createdAt: days(-10) },
  { id: "task-3", companyId: "c-2", title: "Zidentyfikuj ryzyka prawne w umowie zlecenia", brief: "Kancelaria przygotowała przykładową umowę zlecenia (dołączona w brieferze). Zidentyfikuj minimum 3 ryzyka prawne — ZUS, IP, zakaz konkurencji, inne. Zaproponuj konkretne zmiany do każdego ryzyka.", reward: "Praktyki 2 miesiące + list referencyjny", industry: "Prawo", status: "open", dueAt: days(9), createdAt: days(-3) },
  { id: "task-4", companyId: "c-3", title: "Zaplanuj weekend package dla rodzin z dziećmi", brief: "Hotel Amber Palace szuka nowego produktu weekendowego na sezon letni. Zaprojektuj pakiet dla rodzin z dziećmi 4–12 lat: co wchodzi w cenę, jak to wycenić, jak promować w OTA i social mediach.", reward: "Praktyki w recepcji + 2 doby gratis", industry: "Hotelarstwo", status: "closed", dueAt: days(-15), createdAt: days(-25) },
  { id: "task-5", companyId: "c-5", title: "Sporządź uproszczony bilans dla mikroprzedsiębiorcy", brief: "Nasz klient prowadzi mały sklep z odzieżą. Dostajesz zestawienie 20 transakcji z ostatniego miesiąca. Sporządź uproszczony bilans i rachunek wyników w Excelu lub Google Sheets. Pokaż jak kategoryzujesz koszty.", reward: "Praktyki 1 miesiąc + certyfikat", industry: "Rachunkowość", status: "open", dueAt: days(7), createdAt: days(-4) },
];

const SEED_SUBMISSIONS: Submission[] = [
  { id: "s-1", taskId: "task-1", talentId: "t-2", summary: "Zaprojektowałam 5 ekranów w Figma: splash → wybór roli → formularz zainteresowań → lista praktyk → pierwsze zgłoszenie. Dodałam progress dots i walidację inline, żeby zmniejszyć porzucenia.", link: "https://figma.com", submittedAt: days(-1) },
  { id: "s-2", taskId: "task-1", talentId: "t-3", summary: "Podszedłem od strony architektury: zaproponowałem flow z OAuth (logowanie przez Google) + onboarding w 2 krokach. Makieta w Figma pokazuje ścieżkę happy path i 2 edge case'y.", link: "https://figma.com", submittedAt: days(-1) },
  { id: "s-3", taskId: "task-1", talentId: "t-me", summary: "Jako użytkowniczka platform pracy widzę, że onboarding odstrasza. Zaprojektowałam flow 'one question at a time' (jak Typeform) z wyborem dziedziny praktyk już na ekranie 2. Figma + notatki UX.", link: "https://behance.net", submittedAt: days(0) },
  { id: "s-4", taskId: "task-2", talentId: "t-me", summary: "Content plan w Notion: 30 postów podzielonych na 4 filary tematyczne (kawa, atmosfera, ludzie, sezon). Każdy post ma format, caption draft i slot godzinowy. Bonus: 3 reelsy z templatem nagrania.", link: "https://behance.net", submittedAt: days(-3), rank: 1 },
  { id: "s-5", taskId: "task-2", talentId: "t-4", summary: "Podeszłam od strony doświadczeń gości — kawiarnia jako 'trzecie miejsce'. Plan 30 dni z kampanią 'Poznaj swojego baristę' jako głównym motywem. Prosta tabela Excel + przykładowe grafiki w Canvie.", link: "https://figma.com", submittedAt: days(-2), rank: 2 },
  { id: "s-6", taskId: "task-2", talentId: "t-8", summary: "Skupiłam się na storytellingu miejsca: cykl 'Kawiarnia na chwilę' ze zdjęciami klientów (za zgodą). 30-dniowy plan w Google Sheets z kolumnami: dzień, format, treść, hashtagi.", link: "https://figma.com", submittedAt: days(-2), rank: 3 },
  { id: "s-7", taskId: "task-3", talentId: "t-6", summary: "Zidentyfikowałam 5 ryzyk: brak obowiązkowych składek ZUS przy przekroczeniu progu, nieprecyzyjne klauzule IP (brak cesji praw autorskich), brak klauzuli poufności, niejasny zakaz konkurencji, brak procedury reklamacji. Proponuję konkretne zapisy dla każdego.", submittedAt: days(-1) },
  { id: "s-me2-1", taskId: "task-3", talentId: "t-me-2", summary: "Z perspektywy księgowego: główne ryzyko to kwestia ZUS (umowa zlecenia a B2B). Wskazałem 3 punkty umowy gdzie brakuje limitów czasowych i kwotowych, co naraża zleceniodawcę na spory podatkowe.", submittedAt: days(-2) },
  { id: "s-8", taskId: "task-4", talentId: "t-4", summary: "Pakiet 'Rodzinny Amber': 2 noce + śniadanie + atrakcje dla dzieci (animacje, basen) + kolacja tematyczna. Wycena na podstawie analizy konkurencji. Dystrybucja: Booking.com + Instagram Stories.", submittedAt: days(-20), rank: 1 },
  { id: "s-9", taskId: "task-4", talentId: "t-5", summary: "Dołożyłem kulinarny wymiar: warsztaty gotowania dla dzieci prowadzone przez kucharzy, zestaw 'Mały kucharz' w pokoju. Wycena z food cost 30%. To wyróżni hotel spośród konkurencji.", submittedAt: days(-19), rank: 2 },
  { id: "s-10", taskId: "task-5", talentId: "t-me-2", summary: "Sporządziłem bilans w Google Sheets z 6 kategoriami kosztów (towary, czynsze, ZUS, marketing, transport, inne). Rachunek wyników pokazuje marżę brutto 34%. Dodałem pivot do analizy trendów miesięcznych.", link: "https://github.com", submittedAt: days(-1) },
  { id: "s-11", taskId: "task-5", talentId: "t-6", summary: "Z perspektywy prawa: zwróciłam uwagę na kategorie kosztów nieodliczalnych od podatku. Prosty Excel z 20 wierszami + notatki o kwestiach KPiR vs pełna księgowość.", submittedAt: days(0) },
];

const SEED_DECISIONS: Decision[] = [
  { id: "d-1", talentId: "t-2", companyId: "c-1", outcome: "accepted", createdAt: days(-30), responseTimeHours: 18 },
  { id: "d-2", talentId: "t-3", companyId: "c-me", outcome: "accepted", createdAt: days(-15), responseTimeHours: 26 },
  { id: "d-3", talentId: "t-4", companyId: "c-1", outcome: "rejected", tip: "Potrzebujesz więcej praktycznego doświadczenia w tej dziedzinie", createdAt: days(-22), responseTimeHours: 36 },
  { id: "d-4", talentId: "t-6", companyId: "c-2", outcome: "rejected", tip: "Popracuj nad komunikacją w zespole", createdAt: days(-9), responseTimeHours: 48 },
  { id: "d-5", talentId: "t-5", companyId: "c-3", outcome: "accepted", createdAt: days(-50), responseTimeHours: 12 },
  { id: "d-6", talentId: "t-7", companyId: "c-4", outcome: "rejected", tip: "Brak dopasowania do aktualnych potrzeb firmy", createdAt: days(-7), responseTimeHours: 72 },
  { id: "d-7", talentId: "t-8", companyId: "c-4", outcome: "accepted", createdAt: days(-12), responseTimeHours: 22 },
  { id: "d-me-1", talentId: "t-me", companyId: "c-1", outcome: "rejected", tip: "Potrzebujesz więcej praktycznego doświadczenia w tej dziedzinie", note: "Świetny content plan, ale szukamy kogoś z doświadczeniem w prowadzeniu kont na co dzień.", createdAt: days(-5), responseTimeHours: 30 },
  { id: "d-me2-1", talentId: "t-me-2", companyId: "c-5", outcome: "accepted", createdAt: days(-10), responseTimeHours: 20 },
  { id: "d-me2-2", talentId: "t-me-2", companyId: "c-2", outcome: "rejected", tip: "Potrzebujesz więcej praktycznego doświadczenia w tej dziedzinie", note: "Dobra analiza finansowa, ale kancelaria szuka prawnika, nie księgowego.", createdAt: days(-3), responseTimeHours: 48 },
];

// In-memory state (mutable)
export const db = {
  talents: structuredClone(SEED_TALENTS) as Talent[],
  companies: structuredClone(SEED_COMPANIES) as Company[],
  tasks: structuredClone(SEED_TASKS) as BattleTask[],
  submissions: structuredClone(SEED_SUBMISSIONS) as Submission[],
  decisions: structuredClone(SEED_DECISIONS) as Decision[],
};
