import { SlideLayout } from "../SlideLayout";

const cards = [
  {
    n: "01",
    color: "text-slide-primary",
    bar: "bg-slide-primary",
    title: "Talent Scout",
    body: "Mentorzy przeglądają karty talentów — nie CV. Jedyną walutą jest to co zrobiłeś, nie gdzie studiowałeś.",
  },
  {
    n: "02",
    color: "text-slide-violet",
    bar: "bg-slide-violet",
    title: "Battle Tasks",
    body: "Realne mini-zadania od firm. Top 3 dostaje odznakę Verified by Mentor. Otwarte dla każdego — zero wymagań wstępnych.",
  },
  {
    n: "03",
    color: "text-slide-amber",
    bar: "bg-slide-amber",
    title: "Anti-Ghosting Bridge",
    body: "Mentor nie może odrzucić kandydatury bez podania konstruktywnej wskazówki. System wymusza odpowiedzialność.",
  },
];

const Slide03Solution = () => (
  <SlideLayout variant="dark">
    <div className="absolute inset-0 px-32 pt-32 pb-24 flex flex-col">
      <div className="brand-pill text-[24px] self-start">Rozwiązanie</div>

      <h2 className="mt-10 text-[96px] font-extrabold leading-[1.05] tracking-tight">
        Jedna platforma.<br />
        Trzy mechanizmy zmiany.
      </h2>

      <div className="mt-16 grid grid-cols-3 gap-10">
        {cards.map((c) => (
          <div key={c.n} className="relative">
            <div className={`h-[6px] ${c.bar} rounded-full mb-8`} />
            <div className="bg-slide-bg-soft rounded-3xl p-12 ring-1 ring-white/5 min-h-[420px]">
              <div className={`text-[80px] font-extrabold ${c.color} leading-none`}>{c.n}</div>
              <h3 className="mt-10 text-[44px] font-bold leading-tight">{c.title}</h3>
              <p className="mt-8 text-[24px] text-slide-fg-muted leading-relaxed">{c.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-12 text-center text-[24px] text-slide-primary">
        Turkusowa filozofia: zero bramek wejściowych · obie strony odpowiadają · platforma samoreguluje się
      </div>
    </div>
  </SlideLayout>
);

export default Slide03Solution;
