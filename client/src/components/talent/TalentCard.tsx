import { Talent } from "@/types/domain";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface TalentCardProps {
  talent: Talent;
  expanded?: boolean;
}

const availabilityLabel: Record<Talent["availability"], { label: string; color: string }> = {
  now:  { label: "Dostępny/a teraz", color: "text-primary" },
  soon: { label: "Za 2–4 tygodnie",  color: "text-amber" },
  busy: { label: "Zajęty/a",         color: "text-muted-foreground" },
};

const INTEREST_COLORS = [
  "bg-primary/10 text-primary ring-primary/25",
  "bg-violet/10 text-violet ring-violet/25",
  "bg-amber/10 text-amber ring-amber/25",
  "bg-rose/10 text-rose ring-rose/25",
  "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 ring-cyan-500/25",
];

export const TalentCard = ({ talent, expanded }: TalentCardProps) => {
  const av = availabilityLabel[talent.availability];
  const visibleInterests = expanded ? talent.interests : talent.interests.slice(0, 4);
  const hiddenCount = expanded ? 0 : talent.interests.length - 4;

  return (
    <Card className="elevated p-6 hover:ring-1 hover:ring-primary/40 transition group animate-fade-up">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/15 ring-2 ring-primary/40 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-primary">{talent.initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <Link
            to={`/talents/${talent.id}`}
            className="text-lg font-bold text-foreground hover:text-primary transition truncate block"
          >
            {talent.name}
          </Link>
          <div className="text-sm text-muted-foreground truncate">{talent.role}</div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin size={11} />{talent.city}</span>
            <span className={cn("flex items-center gap-1", av.color)}>
              <Circle size={8} fill="currentColor" />
              {av.label}
            </span>
          </div>
        </div>
        {talent.badges.length > 0 && (
          <Badge className="seal-verified text-foreground border-0 gap-1 shrink-0">
            <Star size={10} fill="currentColor" />
            {talent.badges.length}× Verified
          </Badge>
        )}
      </div>

      {/* Interest tags */}
      {talent.interests.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {visibleInterests.map((interest, idx) => (
            <span
              key={interest}
              className={cn(
                "text-xs rounded-full px-2.5 py-0.5 ring-1",
                INTEREST_COLORS[idx % INTEREST_COLORS.length],
              )}
            >
              {interest}
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="text-xs rounded-full px-2.5 py-0.5 ring-1 ring-border bg-surface text-muted-foreground">
              +{hiddenCount}
            </span>
          )}
        </div>
      )}

      {/* Badges section (expanded only) */}
      {expanded && talent.badges.length > 0 && (
        <div className="mt-5 rounded-lg bg-violet-soft/40 ring-1 ring-violet/40 p-4">
          <div className="flex items-center gap-2 text-violet font-bold text-sm mb-2">
            <Star size={14} fill="currentColor" />
            Verified by Mentor
          </div>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {talent.badges.map((b) => (
              <li key={b.id}>
                <span className="text-foreground">{b.company}</span> · {b.taskTitle} · Top {b.rank} / {b.total}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
