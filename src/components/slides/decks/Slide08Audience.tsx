import { SlideLayout } from "../SlideLayout";
import { Sparkles, Briefcase } from "lucide-react";

const talents = [
  "Wiek 15–25 lat — między dzieciństwem a dorosłością",
  "Kreatywni bez potwierdzenia — selfmade developers, designerzy, twórcy",
  "Presja przyszłości i brak pewności co dalej",
  "Szukają nie tylko pracy, ale i sensu i mentorstwa",
];

const mentors = [
  "Startupy i scale-upy szukające niestandardowych talentów",
  "Firmy zmęczone setkami bezużytecznych CV",
  "HR-y które chcą dotrzeć do Gen Z autentycznie",
  "Mentorzy chcący realnego wpływu — nie tylko employer brandingu",
];

const Slide08Audience = () => (
  <SlideLayout variant="dark">
    <div className="absolute inset-0 px-32 pt-32 pb-24 flex flex-col">
      <div className="brand-pill text-[24px] self-start">Grupa celowa</div>

      <h2 className="mt-10 text-[100px] font-extrabold tracking-tight leading-none">
        Dla kogo?
      </h2>

      <div className="mt-16 grid grid-cols-2 gap-12 flex-1">
        {/* Talents */}
        <div className="rounded-3xl bg-slide-bg-soft ring-1 ring-slide-primary/30 p-12 flex flex-col">
          <div className="flex items-center gap-6">
            <div className="w-[90px] h-[90px] rounded-full bg-slide-primary/15 ring-2 ring-slide-primary/50 flex items-center justify-center">
              <Sparkles size={44} className="text-slide-primary" />
            </div>
            <h3 className="text-[52px] font-bold">Talenty</h3>
          </div>
          <ul className="mt-10 space-y-5">
            {talents.map((t) => (
              <li key={t} className="flex gap-4 text-[24px] text-slide-fg-muted leading-snug">
                <span className="text-slide-primary mt-2 shrink-0">●</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <blockquote className="mt-auto pt-10 text-[24px] italic text-slide-primary border-l-4 border-slide-primary/60 pl-6">
            "Skoro nic nie mam na papierze, to skąd wiedzą że umiem?"
          </blockquote>
        </div>

        {/* Mentors */}
        <div className="rounded-3xl bg-slide-bg-soft ring-1 ring-slide-violet/30 p-12 flex flex-col">
          <div className="flex items-center gap-6">
            <div className="w-[90px] h-[90px] rounded-full bg-slide-violet/15 ring-2 ring-slide-violet/50 flex items-center justify-center">
              <Briefcase size={44} className="text-slide-violet" />
            </div>
            <h3 className="text-[52px] font-bold">Mentorzy / Firmy</h3>
          </div>
          <ul className="mt-10 space-y-5">
            {mentors.map((t) => (
              <li key={t} className="flex gap-4 text-[24px] text-slide-fg-muted leading-snug">
                <span className="text-slide-violet mt-2 shrink-0">●</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </SlideLayout>
);

export default Slide08Audience;
