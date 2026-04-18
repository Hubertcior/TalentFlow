import { SlideLayout } from "../SlideLayout";
import { Logo } from "../Logo";

const Slide01Cover = () => (
  <SlideLayout variant="dark" topBar={false}>
    {/* Left brand bar */}
    <div className="absolute left-0 top-0 bottom-0 w-[8px] bg-slide-primary" />

    <div className="absolute inset-0 px-32 py-24 flex flex-col">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="brand-pill text-[28px]">Kategoria Open · GovTech Polska</div>
        <Logo size={300} />
      </div>

      {/* Wordmark */}
      <div className="mt-32">
        <h1 className="brand-wordmark text-[280px] text-slide-fg">
          talen<span className="text-slide-primary">f</span>
          <span className="text-slide-primary">low</span>
        </h1>
      </div>

      {/* Tagline */}
      <div className="mt-20 space-y-6">
        <p className="text-[44px] text-slide-fg-muted leading-tight">
          Koniec z dyplomami. Koniec z ghostingiem.
        </p>
        <p className="text-[44px] text-slide-fg-muted leading-tight">
          Liczy się tylko to, co potrafisz zrobić.
        </p>
      </div>

      {/* Bottom row of pills */}
      <div className="mt-auto flex items-center justify-between gap-12">
        <div className="flex gap-12">
          <span className="brand-pill text-[24px]">Talent Scout</span>
          <span className="brand-pill text-[24px]">Battle Tasks</span>
          <span className="brand-pill text-[24px]">Anti-Ghosting Bridge</span>
        </div>
        <div className="text-slide-fg-dim text-[22px] tracking-[0.3em]">
          HACKATHON 2025
        </div>
      </div>
    </div>
  </SlideLayout>
);

export default Slide01Cover;
