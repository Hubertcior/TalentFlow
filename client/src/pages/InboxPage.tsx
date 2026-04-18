import { useMemo } from "react";
import { useTalentFlow } from "@/store/useTalentFlow";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShieldCheck, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const InboxPage = () => {
  const meId = useTalentFlow((s) => s.talents.find((t) => t.isMe)?.id);
  const allDecisions = useTalentFlow((s) => s.decisions);
  const companies = useTalentFlow((s) => s.companies);
  const decisions = useMemo(
    () =>
      allDecisions
        .filter((d) => d.talentId === meId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [allDecisions, meId],
  );
  const rate = useTalentFlow((s) => s.rateDecision);

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Anti-Ghosting Bridge"
        title="Twoja skrzynka feedbacku"
        description="Każda decyzja firmy zawiera wskazówkę. Oceniasz przydatność — to wpływa na ranking firmy."
      />

      {decisions.length === 0 && (
        <Card className="elevated p-12 text-center">
          <Inbox size={42} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Pusta skrzynka — brak decyzji.</p>
        </Card>
      )}

      <div className="space-y-4">
        {decisions.map((d) => {
          const c = companies.find((c) => c.id === d.companyId);
          const isReject = d.outcome === "rejected";
          return (
            <Card key={d.id} className="elevated p-6 animate-fade-up">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    isReject ? "text-amber" : "text-primary"
                  )}>
                    {isReject ? "Decyzja: nie tym razem" : "Decyzja: zaproszenie!"}
                  </div>
                  <h3 className="text-lg font-bold mt-1">{c?.name}</h3>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {c?.mentorName} · {new Date(d.createdAt).toLocaleDateString("pl-PL")}
                  </div>
                </div>
                <ShieldCheck size={20} className={isReject ? "text-amber" : "text-primary"} />
              </div>

              {d.tip && (
                <div className="rounded-lg bg-amber-soft/30 ring-1 ring-amber/40 p-4 mb-3">
                  <div className="text-xs uppercase font-bold tracking-wider text-amber mb-1">
                    Wskazówka
                  </div>
                  <p className="text-sm italic">"{d.tip}"</p>
                  {d.note && (
                    <p className="text-sm text-muted-foreground mt-2 pt-2 border-t border-amber/20">
                      {d.note}
                    </p>
                  )}
                </div>
              )}

              {isReject && (
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {d.usefulness ? "Twoja ocena:" : "Czy ten feedback był przydatny?"}
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => {
                          rate(d.id, n)
                            .then(() => toast.success(`Dziękujemy! Ocena: ${n}/5`))
                            .catch((err: unknown) => toast.error("Błąd: " + (err instanceof Error ? err.message : String(err))));
                        }}
                        className="p-1 transition hover:scale-110"
                      >
                        <Star
                          size={18}
                          className={cn(
                            (d.usefulness ?? 0) >= n
                              ? "text-amber"
                              : "text-muted-foreground/40 hover:text-amber"
                          )}
                          fill={(d.usefulness ?? 0) >= n ? "currentColor" : "none"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Card className="elevated p-5 mt-8 bg-primary/5 ring-1 ring-primary/20">
        <div className="flex gap-3 items-start">
          <Button variant="ghost" size="icon" className="shrink-0 pointer-events-none">
            <ShieldCheck className="text-primary" />
          </Button>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">Anti-Ghosting Bridge:</span>{" "}
            mentor nie może zamknąć aplikacji bez podania wskazówki. System wymusza odpowiedzialność,
            a Twoje oceny napędzają ranking <strong className="text-primary">"Top Employer for Gen Z"</strong>.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default InboxPage;
