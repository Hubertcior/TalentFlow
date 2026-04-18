import { SlideLayout } from "../SlideLayout";

const principles = [
  {
    icon: "Ø",
    color: "text-slide-primary",
    ring: "ring-slide-primary/50",
    bg: "bg-slide-primary/10",
    title: "Zero bramek wejściowych",
    body: 'Rejestracja bez certyfikatów, bez lat doświadczenia, bez pola "uczelnia". Zakaz dyplomów nie jest w regulaminie — po prostu nie ma takiego pola w formularzu.',
  },
  {
    icon: "=",
    color: "text-slide-violet",
    ring: "ring-slide-violet/50",
    bg: "bg-slide-violet/10",
    title: "Równość ról",
    body: "Talent może nudge'nąć mentora po 7 dniach. Mentor podlega scoringowi tak samo jak talent rankingowi. Nikt nie jest klientem — wszyscy są uczestnikami.",
  },
  {
    icon: "↻",
    color: "text-slide-amber",
    ring: "ring-slide-amber/50",
    bg: "bg-slide-amber/10",
    title: "Samoregulacja",
    body: "Scoring firm, odznaki, rankingi zadań — generowane przez społeczność, nie przez admina. Platforma działa jak ekosystem, nie jak urząd.",
  },
];

const Slide07Philosophy = () => (
  <SlideLayout variant="dark">
    <div className="absolute inset-0 px-32 pt-32 pb-24 flex flex-col">
      <div className="brand-pill text-[24px] self-start">Filozofia</div>

      <h2 className="mt-10 text-[88px] font-extrabold tracking-tight leading-[1.0]">
        Turkusowe przedsiębiorstwo<br />w praktyce
      </h2>

      <div className="mt-12 space-y-6">
        {principles.map((p) => (
          <div
            key={p.title}
            className="flex items-start gap-10 bg-slide-bg-soft ring-1 ring-white/5 rounded-2xl p-8"
          >
            <div className={`shrink-0 w-[110px] h-[110px] rounded-full ${p.bg} ring-2 ${p.ring} flex items-center justify-center text-[56px] font-bold ${p.color} leading-none`}>
              {p.icon}
            </div>
            <div className="pt-2">
              <h3 className="text-[34px] font-bold leading-tight">{p.title}</h3>
              <p className="mt-3 text-[22px] text-slide-fg-muted leading-relaxed max-w-[1500px]">{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-10 rounded-2xl bg-slide-primary/10 ring-1 ring-slide-primary/40 p-6 text-center">
        <p className="text-[26px] italic text-slide-primary">
          Turkus to nie wartości wypisane na ścianie — to architektura produktu, która nie daje wyboru.
        </p>
      </div>
    </div>
  </SlideLayout>
);

export default Slide07Philosophy;
