import type {
  Talent, Company, BattleTask, Submission, Decision,
} from "@/types/domain";

const now = Date.now();
const days = (n: number) => new Date(now + n * 86400000).toISOString();

export const SEED_TALENTS: Talent[] = [
  {
    id: "t-me",
    name: "Ty (Talent)",
    initials: "TY",
    role: "UI/UX + Frontend",
    bio: "Selfmade designerka i frontend dev. Buduję aplikacje od 16 r.ż. — bez bootcampu, bez studiów.",
    age: 19,
    city: "Wrocław",
    availability: "now",
    portfolioUrl: "https://dribbble.com",
    skills: [
      { name: "Figma / UI design", level: 9 },
      { name: "React", level: 7 },
      { name: "CSS animacje", level: 8 },
      { name: "Motion design", level: 6 },
    ],
    badges: [
      {
        id: "b-1",
        company: "Netguru",
        taskTitle: "Onboarding fintech",
        rank: 1, total: 48,
        awardedAt: days(-40),
      },
    ],
    isMe: true,
  },
  {
    id: "t-2",
    name: "Kasia Wojciechowska",
    initials: "KW",
    role: "UI/UX + Frontend",
    bio: "Liceum + samodzielna nauka. Pasjonuje mnie microinteractions.",
    age: 18, city: "Kraków", availability: "now",
    skills: [
      { name: "Figma / UI design", level: 9 },
      { name: "React", level: 7 },
      { name: "CSS animacje", level: 8 },
    ],
    badges: [
      { id: "b-2", company: "Netguru", taskTitle: "Onboarding fintech", rank: 1, total: 48, awardedAt: days(-30) },
      { id: "b-3", company: "Base CRM", taskTitle: "Pipeline view", rank: 2, total: 31, awardedAt: days(-90) },
    ],
  },
  {
    id: "t-3",
    name: "Mateusz Jankowski",
    initials: "MJ",
    role: "Backend + DevOps",
    bio: "Buduję infra w wolnym czasie. Homelab z Kubernetes.",
    age: 22, city: "Warszawa", availability: "soon",
    skills: [
      { name: "Go", level: 8 },
      { name: "Kubernetes", level: 7 },
      { name: "PostgreSQL", level: 8 },
    ],
    badges: [
      { id: "b-4", company: "Allegro", taskTitle: "Cache layer redesign", rank: 1, total: 22, awardedAt: days(-15) },
    ],
  },
  {
    id: "t-4",
    name: "Ola Nowicka",
    initials: "ON",
    role: "Product Designer",
    bio: "TikTok content creator → product design. Lubię badania użytkowników.",
    age: 20, city: "Poznań", availability: "now",
    skills: [
      { name: "Figma / UI design", level: 8 },
      { name: "User research", level: 7 },
      { name: "Prototyping", level: 9 },
    ],
    badges: [],
  },
  {
    id: "t-5",
    name: "Kuba Lis",
    initials: "KL",
    role: "Mobile (React Native)",
    bio: "Wydałem 4 appki w Sklepie Play, łącznie ~12k pobrań.",
    age: 17, city: "Gdańsk", availability: "busy",
    skills: [
      { name: "React Native", level: 8 },
      { name: "TypeScript", level: 7 },
      { name: "Animations", level: 6 },
    ],
    badges: [
      { id: "b-5", company: "Booksy", taskTitle: "Booking screen redesign", rank: 3, total: 19, awardedAt: days(-50) },
    ],
  },
  {
    id: "t-6",
    name: "Zosia Kamińska",
    initials: "ZK",
    role: "Data + ML",
    bio: "Studiuję sama, projekty z Kaggle. Lubię NLP i GenAI.",
    age: 21, city: "Wrocław", availability: "soon",
    skills: [
      { name: "Python", level: 9 },
      { name: "PyTorch", level: 7 },
      { name: "SQL", level: 8 },
    ],
    badges: [],
  },
  {
    id: "t-7",
    name: "Antek Wójcik",
    initials: "AW",
    role: "Frontend + 3D",
    bio: "Three.js, WebGL, demoscene vibes.",
    age: 18, city: "Łódź", availability: "now",
    skills: [
      { name: "React", level: 7 },
      { name: "Three.js", level: 8 },
      { name: "Shaders", level: 7 },
    ],
    badges: [],
  },
  {
    id: "t-8",
    name: "Hania Pawlak",
    initials: "HP",
    role: "Brand + Motion",
    bio: "Robię identyfikacje wizualne dla startupów od 15 r.ż.",
    age: 17, city: "Warszawa", availability: "now",
    skills: [
      { name: "After Effects", level: 9 },
      { name: "Illustrator", level: 8 },
      { name: "Brand strategy", level: 6 },
    ],
    badges: [
      { id: "b-6", company: "Brainly", taskTitle: "Logo refresh", rank: 2, total: 27, awardedAt: days(-12) },
    ],
  },
];

export const SEED_COMPANIES: Company[] = [
  { id: "c-me", name: "Twoja firma", mentorName: "Ty (Mentor)", industry: "Recruiting", isMe: true },
  { id: "c-1", name: "Netguru", mentorName: "Anna Lewandowska", industry: "Software house" },
  { id: "c-2", name: "Allegro", mentorName: "Piotr Kowalski", industry: "E-commerce" },
  { id: "c-3", name: "Booksy", mentorName: "Marta Kwiatkowska", industry: "SaaS" },
  { id: "c-4", name: "Brainly", mentorName: "Jan Zieliński", industry: "EdTech" },
  { id: "c-5", name: "Base CRM", mentorName: "Tomek Dąbrowski", industry: "B2B SaaS" },
];

export const SEED_TASKS: BattleTask[] = [
  {
    id: "task-1",
    companyId: "c-me",
    title: "Przeprojektuj ekran onboardingu dla aplikacji fintech",
    brief: "Obecny onboarding ma 40% porzuceń na kroku 3. Przeprojektuj go dla mobile (3–5 ekranów). Liczy się klarowność i tempo.",
    reward: "Verified by Mentor + interview slot",
    status: "open",
    dueAt: days(5),
    createdAt: days(-2),
  },
  {
    id: "task-2",
    companyId: "c-1",
    title: "Animowany loader dla aplikacji bankowej",
    brief: "Krótka, charakterystyczna animacja loadera (1–2s). Lottie albo Framer Motion. Pokaż source.",
    reward: "Verified by Mentor",
    status: "judging",
    dueAt: days(-1),
    createdAt: days(-10),
  },
  {
    id: "task-3",
    companyId: "c-2",
    title: "Redesign filtrowania w katalogu produktów",
    brief: "Mobile-first. Pokaż ścieżkę 'znajdę buty do biegania w 30s'.",
    reward: "Verified by Mentor + 500 PLN",
    status: "open",
    dueAt: days(8),
    createdAt: days(-3),
  },
  {
    id: "task-4",
    companyId: "c-3",
    title: "Mini-prototyp: rezerwacja w 3 tapach",
    brief: "Pokaż jak skrócić rezerwację wizyty do 3 tapów. Figma prototyp.",
    reward: "Verified by Mentor",
    status: "closed",
    dueAt: days(-15),
    createdAt: days(-25),
  },
];

export const SEED_SUBMISSIONS: Submission[] = [
  // task-1 (open) — kilka submissions
  { id: "s-1", taskId: "task-1", talentId: "t-2", summary: "Połączyłam onboarding w 2 ekrany, dodałam progress dots i wymusiłam scroll na pierwszym kroku. Animacja przejścia 200ms.", link: "https://figma.com", submittedAt: days(-1) },
  { id: "s-2", taskId: "task-1", talentId: "t-4", summary: "Test A/B na 8 użytkownikach — usunęłam pole telefonu na kroku 3, wskaźnik ukończenia +22% w prototypie.", link: "https://figma.com", submittedAt: days(-1) },
  { id: "s-3", taskId: "task-1", talentId: "t-7", summary: "Dodałem mikro-iluustracje 3D na każdy krok, żeby zmniejszyć stres przy podawaniu danych finansowych.", link: "https://figma.com", submittedAt: days(0) },
  { id: "s-4", taskId: "task-1", talentId: "t-me", summary: "Zamieniłam formularz na 'one question at a time' (jak Typeform). Krok 3 podzielony na 2 mniejsze.", link: "https://dribbble.com", submittedAt: days(0) },

  // task-2 (judging) — finalizowany
  { id: "s-5", taskId: "task-2", talentId: "t-2", summary: "Lottie animacja oparta o logo banku. Krzywa cubic-bezier dla 'oddychania'.", link: "https://github.com", submittedAt: days(-3), rank: 1 },
  { id: "s-6", taskId: "task-2", talentId: "t-8", summary: "Motion design w AE → eksport do Lottie, 1.4s, 60fps.", link: "https://github.com", submittedAt: days(-2), rank: 2 },
  { id: "s-7", taskId: "task-2", talentId: "t-7", summary: "WebGL shader (zbyt ciężki na mobile, ale efektowny).", link: "https://github.com", submittedAt: days(-2), rank: 3 },

  // task-3 (open) — kilka submissions
  { id: "s-8", taskId: "task-3", talentId: "t-3", summary: "Backend POV: zaproponowałem reorganizację indeksu + UI z chip filtrami. Mock danych w repo.", link: "https://github.com", submittedAt: days(-1) },
  { id: "s-9", taskId: "task-3", talentId: "t-5", summary: "Mobilny prototyp w Figma — bottom sheet z filtrami, swipe do porównania.", link: "https://figma.com", submittedAt: days(0) },

  // task-4 (closed) — historyczne
  { id: "s-10", taskId: "task-4", talentId: "t-5", summary: "Skróciłem rezerwację do 3 tapów wykorzystując 'continue last booking'.", submittedAt: days(-20), rank: 1 },
];

export const SEED_DECISIONS: Decision[] = [
  // Historyczne decyzje (do scoringu firm)
  { id: "d-1", talentId: "t-2", companyId: "c-1", outcome: "accepted", createdAt: days(-30), responseTimeHours: 18 },
  { id: "d-2", talentId: "t-3", companyId: "c-2", outcome: "accepted", createdAt: days(-15), responseTimeHours: 26 },
  { id: "d-3", talentId: "t-4", companyId: "c-1", outcome: "rejected", tip: "Podszkol framework, którego używamy (React)", createdAt: days(-22), responseTimeHours: 36, usefulness: 4 },
  { id: "d-4", talentId: "t-6", companyId: "c-2", outcome: "rejected", tip: "Popracuj nad komunikacją w zespole", createdAt: days(-9), responseTimeHours: 48, usefulness: 3 },
  { id: "d-5", talentId: "t-5", companyId: "c-3", outcome: "accepted", createdAt: days(-50), responseTimeHours: 12 },
  { id: "d-6", talentId: "t-7", companyId: "c-4", outcome: "rejected", tip: "Brak dopasowania kulturowego do zespołu", createdAt: days(-7), responseTimeHours: 72, usefulness: 2 },
  { id: "d-7", talentId: "t-8", companyId: "c-4", outcome: "accepted", createdAt: days(-12), responseTimeHours: 22 },

  // Mój inbox (jako talent)
  { id: "d-me-1", talentId: "t-me", companyId: "c-1", outcome: "rejected", tip: "Podszkol framework, którego używamy (React)", note: "Świetne portfolio designerskie, ale szukamy kogoś z mocniejszym React.", createdAt: days(-5), responseTimeHours: 30 },
];
