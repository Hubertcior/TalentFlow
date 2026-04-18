import { Link } from "react-router-dom";
import { useTalentFlow, selectCompanyScores } from "@/store/useTalentFlow";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Inbox, Swords, ArrowRight, Trophy, Tag } from "lucide-react";
import { TalentCard } from "@/components/talent/TalentCard";

/** Talent's home: own profile snapshot, open tasks, latest feedback, badges. */
export const TalentDashboard = () => {
  const me = useTalentFlow((s) => s.talents.find((t) => t.isMe))!;
  const tasks = useTalentFlow((s) => s.tasks);
  const submissions = useTalentFlow((s) => s.submissions);
  const decisions = useTalentFlow((s) => s.decisions);
  const companies = useTalentFlow((s) => s.companies);
  const scores = useTalentFlow(selectCompanyScores);

  const openTasks = tasks.filter((t) => t.status === "open").slice(0, 3);
  const myInbox = decisions.filter((d) => d.talentId === me.id);
  const mySubmissions = submissions.filter((s) => s.talentId === me.id);

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Twój pulpit"
        title={`Cześć, ${me.name.split(" ")[0]}!`}
        description="Bierz udział w Battle Tasks, zdobywaj odznaki Verified by Mentor i czekaj na zaproszenia od mentorów."
      />

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="elevated p-5">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Odznaki</div>
          <div className="mt-2 flex items-baseline gap-2">
            <Star size={20} className="text-violet" fill="currentColor" />
            <span className="text-3xl font-extrabold">{me.badges.length}</span>
          </div>
        </Card>
        <Card className="elevated p-5">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Zgłoszenia</div>
          <div className="mt-2 flex items-baseline gap-2">
            <Swords size={20} className="text-primary" />
            <span className="text-3xl font-extrabold">{mySubmissions.length}</span>
          </div>
        </Card>
        <Card className="elevated p-5">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Feedback w skrzynce</div>
          <div className="mt-2 flex items-baseline gap-2">
            <Inbox size={20} className="text-amber" />
            <span className="text-3xl font-extrabold">{myInbox.length}</span>
          </div>
        </Card>
        <Card className="elevated p-5">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Zainteresowania</div>
          <div className="mt-2 flex items-baseline gap-2">
            <Tag size={20} className="text-primary-glow" />
            <span className="text-3xl font-extrabold">{me.interests.length}</span>
            <span className="text-sm text-muted-foreground">obszarów</span>
          </div>
        </Card>
      </div>

      {/* Two-column body */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Otwarte Battle Tasks</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/tasks">Zobacz wszystkie <ArrowRight size={14} /></Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {openTasks.map((t) => {
                const c = companies.find((c) => c.id === t.companyId);
                const submitted = mySubmissions.some((s) => s.taskId === t.id);
                return (
                  <Card key={t.id} className="elevated p-5 hover:ring-1 hover:ring-primary/40 transition">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <Badge className="bg-primary/15 text-primary border-primary/40">{c?.name}</Badge>
                      {submitted && <Badge className="bg-violet-soft text-violet border-violet/40">Zgłoszone</Badge>}
                    </div>
                    <h3 className="font-bold leading-tight">{t.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{t.brief}</p>
                    <Button asChild className="mt-4 w-full" variant="secondary" size="sm">
                      <Link to={`/tasks/${t.id}`}>{submitted ? "Zobacz zgłoszenie" : "Weź udział"}</Link>
                    </Button>
                  </Card>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Top Employer for Gen Z</h2>
            <Card className="elevated p-5 bg-gradient-brand/10 ring-1 ring-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
              {scores[0] && (
                <div className="relative flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-brand flex items-center justify-center shadow-glow">
                    <Trophy size={26} className="text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-primary font-bold tracking-wider uppercase">Top Employer · ten miesiąc</div>
                    <div className="text-xl font-extrabold mt-0.5">{scores[0].companyName}</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(scores[0].feedbackRate * 100)}% z feedbackiem · ~{Math.round(scores[0].avgResponseHours)}h odpowiedź
                    </div>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/employers">Ranking</Link>
                  </Button>
                </div>
              )}
            </Card>
          </section>
        </div>

        {/* Right column: my card preview */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Moja karta</h2>
          <TalentCard talent={me} expanded />
          <Button asChild variant="outline" className="w-full">
            <Link to="/profile">Edytuj kartę</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
