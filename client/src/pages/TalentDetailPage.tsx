import { useParams, useNavigate, Link } from "react-router-dom";
import { useTalentFlow } from "@/store/useTalentFlow";
import { PageHeader } from "@/components/common/PageHeader";
import { TalentCard } from "@/components/talent/TalentCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Send, X } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { useState } from "react";
import { RejectDialog } from "@/components/decisions/RejectDialog";
import { toast } from "sonner";
<<<<<<< HEAD
=======
import { MY_COMPANY_ID } from "@/store/useTalentFlow";
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6

const TalentDetailPage = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { role } = useRole();
  const talent = useTalentFlow((s) => s.talents.find((t) => t.id === id));
  const acceptTalent = useTalentFlow((s) => s.acceptTalent);
<<<<<<< HEAD
  const myCompanyId = useTalentFlow((s) => s.companies.find((c) => c.isMe)?.id ?? "");
=======
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
  const [rejectOpen, setRejectOpen] = useState(false);

  if (!talent) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Nie znaleziono talentu.</p>
        <Button asChild variant="link" className="mt-2"><Link to="/talents">← Wróć</Link></Button>
      </div>
    );
  }

<<<<<<< HEAD
  const handleAccept = async () => {
    try {
      await acceptTalent(talent.id, myCompanyId);
      toast.success(`Wysłano zaproszenie do ${talent.name}`, {
        description: "15-minutowy quick invite został przesłany na kartę talentu.",
      });
    } catch (err) {
      toast.error("Błąd: " + (err instanceof Error ? err.message : String(err)));
    }
=======
  const handleAccept = () => {
    acceptTalent(talent.id, MY_COMPANY_ID);
    toast.success(`Wysłano zaproszenie do ${talent.name}`, {
      description: "15-minutowy quick invite został przesłany na kartę talentu.",
    });
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <button
        onClick={() => nav(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition"
      >
        <ArrowLeft size={14} /> Wróć
      </button>

      <PageHeader
        eyebrow="Karta talentu"
        title={talent.name}
        description={talent.bio}
        actions={role === "mentor" ? (
          <>
            <Button variant="outline" onClick={() => setRejectOpen(true)} className="gap-2">
              <X size={14} /> Odrzuć
            </Button>
            <Button onClick={handleAccept} className="gap-2 shadow-glow">
              <Calendar size={14} /> Zaproś na 15 min
            </Button>
          </>
        ) : null}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TalentCard talent={talent} expanded />

          {talent.portfolioUrl && (
            <Card className="elevated p-5">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Portfolio</div>
              <a
                href={talent.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline break-all"
              >
                {talent.portfolioUrl}
              </a>
            </Card>
          )}
        </div>

        <Card className="elevated p-5 h-fit">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Szczegóły</div>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Wiek</dt>
              <dd className="font-medium">{talent.age} lat</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Miasto</dt>
              <dd className="font-medium">{talent.city}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Odznaki</dt>
              <dd className="font-medium">{talent.badges.length}</dd>
            </div>
            <div className="pt-3 border-t border-border">
              <Badge variant="outline" className="w-full justify-center py-1.5 bg-amber-soft/30 border-amber/40 text-amber">
                Bez pola "uczelnia" — by design
              </Badge>
            </div>
          </dl>
          {role === "mentor" && (
            <Button onClick={handleAccept} className="w-full mt-4 gap-2">
              <Send size={14} /> Quick invite
            </Button>
          )}
        </Card>
      </div>

      <RejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        talentId={talent.id}
        talentName={talent.name}
      />
    </div>
  );
};

export default TalentDetailPage;
