import { SlideLayout } from "../SlideLayout";
import { X, HelpCircle, ArrowDown } from "lucide-react";

const Slide02Problem = () => (
  <SlideLayout variant="dark">
    <div className="absolute inset-0 px-32 pt-32 pb-24 flex flex-col">
      <div className="brand-pill text-[24px] self-start">Problem</div>

      <h2 className="mt-12 text-[88px] font-extrabold leading-[1.05] tracking-tight max-w-[1500px]">
        Młodzi ludzie mają talent.<br />
        <span className="text-slide-fg-muted">System ich nie widzi.</span>
      </h2>

      {/* Three problem cards */}
      <div className="mt-20 grid grid-cols-3 gap-10">
        {[
          {
            icon: <X size={56} strokeWidth={3} className="text-slide-rose" />,
            ring: "ring-slide-rose/40",
            title: "CV-first",
            body: "Kreatywni bez dyplomu odpadają na pierwszym filtrze ATS — zanim ktoś ich zobaczy.",
          },
          {
            icon: <HelpCircle size={56} strokeWidth={2.5} className="text-slide-amber" />,
            ring: "ring-slide-amber/40",
            title: "Czarna skrzynka",
            body: "80% kandydatów nigdy nie dostaje odpowiedzi. Ghosting to norma, nie wyjątek.",
          },
          {
            icon: <ArrowDown size={56} strokeWidth={3} className="text-slide-violet" />,
            ring: "ring-slide-violet/40",
            title: "Brak dowodów",
            body: '"Mam umiejętności" brzmi tak samo niezależnie czy to prawda czy nie.',
          },
        ].map((c) => (
          <div
            key={c.title}
            className="bg-slide-bg-soft rounded-3xl p-10 ring-1 ring-white/5"
          >
            <div className={`w-[110px] h-[110px] rounded-full bg-white/5 ring-2 ${c.ring} flex items-center justify-center`}>
              {c.icon}
            </div>
            <h3 className="mt-8 text-[40px] font-bold">{c.title}</h3>
            <p className="mt-4 text-[24px] text-slide-fg-muted leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>

      {/* Footer stat */}
      <div className="mt-auto pt-16 text-[24px] text-slide-primary">
        Polska: <span className="font-semibold">400 000+</span> absolwentów rocznie ·{" "}
        <span className="font-semibold">60%</span> odczuwa niedopasowanie oczekiwań rynku pracy do systemu edukacji
        <span className="text-slide-fg-dim"> (GUS 2024)</span>
      </div>
    </div>
  </SlideLayout>
);

export default Slide02Problem;
