import { SlideLayout } from "../SlideLayout";
import { Star } from "lucide-react";

const skills = [
  { name: "Figma / UI design", value: 9 },
  { name: "React", value: 7 },
  { name: "CSS animacje", value: 8 },
];

const steps = [
  { n: 1, title: "Mentor filtruje talenty", body: "po umiejętnościach i dostępności — bez CV" },
  { n: 2, title: "Quick invite", body: '"Zapraszam na 15 min" — jedno kliknięcie' },
  { n: 3, title: "Spotkanie i decyzja", body: "Polecenie → odznaka na karcie talentu" },
];

const Slide04TalentScout = () => (
  <SlideLayout variant="light">
    <div className="absolute inset-0 px-32 pt-32 pb-24 flex flex-col">
      <div className="brand-pill text-[24px] self-start" style={{ borderColor: "hsl(var(--slide-primary-soft))" }}>
        Talent Scout
      </div>

      <h2 className="mt-10 text-[100px] font-extrabold tracking-tight text-slide-fg-light leading-none">
        Odwrócona rekrutacja
      </h2>
      <p className="mt-6 text-[34px] text-slide-fg-light-muted">
        Mentor przychodzi do talentu — nie odwrotnie.
      </p>

      <div className="mt-16 grid grid-cols-2 gap-20 flex-1">
        {/* Talent card */}
        <div className="rounded-3xl bg-white p-12 ring-1 ring-slate-200 shadow-sm">
          <div className="flex items-center gap-8">
            <div className="w-[120px] h-[120px] rounded-full bg-slide-primary/15 ring-2 ring-slide-primary/40 flex items-center justify-center">
              <span className="text-[40px] font-bold text-slide-primary-soft">KW</span>
            </div>
            <div>
              <div className="text-[36px] font-bold text-slide-fg-light">Kasia Wojciechowska</div>
              <div className="text-[24px] text-slide-fg-light-muted mt-1">UI/UX + Frontend</div>
            </div>
          </div>

          <div className="mt-10 space-y-6">
            {skills.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-[22px]">
                  <span className="text-slide-fg-light-muted">{s.name}</span>
                  <span className="font-bold text-slide-fg-light">{s.value}/10</span>
                </div>
                <div className="mt-2 h-[10px] bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slide-primary-soft rounded-full"
                    style={{ width: `${s.value * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-slide-violet/10 ring-1 ring-slide-violet/40 p-8">
            <div className="flex items-center gap-3 text-slide-violet">
              <Star size={28} fill="currentColor" />
              <span className="text-[26px] font-bold">Verified by Mentor</span>
            </div>
            <div className="mt-4 text-[20px] text-slide-fg-light-muted space-y-2">
              <div>Netguru · Top 1 / 48 rozwiązań · marzec 2025</div>
              <div>Base CRM · Top 2 / 31 rozwiązań · styczeń 2025</div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="absolute left-[42px] top-[60px] bottom-[60px] w-[2px] bg-slide-primary/40" />
          <div className="space-y-14">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-8 items-start">
                <div className="relative z-10 w-[84px] h-[84px] rounded-full bg-white ring-2 ring-slide-primary/60 flex items-center justify-center text-[32px] font-bold text-slide-primary-soft">
                  {s.n}
                </div>
                <div className="pt-3">
                  <h3 className="text-[36px] font-bold text-slide-fg-light leading-tight">{s.title}</h3>
                  <p className="mt-3 text-[24px] text-slide-fg-light-muted">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </SlideLayout>
);

export default Slide04TalentScout;
