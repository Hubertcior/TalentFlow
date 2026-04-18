import { useState } from "react";
import { useTalentFlow, MY_COMPANY_ID } from "@/store/useTalentFlow";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { RejectDialog } from "@/components/decisions/RejectDialog";

/** Mentor view: pending applications and a panel of past decisions. */
const DecisionsPage = () => {
  const talents = useTalentFlow((s) => s.talents.filter((t) => !t.isMe));
  const decisions = useTalentFlow((s) => s.decisions.filter((d) => d.companyId === MY_COMPANY_ID));
  const acceptTalent = useTalentFlow((s) => s.acceptTalent);

  // "Pending" demo set: top 4 talents who don't yet have a decision from us
  const pending = talents
    .filter((t) => !decisions.some((d) => d.talentId === t.id))
    .slice(0, 4);

  const [rejectFor, setRejectFor] = useState<{ id: string; name: string } | null>(null);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Anti-Ghosting Bridge"
        title="Panel decyzji"
        description="Wszystkie odrzucenia wymagają konstruktywnej wskazówki. Bez niej przycisk 'Odrzuć' jest zablokowany."
      />

      <h2 className="text-lg font-bold mb-3">Oczekujące aplikacje</h2>
      <div className="space-y-3 mb-10">
        {pending.length === 0 && (
          <Card className="elevated p-8 text-center text-muted-foreground">
            Brak oczekujących aplikacji.
          </Card>
        )}
        {pending.map((t) => (
          <Card key={t.id} className="elevated p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/15 ring-1 ring-primary/40 flex items-center justify-center text-sm font-bold text-primary shrink-0">
              {t.initials}
            </div>
            <div className="min-w-0 flex-1">
              <Link to={`/talents/${t.id}`} className="font-bold hover:text-primary transition">
                {t.name}
              </Link>
              <div className="text-sm text-muted-foreground">{t.role} · {t.city}</div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setRejectFor({ id: t.id, name: t.name })} className="gap-1">
              <X size={14} /> Odrzuć
            </Button>
            <Button size="sm" onClick={() => acceptTalent(t.id, MY_COMPANY_ID)} className="gap-1">
              Zaproś <ArrowRight size={14} />
            </Button>
          </Card>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-3">Historia decyzji</h2>
      {decisions.length === 0 && (
        <Card className="elevated p-8 text-center text-muted-foreground">
          Brak historii decyzji.
        </Card>
      )}
      <div className="space-y-2">
        {[...decisions].reverse().map((d) => {
          const t = talents.find((x) => x.id === d.talentId);
          if (!t) return null;
          const isReject = d.outcome === "rejected";
          return (
            <Card key={d.id} className="elevated p-4 flex items-start gap-4">
              <ShieldCheck size={18} className={isReject ? "text-amber mt-1" : "text-primary mt-1"} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link to={`/talents/${t.id}`} className="font-bold hover:text-primary transition">
                    {t.name}
                  </Link>
                  <Badge variant="outline" className={isReject ? "bg-amber/15 text-amber border-amber/40" : "bg-primary/15 text-primary border-primary/40"}>
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

      <RejectDialog
        open={!!rejectFor}
        onOpenChange={(o) => !o && setRejectFor(null)}
        talentId={rejectFor?.id ?? ""}
        talentName={rejectFor?.name ?? ""}
      />
    </div>
  );
};

export default DecisionsPage;
