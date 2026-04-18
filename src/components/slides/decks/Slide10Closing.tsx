import { SlideLayout } from "../SlideLayout";
import { Logo } from "../Logo";

const Slide10Closing = () => (
  <SlideLayout variant="dark" topBar={false}>
    <div className="absolute left-0 top-0 bottom-0 w-[8px] bg-slide-primary" />
    <div className="absolute right-0 top-0 bottom-0 w-[8px] bg-slide-primary" />

    <div className="absolute inset-0 px-32 py-24 flex flex-col">
      <div className="flex-1 flex items-center">
        <div>
          <h1 className="text-[110px] font-extrabold leading-[1.05] tracking-tight max-w-[1700px]">
            Jeden człowiek z pomysłem powinien mieć taką samą szansę jak każdy inny.
          </h1>
          <p className="mt-12 text-[44px] font-bold text-slide-primary">
            To jest turkus. To jest TalentFlow.
          </p>
        </div>
      </div>

      {/* Pills */}
      <div className="flex justify-center gap-12 mb-12">
        <span className="brand-pill text-[24px]">Talent Scout</span>
        <span className="brand-pill text-[24px]">Battle Tasks</span>
        <span className="brand-pill text-[24px]">Anti-Ghosting Bridge</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="text-[26px] text-slide-fg-muted">
          <span className="font-semibold text-slide-fg">talentflow.app</span>
        </div>
        <Logo size={120} />
        <div className="text-[26px] text-slide-fg-muted">
          Kategoria Open · GovTech Polska
        </div>
      </div>
    </div>
  </SlideLayout>
);

export default Slide10Closing;
