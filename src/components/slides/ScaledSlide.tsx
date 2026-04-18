import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScaledSlideProps {
  children: ReactNode;
  className?: string;
  /** Background color of the empty letterbox area */
  letterboxColor?: string;
}

/**
 * Renders its children at a fixed 1920x1080 size and uniformly scales
 * the rendering to fit the parent container. Used for editor canvas,
 * thumbnails, fullscreen presenter, etc.
 */
export const ScaledSlide = ({ children, className, letterboxColor }: ScaledSlideProps) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      const next = Math.min(width / 1920, height / 1080);
      setScale(next);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={stageRef}
      className={cn("slide-stage w-full h-full", className)}
      style={{ backgroundColor: letterboxColor }}
    >
      <div className="slide-wrapper" style={{ ["--scale" as string]: scale }}>
        {children}
      </div>
    </div>
  );
};
