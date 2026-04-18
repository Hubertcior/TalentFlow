import { useParams, useNavigate, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useTalentFlow } from "@/store/useTalentFlow";
import { useRole } from "@/contexts/RoleContext";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trophy, Clock, Star, CheckCircle2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TaskDetailPage = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { role } = useRole();
  const task = useTalentFlow((s) => s.tasks.find((t) => t.id === id));
  const allSubs = useTalentFlow((s) => s.submissions);
  const subs = useMemo(() => allSubs.filter((sb) => sb.taskId === id), [allSubs, id]);
  const talents = useTalentFlow((s) => s.talents);
  const company = useTalentFlow((s) => s.companies.find((c) => c.id === task?.companyId));
  const me = useTalentFlow((s) => s.talents.find((t) => t.isMe));
  const submitToTask = useTalentFlow((s) => s.submitToTask);
  const selectTopThree = useTalentFlow((s) => s.selectTopThree);

  // Submission form
  const [summary, setSummary] = useState("");
  const [link, setLink] = useState("");

  // Top-3 ranking by mentor
  const [picks, setPicks] = useState<Record<string, 1 | 2 | 3 | null>>({});

  if (!task) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Nie znaleziono zadania.</p>
        <Button asChild variant="link"><Link to="/tasks">← Wróć</Link></Button>
      </div>
    );
  }

  const mySubmission = subs.find((s) => s.talentId === me?.id);
  const isOwner = company?.isMe;

<<<<<<< HEAD
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSelectingTop, setIsSelectingTop] = useState(false);

  const handleSubmit = async () => {
=======
  const handleSubmit = () => {
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
    if (summary.trim().length < 10) {
      toast.error("Opis musi mieć co najmniej 10 znaków");
      return;
    }
<<<<<<< HEAD
    setIsSubmitting(true);
    try {
      await submitToTask(task.id, summary.trim(), link.trim() || undefined);
      toast.success("Zgłoszenie wysłane!", { description: "Mentor zobaczy Twoje rozwiązanie." });
      setSummary("");
      setLink("");
    } catch (err) {
      toast.error("Błąd: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectTop = async () => {
=======
    submitToTask(task.id, summary.trim(), link.trim() || undefined);
    toast.success("Zgłoszenie wysłane!", { description: "Mentor zobaczy Twoje rozwiązanie." });
    setSummary("");
    setLink("");
  };

  const handleSelectTop = () => {
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
    const top = Object.entries(picks)
      .filter(([, r]) => r != null)
      .map(([id, r]) => ({ id, rank: r as 1 | 2 | 3 }));

    const ranks = top.map((t) => t.rank);
    if (new Set(ranks).size !== ranks.length) {
      toast.error("Każda pozycja (1, 2, 3) może być przyznana tylko raz");
      return;
    }
    if (top.length === 0) {
      toast.error("Wybierz co najmniej jednego zwycięzcę");
      return;
    }

<<<<<<< HEAD
    setIsSelectingTop(true);
    try {
      await selectTopThree(task.id, top);
      toast.success("Top 3 wybrane!", {
        description: "Odznaki Verified by Mentor zostały nadane.",
      });
    } catch (err) {
      toast.error("Błąd: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSelectingTop(false);
    }
=======
    selectTopThree(task.id, top);
    toast.success("Top 3 wybrane!", {
      description: "Odznaki Verified by Mentor zostały nadane.",
    });
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
  };

  const dueDate = new Date(task.dueAt);
  const daysLeft = Math.round((dueDate.getTime() - Date.now()) / 86400000);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <button
        onClick={() => nav(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition"
      >
        <ArrowLeft size={14} /> Wróć do zadań
      </button>

      <PageHeader
        eyebrow={`Battle Task · ${company?.name ?? ""}`}
        title={task.title}
        description={task.brief}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Submit form (talent) */}
          {role === "talent" && task.status === "open" && (
            <Card className="elevated p-6">
              <h2 className="text-lg font-bold mb-1">
                {mySubmission ? "Twoje zgłoszenie" : "Weź udział"}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {mySubmission
                  ? "Możesz zaktualizować swoje zgłoszenie do zamknięcia zadania."
                  : "Opisz krótko swoje podejście. Dodaj link do prototypu/repo, jeśli masz."}
              </p>

              {mySubmission ? (
                <div className="rounded-lg bg-primary/10 ring-1 ring-primary/30 p-4 mb-4">
                  <div className="flex items-center gap-2 text-primary text-sm font-bold mb-2">
                    <CheckCircle2 size={16} /> Wysłane {new Date(mySubmission.submittedAt).toLocaleDateString("pl-PL")}
                  </div>
                  <p className="text-sm">{mySubmission.summary}</p>
                  {mySubmission.link && (
                    <a href={mySubmission.link} target="_blank" rel="noreferrer" className="text-primary text-sm flex items-center gap-1 mt-2 hover:underline">
                      {mySubmission.link} <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ) : null}

              <div className="space-y-3">
                <div>
                  <Label>Twoje podejście</Label>
                  <Textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="W 2–3 zdaniach: jak rozwiązałaś problem?"
                    className="mt-1 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label>Link (opcjonalnie)</Label>
                  <Input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://figma.com/..."
                    className="mt-1"
                  />
                </div>
<<<<<<< HEAD
                <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Wysyłam…" : mySubmission ? "Zaktualizuj zgłoszenie" : "Wyślij zgłoszenie"}
=======
                <Button onClick={handleSubmit} className="w-full">
                  {mySubmission ? "Zaktualizuj zgłoszenie" : "Wyślij zgłoszenie"}
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
                </Button>
              </div>
            </Card>
          )}

          {/* All submissions — visible only to mentors */}
          {role === "mentor" && (
          <Card className="elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Zgłoszenia ({subs.length})</h2>
              {isOwner && task.status !== "closed" && (
<<<<<<< HEAD
                <Button size="sm" onClick={handleSelectTop} disabled={isSelectingTop} className="gap-2">
                  <Trophy size={14} /> {isSelectingTop ? "Zapisuję…" : "Zatwierdź Top 3"}
=======
                <Button size="sm" onClick={handleSelectTop} className="gap-2">
                  <Trophy size={14} /> Zatwierdź Top 3
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
                </Button>
              )}
            </div>

            {subs.length === 0 && (
              <p className="text-sm text-muted-foreground">Brak zgłoszeń.</p>
            )}

            <ul className="space-y-3">
              {subs.map((s) => {
                const author = talents.find((t) => t.id === s.talentId);
                if (!author) return null;
                const currentRank = picks[s.id] ?? s.rank ?? null;

                return (
                  <li
                    key={s.id}
                    className={cn(
                      "rounded-lg border p-4 transition",
                      currentRank
                        ? "bg-violet-soft/30 border-violet/50"
                        : "bg-surface border-border"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-full bg-primary/15 ring-1 ring-primary/40 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {author.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link to={`/talents/${author.id}`} className="font-bold hover:text-primary transition">
                            {author.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">{s.summary}</p>
                          {s.link && (
                            <a href={s.link} target="_blank" rel="noreferrer"
                               className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                              {s.link} <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Rank picker (mentor + owner) or rank badge */}
                      {role === "mentor" && isOwner && task.status !== "closed" ? (
                        <div className="flex gap-1 shrink-0">
                          {[1, 2, 3].map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setPicks((p) => ({ ...p, [s.id]: currentRank === r ? null : (r as 1 | 2 | 3) }))}
                              className={cn(
                                "w-8 h-8 rounded-full text-xs font-bold border transition",
                                currentRank === r
                                  ? "bg-violet text-foreground border-violet"
                                  : "border-border text-muted-foreground hover:border-violet/50 hover:text-foreground"
                              )}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      ) : s.rank ? (
                        <Badge className="seal-verified text-foreground border-0 gap-1">
                          <Star size={10} fill="currentColor" /> Top {s.rank}
                        </Badge>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
          )}
        </div>

        {/* Sidebar */}
        <Card className="elevated p-5 h-fit">
          <div className="space-y-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Status</div>
              <Badge variant="outline" className={cn(
                "mt-1",
                task.status === "open" && "bg-primary/15 text-primary border-primary/40",
                task.status === "judging" && "bg-amber/15 text-amber border-amber/40",
                task.status === "closed" && "bg-muted text-muted-foreground border-border",
              )}>
                {task.status === "open" ? "Otwarte" : task.status === "judging" ? "Ocenianie" : "Zamknięte"}
              </Badge>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Termin</div>
              <div className="mt-1 flex items-center gap-2 font-medium">
                <Clock size={14} className="text-muted-foreground" />
                {daysLeft >= 0 ? `${daysLeft} dni` : "po terminie"}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Nagroda</div>
              <div className="mt-1 font-medium text-violet">
                <Trophy size={14} className="inline mr-1" /> {task.reward}
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <Badge variant="outline" className="w-full justify-center bg-primary/10 border-primary/40 text-primary py-1.5">
                Otwarte dla wszystkich · zero wymagań wstępnych
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TaskDetailPage;
