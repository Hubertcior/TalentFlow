import { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Lock } from "lucide-react";
<<<<<<< HEAD
import { useTalentFlow } from "@/store/useTalentFlow";
=======
import { useTalentFlow, MY_COMPANY_ID } from "@/store/useTalentFlow";
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PRESET_TIPS = [
  "Popracuj nad komunikacją w zespole",
  "Podszkol framework, którego używamy (React)",
  "Brak dopasowania kulturowego do zespołu",
];

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  talentId: string;
  talentName: string;
  taskId?: string;
}

/**
 * Anti-Ghosting Bridge — the reject button is locked until the mentor
 * picks one of three preset tips OR provides a custom note. UI enforces
 * the rule; there's no API path that lets a mentor ghost a candidate.
 */
export const RejectDialog = ({ open, onOpenChange, talentId, talentName, taskId }: RejectDialogProps) => {
  const [tip, setTip] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
<<<<<<< HEAD
  const [isSending, setIsSending] = useState(false);
  const reject = useTalentFlow((s) => s.rejectTalent);
  const myCompanyId = useTalentFlow((s) => s.companies.find((c) => c.isMe)?.id ?? "");
=======
  const reject = useTalentFlow((s) => s.rejectTalent);
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6

  const finalTip = tip ?? (custom.trim().length >= 10 ? custom.trim() : null);
  const canSubmit = !!finalTip;

<<<<<<< HEAD
  const handleReject = async () => {
    if (!finalTip) return;
    setIsSending(true);
    try {
      await reject(talentId, myCompanyId, {
        tip: finalTip,
        note: tip ? custom.trim() || undefined : undefined,
        taskId,
      });
      toast.success("Decyzja wysłana z konstruktywnym feedbackiem", {
        description: "Kandydat dostał wskazówkę. Twój scoring firmy zaktualizowany.",
      });
      setTip(null);
      setCustom("");
      onOpenChange(false);
    } catch (err) {
      toast.error("Błąd: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSending(false);
    }
=======
  const handleReject = () => {
    if (!finalTip) return;
    reject(talentId, MY_COMPANY_ID, {
      tip: finalTip,
      note: tip ? custom.trim() || undefined : undefined,
      taskId,
    });
    toast.success("Decyzja wysłana z konstruktywnym feedbackiem", {
      description: "Kandydat dostał wskazówkę. Twój scoring firmy zaktualizowany.",
    });
    setTip(null);
    setCustom("");
    onOpenChange(false);
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber font-bold text-xs uppercase tracking-widest mb-2">
            <ShieldCheck size={14} /> Anti-Ghosting Bridge
          </div>
          <DialogTitle>Odrzucasz aplikację — {talentName}</DialogTitle>
          <DialogDescription>
            System wymaga konstruktywnej wskazówki. Bez niej przycisk "Odrzuć" pozostanie zablokowany.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Wybierz gotową wskazówkę
          </Label>
          <div className="space-y-2">
            {PRESET_TIPS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTip(tip === preset ? null : preset)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg border text-sm transition",
                  tip === preset
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Lub napisz własną {tip ? "(opcjonalne uzupełnienie)" : "(min. 10 znaków)"}
            </Label>
            <Textarea
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Np. Mocne portfolio, ale szukamy kogoś z głębszą znajomością systemów płatności…"
              className="mt-2 min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Anuluj</Button>
          <Button
            onClick={handleReject}
<<<<<<< HEAD
            disabled={!canSubmit || isSending}
=======
            disabled={!canSubmit}
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
            variant="destructive"
            className="gap-2"
          >
            {!canSubmit && <Lock size={14} />}
<<<<<<< HEAD
            {isSending ? "Wysyłam…" : canSubmit ? "Wyślij odrzucenie z feedbackiem" : "Wybierz wskazówkę, by odblokować"}
=======
            {canSubmit ? "Wyślij odrzucenie z feedbackiem" : "Wybierz wskazówkę, by odblokować"}
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
