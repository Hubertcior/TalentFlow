import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
}


export const Logo = ({ size = 200, className }: LogoProps) => {
  const dots = [
    { cx: 65, cy: 28, r: 5 },
    { cx: 80, cy: 50, r: 5.5 },
    { cx: 70, cy: 72, r: 5 },
    { cx: 45, cy: 78, r: 5.5 },
    { cx: 28, cy: 65, r: 4.5 },
    { cx: 30, cy: 40, r: 5 },
    { cx: 50, cy: 50, r: 5.5 },
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn("dot-orbit", className)}
      aria-label="TalentFlow logo"
    >
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="hsl(var(--slide-primary) / 0.4)"
        strokeWidth="1"
      />
      {dots.map((d, i) => (
        <span key={i} style={{ display: "contents" }}>
          <circle
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill="hsl(var(--slide-primary))"
            style={{ animationDelay: `${i * 0.15}s`, transformOrigin: `${d.cx}px ${d.cy}px` }}
          />
        </span>
      ))}
    </svg>
  );
};
