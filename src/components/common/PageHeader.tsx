import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({ eyebrow, title, description, actions, className }: PageHeaderProps) => (
  <div className={cn("flex items-start justify-between gap-6 mb-8", className)}>
    <div className="min-w-0">
      {eyebrow && (
        <div className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-2">
          {eyebrow}
        </div>
      )}
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-muted-foreground max-w-2xl">{description}</p>
      )}
    </div>
    {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
  </div>
);
