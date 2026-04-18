import { useTalentFlow } from "@/store/useTalentFlow";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldOff, Plus, X } from "lucide-react";

const AVAILABILITY_LABEL = {
  now: "Dostępna teraz",
  soon: "Za 2–4 tygodnie",
  busy: "Zajęta",
};

const ProfilePage = () => {
  const me = useTalentFlow((s) => s.talents.find((t) => t.isMe))!;
  const update = useTalentFlow((s) => s.updateMyTalent);
  const updateSkills = useTalentFlow((s) => s.updateMySkills);
  const setAvailability = useTalentFlow((s) => s.setMyAvailability);

  const [newSkill, setNewSkill] = useState("");

  const handleSkillLevel = (idx: number, val: number[]) => {
    const next = [...me.skills];
    next[idx] = { ...next[idx], level: val[0] };
    updateSkills(next);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (me.skills.some((s) => s.name.toLowerCase() === newSkill.trim().toLowerCase())) {
      toast.error("Ta umiejętność już jest na karcie");
      return;
    }
    updateSkills([...me.skills, { name: newSkill.trim(), level: 5 }]);
    setNewSkill("");
  };

  const handleRemoveSkill = (idx: number) => {
    updateSkills(me.skills.filter((_, i) => i !== idx));
  };

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Twoja karta"
        title="Edytuj profil"
        description="Pamiętaj — tu nie ma pola 'uczelnia'. Liczy się to co potrafisz."
      />

      <Card className="elevated p-6 mb-6 bg-amber-soft/20 ring-1 ring-amber/30">
        <div className="flex items-start gap-3">
          <ShieldOff className="text-amber shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-semibold">Zero bramek wejściowych</p>
            <p className="text-sm text-muted-foreground mt-1">
              Karta talentu nie ma pól na uczelnię, certyfikaty czy lata doświadczenia.
              Algorytm filtruje wyłącznie po umiejętnościach i odznakach Verified by Mentor.
            </p>
          </div>
        </div>
      </Card>

      <Card className="elevated p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Podstawowe informacje</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Imię i nazwisko</Label>
            <Input value={me.name} onChange={(e) => update({ name: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Headline</Label>
            <Input
              value={me.role}
              onChange={(e) => update({ role: e.target.value })}
              placeholder="np. UI/UX + Frontend"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Miasto</Label>
            <Input value={me.city} onChange={(e) => update({ city: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Portfolio (URL)</Label>
            <Input
              value={me.portfolioUrl ?? ""}
              onChange={(e) => update({ portfolioUrl: e.target.value })}
              placeholder="https://…"
              className="mt-1"
            />
          </div>
          <div className="sm:col-span-2">
            <Label>O mnie</Label>
            <Textarea
              value={me.bio}
              onChange={(e) => update({ bio: e.target.value })}
              className="mt-1 min-h-[80px]"
            />
          </div>
        </div>

        <div className="mt-5">
          <Label>Dostępność</Label>
          <div className="mt-2 flex gap-2">
            {(Object.keys(AVAILABILITY_LABEL) as Array<keyof typeof AVAILABILITY_LABEL>).map((key) => (
              <button
                key={key}
                onClick={() => setAvailability(key)}
                className={
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition " +
                  (me.availability === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-surface text-muted-foreground border-border hover:text-foreground")
                }
              >
                {AVAILABILITY_LABEL[key]}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="elevated p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Umiejętności (0–10)</h2>
        <div className="space-y-5">
          {me.skills.map((s, idx) => (
            <div key={s.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{s.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tabular-nums">{s.level}/10</span>
                  <button
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-muted-foreground hover:text-destructive transition"
                    aria-label="Usuń umiejętność"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              <Slider
                value={[s.level]}
                onValueChange={(v) => handleSkillLevel(idx, v)}
                min={0}
                max={10}
                step={1}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-6 pt-4 border-t border-border">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
            placeholder="Nowa umiejętność…"
          />
          <Button onClick={handleAddSkill} variant="outline" className="gap-1 shrink-0">
            <Plus size={14} /> Dodaj
          </Button>
        </div>
      </Card>

      <Card className="elevated p-6">
        <h2 className="text-lg font-bold mb-4">Twoje odznaki Verified by Mentor</h2>
        {me.badges.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Brak odznak. Weź udział w Battle Tasks, by zdobyć pierwszą.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {me.badges.map((b) => (
              <div key={b.id} className="rounded-lg seal-verified p-4">
                <Badge className="bg-violet/30 text-foreground border-violet/40 mb-2">
                  Top {b.rank} / {b.total}
                </Badge>
                <div className="font-bold">{b.company}</div>
                <div className="text-sm text-muted-foreground">{b.taskTitle}</div>
                <div className="text-xs text-muted-foreground/70 mt-1">
                  {new Date(b.awardedAt).toLocaleDateString("pl-PL")}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
