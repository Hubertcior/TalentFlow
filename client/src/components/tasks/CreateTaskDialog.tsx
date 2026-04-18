import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Swords } from "lucide-react";
import { toast } from "sonner";
import { useTalentFlow } from "@/store/useTalentFlow";

const INDUSTRIES = [
  "IT & Technologie", "Marketing", "Prawo", "Hotelarstwo",
  "Rachunkowość", "Budownictwo", "Finanse", "E-commerce", "Inne",
];

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export const CreateTaskDialog = ({ open, onOpenChange }: Props) => {
  const createTask = useTalentFlow((s) => s.createTask);

  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [reward, setReward] = useState("");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [dueAt, setDueAt] = useState("");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setTitle(""); setBrief(""); setReward(""); setIndustry(INDUSTRIES[0]); setDueAt("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Tytuł jest wymagany"); return; }
    if (!brief.trim()) { toast.error("Opis zadania jest wymagany"); return; }
    if (!reward.trim()) { toast.error("Nagroda jest wymagana"); return; }
    if (!dueAt) { toast.error("Termin jest wymagany"); return; }

    setSaving(true);
    try {
      await createTask({
        title: title.trim(),
        brief: brief.trim(),
        reward: reward.trim(),
        industry,
        dueAt: new Date(dueAt).toISOString(),
      });
      toast.success("Battle Task opublikowany!", {
        description: "Talenty zobaczą go na liście zadań.",
      });
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error("Błąd: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!saving) { reset(); onOpenChange(o); } }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-violet font-bold text-xs uppercase tracking-widest mb-2">
            <Swords size={14} /> Nowy Battle Task
          </div>
          <DialogTitle>Opublikuj wyzwanie rekrutacyjne</DialogTitle>
          <DialogDescription>
            Top 3 talentów dostanie odznakę Verified by Mentor. Zero wymagań wstępnych.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          <div>
            <Label htmlFor="ct-title">Tytuł zadania</Label>
            <Input
              id="ct-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="np. Zaprojektuj onboarding dla aplikacji SaaS"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="ct-brief">Opis / brief</Label>
            <Textarea
              id="ct-brief"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Co ma zrobić talent? Jakie są kryteria oceny?"
              className="mt-1 min-h-[90px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ct-reward">Nagroda</Label>
              <Input
                id="ct-reward"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder="np. Praktyki 3 miesiące"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="ct-industry">Branża</Label>
              <select
                id="ct-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="ct-due">Termin składania zgłoszeń</Label>
            <Input
              id="ct-due"
              type="date"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="mt-1"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => { reset(); onOpenChange(false); }} disabled={saving}>
              Anuluj
            </Button>
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Swords size={14} />}
              {saving ? "Publikuję…" : "Opublikuj task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
