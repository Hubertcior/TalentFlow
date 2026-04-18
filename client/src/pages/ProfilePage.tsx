import { useTalentFlow } from "@/store/useTalentFlow";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
<<<<<<< HEAD
import { ShieldOff, Plus, X, Save } from "lucide-react";
=======
import { ShieldOff, Plus, X } from "lucide-react";
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6

const AVAILABILITY_LABEL = {
  now: "Dostępny/a teraz",
  soon: "Za 2–4 tygodnie",
  busy: "Zajęty/a",
};

const ProfilePage = () => {
  const me = useTalentFlow((s) => s.talents.find((t) => t.isMe))!;
  const update = useTalentFlow((s) => s.updateMyTalent);
  const updateInterests = useTalentFlow((s) => s.updateMyInterests);
  const setAvailability = useTalentFlow((s) => s.setMyAvailability);
<<<<<<< HEAD
  const saveProfile = useTalentFlow((s) => s.saveProfile);

  const [isSaving, setIsSaving] = useState(false);
  const [newInterest, setNewInterest] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProfile();
      toast.success("Profil zapisany!");
    } catch (err) {
      toast.error("Błąd zapisu: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddInterest = async () => {
=======

  const [newInterest, setNewInterest] = useState("");

  const handleAddInterest = () => {
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
    const trimmed = newInterest.trim();
    if (!trimmed) return;
    if (me.interests.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("To zainteresowanie już jest na karcie");
      return;
    }
<<<<<<< HEAD
    try {
      await updateInterests([...me.interests, trimmed]);
      setNewInterest("");
    } catch {
      toast.error("Nie udało się dodać zainteresowania");
    }
  };

  const handleRemoveInterest = async (idx: number) => {
    try {
      await updateInterests(me.interests.filter((_, i) => i !== idx));
    } catch {
      toast.error("Nie udało się usunąć zainteresowania");
    }
  };

  const handleSetAvailability = async (key: keyof typeof AVAILABILITY_LABEL) => {
    try {
      await setAvailability(key);
    } catch {
      toast.error("Nie udało się zmienić dostępności");
    }
=======
    updateInterests([...me.interests, trimmed]);
    setNewInterest("");
  };

  const handleRemoveInterest = (idx: number) => {
    updateInterests(me.interests.filter((_, i) => i !== idx));
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
  };

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Twoja karta"
        title="Edytuj profil"
        description="Opisz siebie swoimi słowami. Żadnych pól na uczelnię ani certyfikaty — liczy się to, co Cię kręci."
      />

      <Card className="elevated p-6 mb-6 bg-amber-soft/20 ring-1 ring-amber/30">
        <div className="flex items-start gap-3">
          <ShieldOff className="text-amber shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-semibold">Zero bramek wejściowych</p>
            <p className="text-sm text-muted-foreground mt-1">
              Karta talentu nie ma pól na uczelnię, certyfikaty ani lata doświadczenia.
              Mentorzy widzą Twoje zainteresowania, bio i odznaki — nic więcej.
            </p>
          </div>
        </div>
      </Card>

      {/* Basic info */}
      <Card className="elevated p-6 mb-6">
<<<<<<< HEAD
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Podstawowe informacje</h2>
          <Button onClick={handleSave} disabled={isSaving} size="sm" className="gap-1.5">
            <Save size={14} />
            {isSaving ? "Zapisuję…" : "Zapisz zmiany"}
          </Button>
        </div>
=======
        <h2 className="text-lg font-bold mb-4">Podstawowe informacje</h2>
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Imię i nazwisko</Label>
            <Input value={me.name} onChange={(e) => update({ name: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Dziedzina / Headline</Label>
            <Input
              value={me.role}
              onChange={(e) => update({ role: e.target.value })}
              placeholder="np. Marketing & Komunikacja"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Miasto</Label>
            <Input value={me.city} onChange={(e) => update({ city: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Portfolio / LinkedIn (URL)</Label>
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
              placeholder="Kilka zdań o sobie — co robisz, co Cię napędza, czego szukasz."
            />
          </div>
        </div>

        <div className="mt-5">
          <Label>Dostępność</Label>
          <div className="mt-2 flex gap-2 flex-wrap">
            {(Object.keys(AVAILABILITY_LABEL) as Array<keyof typeof AVAILABILITY_LABEL>).map((key) => (
              <button
                key={key}
<<<<<<< HEAD
                onClick={() => handleSetAvailability(key)}
=======
                onClick={() => setAvailability(key)}
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
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

      {/* Interests */}
      <Card className="elevated p-6 mb-6">
        <h2 className="text-lg font-bold mb-1">Zainteresowania i obszary</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Napisz co Cię interesuje — branża, umiejętności, tematy. Mentorzy filtrują po tych tagach.
        </p>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
          {me.interests.map((interest, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 text-sm bg-primary/10 text-primary ring-1 ring-primary/25 rounded-full px-3 py-1"
            >
              {interest}
              <button
                onClick={() => handleRemoveInterest(idx)}
                className="text-primary/60 hover:text-primary transition ml-0.5"
                aria-label="Usuń"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {me.interests.length === 0 && (
            <p className="text-sm text-muted-foreground italic">Brak zainteresowań — dodaj pierwsze poniżej.</p>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddInterest()}
            placeholder="np. marketing cyfrowy, prawo pracy, kuchnia fusion…"
          />
          <Button onClick={handleAddInterest} variant="outline" className="gap-1 shrink-0">
            <Plus size={14} /> Dodaj
          </Button>
        </div>
      </Card>

      {/* Badges */}
      <Card className="elevated p-6">
        <h2 className="text-lg font-bold mb-4">Twoje odznaki Verified by Mentor</h2>
        {me.badges.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Brak odznak. Weź udział w zadaniach rekrutacyjnych, by zdobyć pierwszą.
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
