import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTalentFlow, selectCompanyScores } from "@/store/useTalentFlow";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Swords, ShieldCheck, Trophy } from "lucide-react";
import { TalentCard } from "@/components/talent/TalentCard";

/** Mentor's home: pipeline metrics, talent picks, tasks awaiting judgement. */
export const MentorDashboard = () => {
  const allTalents = useTalentFlow((s) => s.talents);
  const tasks = useTalentFlow((s) => s.tasks);
  const submissions = useTalentFlow((s) => s.submissions);
  const decisions = useTalentFlow((s) => s.decisions);
  const scores = useTalentFlow(selectCompanyScores);
  const myCompanyId = useTalentFlow((s) => s.companies.find((c) => c.isMe)?.id);

  const talents = useMemo(() => allTalents.filter((t) => !t.isMe), [allTalents]);
  const myCompanyScore = scores.find((s) => s.companyId === myCompanyId);
  const myDecisions = decisions.filter((d) => d.companyId === myCompanyId);
  const myTasks = tasks.filter((t) => t.companyId === myCompanyId);
  const judging = myTasks.find((t) => t.status === "judging") ?? myTasks.find((t) => t.status === "open");

  const topPicks = useMemo(
    () => [...talents].sort((a, b) => b.badges.length - a.badges.length).slice(0, 3),
    [talents],
  );

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Mentor · Twoja firma"
        title="Pulpit rekrutacyjny"
        description="Filtruj talenty po tym co potrafią, zlecaj Battle Tasks i dawaj feedback który ma znaczenie."
      />

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="elevated p-5">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Talenty w bazie</div>
          <div className="mt-2 flex items-baseline gap-2">
            <Users size={20} className="text-primary" />
            <span className="text-3xl font-extrabold">{talents.length}</span>
          </div>
        </Card>
        <Card className="elevated p-5">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Twoje Battle Tasks</div>
          <div className="mt-2 flex items-baseline gap-2">
            <Swords size={20} className="text-violet" />
            <span className="text-3xl font-extrabold">{myTasks.length}</span>
          </div>
        </Card>
        <Card className="elevated p-5">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Twoje decyzje</div>
          <div className="mt-2 flex items-baseline gap-2">
            <ShieldCheck size={20} className="text-amber" />
            <span className="text-3xl font-extrabold">{myDecisions.length}</span>
          </div>
        </Card>
        <Card className="elevated p-5 ring-1 ring-primary/30 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/15 blur-2xl rounded-full" />
          <div className="text-xs text-primary uppercase tracking-wider font-bold">Twój score</div>
          <div className="mt-2 flex items-baseline gap-2">
            <Trophy size={20} className="text-primary-glow" />
            <span className="text-3xl font-extrabold">{myCompanyScore?.score ?? 0}</span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Judging panel */}
          {judging && (
            <section>
              <h2 className="text-xl font-bold mb-4">Wymaga decyzji</h2>
              <Card className="elevated p-6 ring-1 ring-amber/40 bg-amber-soft/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber/20 ring-2 ring-amber/50 flex items-center justify-center shrink-0">
                    <Swords size={22} className="text-amber" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-amber font-bold uppercase tracking-wider">
                      {judging.status === "judging" ? "Czas wybrać Top 3" : "Trwa zbieranie zgłoszeń"}
                    </div>
                    <h3 className="text-lg font-bold mt-1">{judging.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {submissions.filter((s) => s.taskId === judging.id).length} zgłoszeń
                    </p>
                  </div>
                  <Button asChild>
                    <Link to={`/tasks/${judging.id}`}>Otwórz <ArrowRight size={14} /></Link>
                  </Button>
                </div>
              </Card>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Polecane talenty</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/talents">Wszystkie <ArrowRight size={14} /></Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {topPicks.map((t) => <TalentCard key={t.id} talent={t} />)}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Anti-Ghosting</h2>
          <Card className="elevated p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Twój feedback rate</div>
            <div className="mt-2 text-4xl font-extrabold text-primary">
              {Math.round((myCompanyScore?.feedbackRate ?? 0) * 100)}%
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Procent odrzuceń z konstruktywną wskazówką.
            </p>
            <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Czas odpowiedzi</span>
                <span className="font-semibold tabular-nums">~{Math.round(myCompanyScore?.avgResponseHours ?? 0)}h</span>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link to="/decisions">Zarządzaj zgłoszeniami</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
