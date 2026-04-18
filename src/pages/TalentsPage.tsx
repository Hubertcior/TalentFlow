import { useMemo, useState } from "react";
import { useTalentFlow } from "@/store/useTalentFlow";
import { PageHeader } from "@/components/common/PageHeader";
import { TalentCard } from "@/components/talent/TalentCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Availability } from "@/types/domain";

const AVAILABILITY_OPTIONS: { value: Availability | "all"; label: string }[] = [
  { value: "all", label: "Wszyscy" },
  { value: "now", label: "Dostępni teraz" },
  { value: "soon", label: "Wkrótce" },
];

/** Mentor view: filter and browse all talents. */
const TalentsPage = () => {
  const talents = useTalentFlow((s) => s.talents.filter((t) => !t.isMe));

  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availability, setAvailability] = useState<Availability | "all">("all");

  const allSkills = useMemo(() => {
    const set = new Set<string>();
    talents.forEach((t) => t.skills.forEach((s) => set.add(s.name)));
    return Array.from(set).sort();
  }, [talents]);

  const filtered = talents.filter((t) => {
    if (verifiedOnly && t.badges.length === 0) return false;
    if (availability !== "all" && t.availability !== availability) return false;
    if (skillFilter && !t.skills.some((s) => s.name === skillFilter)) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!t.name.toLowerCase().includes(q) &&
          !t.role.toLowerCase().includes(q) &&
          !t.skills.some((s) => s.name.toLowerCase().includes(q))) return false;
    }
    return true;
  });

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Talent Scout"
        title="Karty talentów"
        description="Bez CV. Bez pola 'uczelnia'. Tylko to, co kandydaci faktycznie potrafią — i odznaki, które już zdobyli."
      />

      {/* Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj po imieniu, roli, technologii…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {AVAILABILITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setAvailability(opt.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition",
                availability === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface text-muted-foreground border-border hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
          <button
            onClick={() => setVerifiedOnly((v) => !v)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition",
              verifiedOnly
                ? "bg-violet text-foreground border-violet"
                : "bg-surface text-muted-foreground border-border hover:text-foreground"
            )}
          >
            ★ Verified by Mentor
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground self-center mr-1">Umiejętność:</span>
          <button
            onClick={() => setSkillFilter(null)}
            className={cn(
              "px-3 py-1 rounded-full text-xs border transition",
              !skillFilter ? "bg-primary text-primary-foreground border-primary" : "bg-surface text-muted-foreground border-border hover:text-foreground"
            )}
          >
            Dowolna
          </button>
          {allSkills.map((s) => (
            <button
              key={s}
              onClick={() => setSkillFilter(skillFilter === s ? null : s)}
              className={cn(
                "px-3 py-1 rounded-full text-xs border transition",
                skillFilter === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface text-muted-foreground border-border hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
        <Badge variant="outline">{filtered.length} talentów</Badge>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((t) => <TalentCard key={t.id} talent={t} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          Brak talentów spełniających filtry.
        </div>
      )}
    </div>
  );
};

export default TalentsPage;
