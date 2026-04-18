import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SlideLayoutProps {
  children: ReactNode;
  variant?: "dark" | "light";
  /** Show the thin top brand bar */
  topBar?: boolean;
  className?: string;
}

/**
 * Authoring container for a single slide. Renders inside the
 * 1920x1080 stage so all child layout works in real pixels.
 */
export const SlideLayout = ({
  children,
  variant = "dark",
  topBar = true,
  className,
}: SlideLayoutProps) => {
  const isDark = variant === "dark";
  return (
    <div
      className={cn(
        "slide-content slide-fade relative",
        isDark ? "bg-slide-bg text-slide-fg" : "bg-slide-bg-light text-slide-fg-light",
        className
      )}
    >
      {topBar && (
        <div className="absolute top-0 left-0 right-0 h-[10px] bg-slide-primary" />
      )}
      {children}
    </div>
  );
};
