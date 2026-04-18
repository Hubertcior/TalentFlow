import { useRole } from "@/contexts/RoleContext";
import { cn } from "@/lib/utils";
import { Sparkles, Briefcase } from "lucide-react";

/**
 * Pill-shaped switch between Talent and Mentor roles. Lives in the header.
 */
export const RoleSwitcher = () => {
  const { role, setRole } = useRole();
  return (
    <div className="inline-flex p-1 rounded-full bg-surface ring-1 ring-border">
      <button
        onClick={() => setRole("talent")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition",
          role === "talent"
            ? "bg-primary text-primary-foreground shadow-glow"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Sparkles size={14} />
        Talent
      </button>
      <button
        onClick={() => setRole("mentor")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition",
          role === "mentor"
            ? "bg-violet text-foreground shadow-glow"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Briefcase size={14} />
        Mentor
      </button>
    </div>
  );
};
