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

const TalentsPage = () => {
  const allTalents = useTalentFlow((s) => s.talents);
  const talents = useMemo(() => allTalents.filter((t) => !t.isMe), [allTalents]);

  const [query, setQuery] = useState("");
  const [interestFilter, setInterestFilter] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availability, setAvailability] = useState<Availability | "all">("all");

  const allInterests = useMemo(() => {
    const set = new Set<string>();
    talents.forEach((t) => t.interests.forEach((i) => set.add(i)));
    return Array.from(set).sort();
  }, [talents]);

  const filtered = useMemo(() => talents.filter((t) => {
    if (verifiedOnly && t.badges.length === 0) return false;
    if (availability !== "all" && t.availability !== availability) return false;
    if (interestFilter && !t.interests.some((i) => i === interestFilter)) return false;
    if (query) {
      const q = query.toLowerCase();
      if (
        !t.name.toLowerCase().includes(q) &&
        !t.role.toLowerCase().includes(q) &&
        !t.interests.some((i) => i.toLowerCase().includes(q))
      ) return false;
    }
    return true;
  }), [talents, verifiedOnly, availability, interestFilter, query]);

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Baza kandydatów"
        title="Karty kandydatów"
        description="Każda dziedzina — IT, marketing, prawo, gastronomia, medycyna i więcej. Bez CV, bez pola 'uczelnia'. Tylko zainteresowania i odznaki."
      />

      <div className="space-y-4 mb-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj po imieniu, dziedzinie, zainteresowaniu…"
            className="pl-9"
          />
        </div>

        {/* Availability + verified */}
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

        {/* Interest filter */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground self-center mr-1">Zainteresowanie:</span>
          <button
            onClick={() => setInterestFilter(null)}
            className={cn(
              "px-3 py-1 rounded-full text-xs border transition",
              !interestFilter
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-surface text-muted-foreground border-border hover:text-foreground"
            )}
          >
            Dowolne
          </button>
          {allInterests.map((i) => (
            <button
              key={i}
              onClick={() => setInterestFilter(interestFilter === i ? null : i)}
              className={cn(
                "px-3 py-1 rounded-full text-xs border transition",
                interestFilter === i
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface text-muted-foreground border-border hover:text-foreground"
              )}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
        <Badge variant="outline">{filtered.length} kandydatów</Badge>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((t) => <TalentCard key={t.id} talent={t} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          Brak kandydatów spełniających filtry.
        </div>
      )}
    </div>
  );
};

export default TalentsPage;
