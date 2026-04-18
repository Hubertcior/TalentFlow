import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BattleTask } from "@/types/domain";
import { Clock, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useTalentFlow } from "@/store/useTalentFlow";

interface TaskCardProps {
  task: BattleTask;
  submissionCount: number;
}

const statusConfig: Record<BattleTask["status"], { label: string; className: string }> = {
  open:    { label: "Otwarte",     className: "bg-primary/15 text-primary border-primary/40" },
  judging: { label: "Ocenianie",   className: "bg-amber/15 text-amber border-amber/40" },
  closed:  { label: "Zamknięte",   className: "bg-muted text-muted-foreground border-border" },
};

const formatDueAt = (iso: string) => {
  const ms = new Date(iso).getTime() - Date.now();
  const d = Math.round(ms / 86400000);
  if (d < 0) return "po terminie";
  if (d === 0) return "kończy się dziś";
  if (d === 1) return "1 dzień";
  return `${d} dni`;
};

export const TaskCard = ({ task, submissionCount }: TaskCardProps) => {
  const company = useTalentFlow((s) => s.companies.find((c) => c.id === task.companyId));
  const cfg = statusConfig[task.status];

  return (
    <Link to={`/tasks/${task.id}`} className="block group animate-fade-up">
      <Card className="elevated p-6 hover:ring-1 hover:ring-primary/50 transition h-full">
        <div className="flex items-start justify-between gap-4 mb-3">
          <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock size={11} /> {formatDueAt(task.dueAt)}
          </div>
        </div>

        <h3 className="text-lg font-bold leading-tight text-foreground group-hover:text-primary transition">
          {task.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{task.brief}</p>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {company?.name}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users size={12} /> {submissionCount}
            </span>
            <span className="flex items-center gap-1 text-violet font-semibold">
              <Trophy size={12} /> {task.reward.includes("Verified") ? "Verified" : "Reward"}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
