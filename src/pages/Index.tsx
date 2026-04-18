import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, Maximize2, X } from "lucide-react";
import { ScaledSlide } from "@/components/slides/ScaledSlide";
import { SLIDES } from "@/components/slides/decks";
import { Logo } from "@/components/slides/Logo";
import { cn } from "@/lib/utils";

const Index = () => {
  const [current, setCurrent] = useState(0);
  const [gridOpen, setGridOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = SLIDES.length;
  const goTo = useCallback((i: number) => setCurrent(Math.max(0, Math.min(total - 1, i))), [total]);
  const next = useCallback(() => setCurrent((c) => Math.min(total - 1, c + 1)), [total]);
  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        next();
        setGridOpen(false);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
        setGridOpen(false);
      } else if (e.key === "g" || e.key === "G") {
        setGridOpen((g) => !g);
      } else if (e.key === "f" || e.key === "F" || e.key === "F5") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "Escape") {
        if (gridOpen) setGridOpen(false);
      } else if (e.key === "Home") {
        goTo(0);
      } else if (e.key === "End") {
        goTo(total - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo, gridOpen, total]);

  // Track fullscreen state
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const Active = SLIDES[current].Component;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slide-bg flex flex-col overflow-hidden"
    >
      {/* Top bar — hidden in fullscreen */}
      {!isFullscreen && (
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slide-bg/95 backdrop-blur">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div>
              <div className="text-slide-fg font-bold tracking-tight">TalentFlow</div>
              <div className="text-xs text-slide-fg-dim">Pitch deck · GovTech Polska 2025</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setGridOpen((g) => !g)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slide-fg-muted hover:text-slide-fg hover:bg-white/5 transition"
              aria-label="Toggle slide grid"
            >
              <LayoutGrid size={18} />
              <span className="hidden md:inline">Wszystkie slajdy</span>
              <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-white/10 ml-1">G</kbd>
            </button>
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slide-fg-muted hover:text-slide-fg hover:bg-white/5 transition"
              aria-label="Present fullscreen"
            >
              <Maximize2 size={18} />
              <span className="hidden md:inline">Prezentuj</span>
              <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-white/10 ml-1">F</kbd>
            </button>
          </div>
        </header>
      )}

      {/* Stage */}
      <main className="flex-1 relative flex items-center justify-center p-4">
        <div
          className={cn(
            "w-full h-full max-w-[1600px] aspect-video rounded-xl overflow-hidden ring-1 ring-white/10 shadow-2xl",
            isFullscreen && "max-w-none aspect-auto rounded-none ring-0 shadow-none"
          )}
        >
          <ScaledSlide letterboxColor="hsl(var(--slide-bg))" key={current}>
            <Active />
          </ScaledSlide>
        </div>

        {/* Floating nav controls */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-slide-fg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label="Previous slide"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={next}
          disabled={current === total - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-slide-fg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label="Next slide"
        >
          <ChevronRight size={22} />
        </button>

        {/* Slide counter */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-slide-fg text-sm font-medium tabular-nums">
          {current + 1} / {total}
        </div>
      </main>

      {/* Grid overlay */}
      {gridOpen && (
        <div className="fixed inset-0 z-50 bg-slide-bg/95 backdrop-blur overflow-y-auto">
          <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slide-bg/95 z-10">
            <h2 className="text-slide-fg font-bold text-lg">Wszystkie slajdy</h2>
            <button
              onClick={() => setGridOpen(false)}
              className="w-9 h-9 rounded-full hover:bg-white/10 text-slide-fg flex items-center justify-center"
              aria-label="Close grid"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SLIDES.map((s, i) => {
              const C = s.Component;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    goTo(i);
                    setGridOpen(false);
                  }}
                  className={cn(
                    "group text-left rounded-lg overflow-hidden ring-1 transition shadow-lg",
                    i === current
                      ? "ring-slide-primary"
                      : "ring-white/10 hover:ring-slide-primary/60"
                  )}
                >
                  <div className="aspect-video bg-slide-bg">
                    <ScaledSlide letterboxColor="hsl(var(--slide-bg))">
                      <C />
                    </ScaledSlide>
                  </div>
                  <div className="px-3 py-2 flex items-center justify-between bg-slide-bg-soft">
                    <span className="text-slide-fg text-sm font-medium truncate">
                      {s.title}
                    </span>
                    <span className="text-slide-fg-dim text-xs tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
