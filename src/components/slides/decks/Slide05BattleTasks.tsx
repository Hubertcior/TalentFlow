import { SlideLayout } from "../SlideLayout";
import { Check } from "lucide-react";

const ranking = [
  { n: 1, title: "Otwarte zadanie", body: "Każdy może wziąć udział. Zero bramek, zero CV." },
  { n: 2, title: "Publiczne rozwiązania", body: "Rozwiązania widoczne dla społeczności (opcjonalnie)." },
  { n: 3, title: "Top 3 wybiera mentor", body: "Odznaka Verified by Mentor na karcie talentu." },
];

const Slide05BattleTasks = () => (
  <SlideLayout variant="dark">
    <div className="absolute inset-0 px-32 pt-32 pb-24 flex flex-col">
      <div className="brand-pill text-[24px] self-start" style={{ borderColor: "hsl(var(--slide-violet) / 0.7)", color: "hsl(var(--slide-violet))" }}>
        Battle Tasks
      </div>

      <h2 className="mt-10 text-[96px] font-extrabold tracking-tight leading-[1.0]">
        Rywalizacja o uwagę mentora
      </h2>
      <p className="mt-6 text-[30px] text-slide-fg-muted max-w-[1500px]">
        Nie masz certyfikatu? Nie ma sprawy. Weź zadanie i pokaż co potrafisz. Jedynym filtrem jest jakość pracy.
      </p>

      <div className="mt-14 grid grid-cols-2 gap-16 flex-1">
        {/* Task card */}
        <div className="rounded-3xl bg-slide-bg-soft ring-1 ring-white/10 p-12 flex flex-col">
          <div className="text-[18px] tracking-[0.25em] text-slide-violet font-semibold uppercase">
            Live Task · 7 dni
          </div>
          <h3 className="mt-6 text-[44px] font-bold leading-tight">
            Przeprojektuj ekran onboardingu dla aplikacji fintech
          </h3>
          <p className="mt-6 text-[24px] text-slide-fg-muted leading-relaxed">
            Obecny onboarding ma <span className="text-slide-amber font-semibold">40% porzuceń</span> na kroku 3.
            Przeprojektuj go dla mobile.
          </p>

          <div className="mt-8 flex items-center gap-4 text-[24px]">
            <div className="w-[40px] h-[40px] rounded-full bg-slide-primary/20 ring-1 ring-slide-primary/60 flex items-center justify-center">
              <Check size={22} className="text-slide-primary" strokeWidth={3} />
            </div>
            <span className="text-slide-primary">Otwarte dla wszystkich — zero wymagań wstępnych</span>
          </div>

          <div className="mt-auto pt-10 grid grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white/5 p-6">
              <div className="text-[22px] text-slide-fg-muted">Zgłoszenia</div>
              <div className="text-[56px] font-extrabold text-slide-fg leading-none mt-2">48</div>
            </div>
            <div className="rounded-2xl bg-white/5 p-6">
              <div className="text-[22px] text-slide-fg-muted">Top 3 nagradzane</div>
              <div className="text-[28px] font-bold text-slide-violet leading-tight mt-2">
                Verified by Mentor
              </div>
            </div>
          </div>
        </div>

        {/* Ranking steps */}
        <div>
          <h3 className="text-[36px] font-bold mb-8">Jak działa ranking?</h3>
          <div className="space-y-8">
            {ranking.map((r) => (
              <div key={r.n} className="flex gap-8 items-start bg-slide-bg-soft ring-1 ring-white/10 rounded-2xl p-8">
                <div className="text-[64px] font-extrabold text-slide-violet leading-none">{r.n}</div>
                <div className="pt-2">
                  <h4 className="text-[30px] font-bold leading-tight">{r.title}</h4>
                  <p className="mt-2 text-[22px] text-slide-fg-muted leading-relaxed">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </SlideLayout>
);

export default Slide05BattleTasks;
