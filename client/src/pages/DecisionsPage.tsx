import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTalentFlow } from "@/store/useTalentFlow";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, X, ArrowRight, ExternalLink, ChevronDown, ChevronUp, Inbox } from "lucide-react";
import { RejectDialog } from "@/components/decisions/RejectDialog";
import { cn } from "@/lib/utils";
import type { BattleTask } from "@/types/domain";

const DecisionsPage = () => {
  const allTalents = useTalentFlow((s) => s.talents);
  const allDecisions = useTalentFlow((s) => s.decisions);
  const allSubmissions = useTalentFlow((s) => s.submissions);
  const allTasks = useTalentFlow((s) => s.tasks);
  const acceptTalent = useTalentFlow((s) => s.acceptTalent);
  const myCompanyId = useTalentFlow((s) => s.companies.find((c) => c.isMe)?.id);

  const myTasks = useMemo(
    () => allTasks.filter((t) => t.companyId === myCompanyId),
    [allTasks, myCompanyId],
  );
  const myDecisions = useMemo(
    () => allDecisions.filter((d) => d.companyId === myCompanyId),
    [allDecisions, myCompanyId],
  );

  const [rejectFor, setRejectFor] = useState<{ id: string; name: string; taskId?: string } | null>(null);
  const [collapsedTasks, setCollapsedTasks] = useState<Set<string>>(new Set());

  const toggleTask = (taskId: string) => {
    setCollapsedTasks((prev) => {
      const next = new Set(prev);
      next.has(taskId) ? next.delete(taskId) : next.add(taskId);
      return next;
    });
  };

  const getDecision = (talentId: string, taskId: string) =>
    myDecisions.find((d) => d.talentId === talentId && d.taskId === taskId);

  const totalPending = myTasks.reduce((sum, task) => {
    const subs = allSubmissions.filter((s) => s.taskId === task.id);
    return sum + subs.filter((s) => !getDecision(s.talentId, task.id)).length;
  }, 0);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Anti-Ghosting Bridge"
        title="Zarządzanie Zgłoszeniami"
        description="Zgłoszenia do Twoich zadań. Każde odrzucenie wymaga konstruktywnej wskazówki — bez niej przycisk jest zablokowany."
        actions={
          totalPending > 0 ? (
            <Badge className="bg-amber/15 text-amber border-amber/40 border">
              {totalPending} oczekujących
            </Badge>
          ) : undefined
        }
      />

      {/* Tasks with submissions */}
      {myTasks.length === 0 && (
        <Card className="elevated p-12 text-center text-muted-foreground">
          <Inbox size={36} className="mx-auto mb-3" />
          Nie masz jeszcze żadnych Battle Tasks.
        </Card>
      )}

      <div className="space-y-6 mb-10">
        {myTasks.map((task) => {
          const taskSubs = allSubmissions.filter((s) => s.taskId === task.id);
          const collapsed = collapsedTasks.has(task.id);
          const pendingCount = taskSubs.filter((s) => !getDecision(s.talentId)).length;

          return (
            <div key={task.id}>
              {/* Task header */}
              <button
                onClick={() => toggleTask(task.id)}
                className="w-full flex items-center gap-3 mb-3 group text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold group-hover:text-primary transition truncate">
                      {task.title}
                    </h2>
                    <TaskStatusBadge task={task} />
                    <span className="text-xs text-muted-foreground">
                      {taskSubs.length} {taskSubs.length === 1 ? "zgłoszenie" : "zgłoszeń"}
                    </span>
                    {pendingCount > 0 && (
                      <Badge className="bg-amber/15 text-amber border-amber/40 border text-[10px] px-1.5 py-0">
                        {pendingCount} do decyzji
                      </Badge>
                    )}
                  </div>
                </div>
                {collapsed ? (
                  <ChevronDown size={16} className="text-muted-foreground shrink-0" />
                ) : (
                  <ChevronUp size={16} className="text-muted-foreground shrink-0" />
                )}
              </button>

              {!collapsed && (
                <div className="space-y-3">
                  {taskSubs.length === 0 && (
                    <Card className="elevated p-5 text-center text-sm text-muted-foreground">
                      Brak zgłoszeń do tego zadania.
                    </Card>
                  )}

                  {taskSubs.map((sub) => {
                    const talent = allTalents.find((t) => t.id === sub.talentId);
                    if (!talent) return null;
                    const decision = getDecision(talent.id, task.id);

                    return (
                      <Card
                        key={sub.id}
                        className={cn(
                          "elevated p-5",
                          decision?.outcome === "accepted" && "ring-1 ring-primary/40 bg-primary/5",
                          decision?.outcome === "rejected" && "ring-1 ring-amber/30 opacity-75",
                        )}
                      >
                        <div className="flex items-start gap-4">
                          {/* Talent avatar */}
                          <div className="w-10 h-10 rounded-full bg-primary/15 ring-1 ring-primary/40 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                            {talent.initials}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <div>
                                <Link
                                  to={`/talents/${talent.id}`}
                                  className="font-bold hover:text-primary transition"
                                >
                                  {talent.name}
                                </Link>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {talent.role} · {talent.city}
                                </div>
                              </div>

                              {/* Decision status or action buttons */}
                              {decision ? (
                                <Badge
                                  variant="outline"
                                  className={
                                    decision.outcome === "accepted"
                                      ? "bg-primary/15 text-primary border-primary/40"
                                      : "bg-amber/15 text-amber border-amber/40"
                                  }
                                >
                                  {decision.outcome === "accepted" ? "Zaakceptowany" : "Odrzucony"}
                                </Badge>
                              ) : (
                                <div className="flex gap-2 shrink-0">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setRejectFor({ id: talent.id, name: talent.name, taskId: task.id })
                                    }
                                    className="gap-1"
                                  >
                                    <X size={13} /> Odrzuć
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      acceptTalent(talent.id, myCompanyId ?? "", task.id).catch((err) =>
                                        toast.error("Błąd: " + (err instanceof Error ? err.message : String(err)))
                                      )
                                    }
                                    className="gap-1"
                                  >
                                    Zaproś <ArrowRight size={13} />
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* Submission content */}
                            <div className="mt-3 rounded-lg bg-surface ring-1 ring-border p-3">
                              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                                Rozwiązanie · {new Date(sub.submittedAt).toLocaleDateString("pl-PL")}
                              </div>
                              <p className="text-sm leading-relaxed">{sub.summary}</p>
                              {sub.link && (
                                <a
                                  href={sub.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                                >
                                  {sub.link} <ExternalLink size={10} />
                                </a>
                              )}
                            </div>

                            {/* Rejection tip shown if rejected */}
                            {decision?.outcome === "rejected" && decision.tip && (
                              <div className="mt-2 text-xs text-muted-foreground italic">
                                <ShieldCheck size={11} className="inline mr-1 text-amber" />
                                Wskazówka: "{decision.tip}"
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Decision history */}
      {myDecisions.length > 0 && (
        <>
          <h2 className="text-lg font-bold mb-3">Historia decyzji</h2>
          <div className="space-y-2">
            {[...myDecisions]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((d) => {
                const t = allTalents.find((x) => x.id === d.talentId);
                if (!t) return null;
                const isReject = d.outcome === "rejected";
                return (
                  <Card key={d.id} className="elevated p-4 flex items-start gap-4">
                    <ShieldCheck
                      size={18}
                      className={isReject ? "text-amber mt-0.5 shrink-0" : "text-primary mt-0.5 shrink-0"}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          to={`/talents/${t.id}`}
                          className="font-bold hover:text-primary transition"
                        >
                          {t.name}
                        </Link>
                        <Badge
                          variant="outline"
                          className={
                            isReject
                              ? "bg-amber/15 text-amber border-amber/40"
                              : "bg-primary/15 text-primary border-primary/40"
                          }
                        >
                          {isReject ? "Odrzucony" : "Zaakceptowany"}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(d.createdAt).toLocaleDateString("pl-PL")}
                        </span>
                      </div>
                      {d.tip && (
                        <p className="text-sm text-muted-foreground mt-1 italic">"{d.tip}"</p>
                      )}
                    </div>
                  </Card>
                );
              })}
          </div>
        </>
      )}

      <RejectDialog
        open={!!rejectFor}
        onOpenChange={(o) => !o && setRejectFor(null)}
        talentId={rejectFor?.id ?? ""}
        talentName={rejectFor?.name ?? ""}
        taskId={rejectFor?.taskId}
      />
    </div>
  );
};

const TaskStatusBadge = ({ task }: { task: BattleTask }) => (
  <Badge
    variant="outline"
    className={cn(
      "text-[10px] px-1.5 py-0",
      task.status === "open" && "bg-primary/10 text-primary border-primary/30",
      task.status === "judging" && "bg-amber/10 text-amber border-amber/30",
      task.status === "closed" && "bg-muted text-muted-foreground border-border",
    )}
  >
    {task.status === "open" ? "Otwarte" : task.status === "judging" ? "Ocenianie" : "Zamknięte"}
  </Badge>
);

export default DecisionsPage;
