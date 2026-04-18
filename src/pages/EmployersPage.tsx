import { useTalentFlow, selectCompanyScores } from "@/store/useTalentFlow";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, MessageSquare, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const EmployersPage = () => {
  const scores = useTalentFlow(selectCompanyScores);
  const ranked = scores.filter((s) => s.totalDecisions > 0);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Scoring firm"
        title="Ranking pracodawców"
        description="Algorytm: % aplikacji z konstruktywnym feedbackiem (50%) + ocena przydatności (30%) + szybkość odpowiedzi (20%). Top firma miesiąca dostaje plakietkę."
      />

      <div className="space-y-3">
        {ranked.map((s, idx) => (
          <Card
            key={s.companyId}
            className={cn(
              "elevated p-5 flex items-center gap-5 animate-fade-up transition",
              s.isTopEmployer && "ring-1 ring-primary/50 bg-primary/5"
            )}
          >
            {/* Rank */}
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg shrink-0",
              idx === 0 ? "bg-gradient-brand text-primary-foreground shadow-glow" :
              idx === 1 ? "bg-violet/20 text-violet ring-1 ring-violet/40" :
              idx === 2 ? "bg-amber/20 text-amber ring-1 ring-amber/40" :
              "bg-surface text-muted-foreground ring-1 ring-border"
            )}>
              {idx + 1}
            </div>

            {/* Identity */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold truncate">{s.companyName}</h3>
                {s.isTopEmployer && (
                  <Badge className="bg-gradient-brand text-primary-foreground border-0 gap-1 whitespace-nowrap">
                    <Trophy size={10} /> Top Employer for Gen Z
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {s.mentorName} · {s.totalDecisions} {s.totalDecisions === 1 ? "decyzja" : "decyzji"}
              </div>
            </div>

            {/* Metrics */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Metric icon={<MessageSquare size={14} />} label="Feedback" value={`${Math.round(s.feedbackRate * 100)}%`} />
              <Metric icon={<Clock size={14} />} label="Czas odp." value={`~${Math.round(s.avgResponseHours)}h`} />
              <Metric icon={<Star size={14} />} label="Ocena" value={s.avgUsefulness > 0 ? `${s.avgUsefulness.toFixed(1)}/5` : "—"} />
            </div>

            {/* Score */}
            <div className="text-right shrink-0">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Score</div>
              <div className={cn(
                "text-2xl font-extrabold tabular-nums",
                s.isTopEmployer ? "text-primary" : "text-foreground"
              )}>
                {s.score}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {ranked.length === 0 && (
        <Card className="elevated p-12 text-center text-muted-foreground">
          Brak danych — żadna firma nie podjęła jeszcze decyzji.
        </Card>
      )}
    </div>
  );
};

const Metric = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="text-center">
    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
      {icon} {label}
    </div>
    <div className="font-bold tabular-nums">{value}</div>
  </div>
);

export default EmployersPage;
