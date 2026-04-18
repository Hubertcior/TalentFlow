import { SlideLayout } from "../SlideLayout";

const phases = [
  {
    label: "MVP",
    when: "Hackathon",
    color: "text-slide-primary",
    bar: "bg-slide-primary",
    items: [
      "Karta talentu (bez pola uczelnia)",
      "Battle Tasks — lista zadań + submit",
      "Anti-Ghosting — wymagany powód odrzucenia",
      "Scoring firm (podstawowy)",
    ],
  },
  {
    label: "v1.0",
    when: "3 miesiące",
    color: "text-slide-violet",
    bar: "bg-slide-violet",
    items: [
      "Matching AI — mentor ↔ talent",
      "Powiadomienia push i email",
      "Panel mentora z historią decyzji",
      "Aplikacja mobilna (iOS + Android)",
    ],
  },
  {
    label: "v2.0",
    when: "6–12 miesięcy",
    color: "text-slide-amber",
    bar: "bg-slide-amber",
    items: [
      "Integracja z GovTech / ZUS (staże)",
      "Analityka rynku pracy dla MRPiPS",
      "API dla szkół i uczelni",
      "Europejska ekspansja",
    ],
  },
];

const Slide09Roadmap = () => (
  <SlideLayout variant="dark">
    <div className="absolute inset-0 px-32 pt-32 pb-24 flex flex-col">
      <div className="brand-pill text-[24px] self-start">MVP i dalej</div>

      <h2 className="mt-10 text-[88px] font-extrabold tracking-tight leading-[1.05]">
        Co budujemy, co skalujemy.
      </h2>

      <div className="mt-16 grid grid-cols-3 gap-10 flex-1">
        {phases.map((p, i) => (
          <div key={p.label} className="relative bg-slide-bg-soft rounded-3xl p-10 ring-1 ring-white/5">
            <div className={`absolute -top-[6px] left-10 right-10 h-[6px] rounded-full ${p.bar}`} />
            <div className="flex items-baseline gap-4">
              <span className={`text-[56px] font-extrabold ${p.color} leading-none`}>{p.label}</span>
              <span className="text-[22px] text-slide-fg-dim">{p.when}</span>
            </div>
            <div className="mt-2 text-[18px] tracking-widest text-slide-fg-dim uppercase">
              Faza {i + 1}
            </div>
            <ul className="mt-10 space-y-5">
              {p.items.map((it) => (
                <li key={it} className="flex gap-4 text-[24px] text-slide-fg-muted leading-snug">
                  <span className={`${p.color} shrink-0`}>→</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

export default Slide09Roadmap;
