import { Talent } from "@/types/domain";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface TalentCardProps {
  talent: Talent;
  /** Show full skills + badges (used on detail or expanded list) */
  expanded?: boolean;
}

const availabilityLabel: Record<Talent["availability"], { label: string; color: string }> = {
  now:   { label: "Dostępna teraz",      color: "text-primary" },
  soon:  { label: "Za 2–4 tygodnie",     color: "text-amber" },
  busy:  { label: "Zajęta",              color: "text-muted-foreground" },
};

export const TalentCard = ({ talent, expanded }: TalentCardProps) => {
  const av = availabilityLabel[talent.availability];

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

      {/* Skills bars */}
      <div className="mt-5 space-y-2.5">
        {(expanded ? talent.skills : talent.skills.slice(0, 3)).map((s) => (
          <div key={s.name}>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{s.name}</span>
              <span className="font-bold text-foreground tabular-nums">{s.level}/10</span>
            </div>
            <div className="mt-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-brand rounded-full transition-all"
                style={{ width: `${s.level * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>

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
