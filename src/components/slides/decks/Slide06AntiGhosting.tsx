import { SlideLayout } from "../SlideLayout";
import { ArrowRight } from "lucide-react";

const flow = [
  "Mentor zamyka aplikację",
  "System blokuje przycisk",
  "Wybiera 1 z 3 porad",
  "Kandydat dostaje feedback",
];

const tips = [
  "Popracuj nad komunikacją",
  "Podszkol framework X",
  "Brak dopasowania do zespołu",
];

const Slide06AntiGhosting = () => (
  <SlideLayout variant="dark">
    <div className="absolute inset-0 px-32 pt-32 pb-24 flex flex-col">
      <div className="brand-pill text-[24px] self-start" style={{ borderColor: "hsl(var(--slide-amber) / 0.7)", color: "hsl(var(--slide-amber))" }}>
        Anti-Ghosting Bridge
      </div>

      <h2 className="mt-10 text-[88px] font-extrabold tracking-tight leading-[1.05]">
        Koniec czarnych dziur w rekrutacji.
      </h2>

      {/* Big stat */}
      <div className="mt-12 flex items-end gap-10">
        <div className="text-[200px] font-extrabold text-slide-amber leading-none">80%</div>
        <p className="text-[32px] text-slide-fg-muted pb-6 max-w-[1100px]">
          kandydatów nigdy nie dostaje odpowiedzi po rozmowie
        </p>
      </div>

      {/* Flow chain */}
      <div className="mt-14 flex items-stretch gap-4">
        {flow.map((step, i) => (
          <div key={step} className="flex items-center gap-4 flex-1">
            <div className="flex-1 rounded-2xl bg-slide-bg-soft ring-1 ring-white/10 p-8 text-center">
              <div className="text-[18px] text-slide-amber font-bold tracking-widest mb-3">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="text-[24px] font-semibold leading-tight">{step}</div>
            </div>
            {i < flow.length - 1 && (
              <ArrowRight size={36} className="text-slide-amber shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-12">
        <h3 className="text-[28px] font-bold text-slide-fg-muted mb-6">
          3 gotowe wskazówki do wyboru:
        </h3>
        <div className="flex gap-6">
          {tips.map((t) => (
            <div
              key={t}
              className="flex-1 rounded-2xl bg-slide-amber/10 ring-1 ring-slide-amber/40 p-6 text-center text-[24px] text-slide-fg italic"
            >
              "{t}"
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-12 text-[22px] text-slide-primary text-center">
        Scoring firmy: % z feedbackiem + czas odpowiedzi + ocena przydatności →{" "}
        <span className="font-semibold">"Top Employer for Gen Z"</span> co miesiąc.
      </div>
    </div>
  </SlideLayout>
);

export default Slide06AntiGhosting;
