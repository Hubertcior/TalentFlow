import { MockAccount, MOCK_ACCOUNTS, useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/brand/Logo";
import { Sparkles, Briefcase, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { login } = useAuth();

  const candidates = MOCK_ACCOUNTS.filter((a) => a.role === "talent");
  const mentors = MOCK_ACCOUNTS.filter((a) => a.role === "mentor");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="mb-12 text-center">
        <div className="flex justify-center mb-4">
          <Logo size={48} />
        </div>
        <div className="brand-wordmark text-3xl">
          talen<span className="text-primary">f</span><span className="text-primary">low</span>
        </div>
        <p className="text-muted-foreground mt-3 text-base">
          Wybierz konto demonstracyjne, aby kontynuować
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Kandydaci
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {candidates.map((acc) => (
              <AccountCard key={acc.id} account={acc} onSelect={login} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={15} className="text-violet" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet">
              Mentor / Rekruter
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {mentors.map((acc) => (
              <AccountCard key={acc.id} account={acc} onSelect={login} />
            ))}
          </div>
        </section>
      </div>

      <p className="mt-16 text-xs text-muted-foreground">
        Demo · Dane fikcyjne
      </p>
    </div>
  );
}

function AccountCard({
  account,
  onSelect,
}: {
  account: MockAccount;
  onSelect: (a: MockAccount) => void;
}) {
  return (
    <button
      onClick={() => onSelect(account)}
      className="group text-left p-5 rounded-2xl ring-1 ring-border bg-surface hover:ring-primary/40 hover:bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow"
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br shrink-0",
            account.color,
          )}
        >
          {account.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-foreground leading-tight">
            {account.displayName}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{account.subtitle}</div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-snug">
            {account.bio}
          </p>
        </div>
        <ArrowRight
          size={15}
          className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5"
        />
      </div>
    </button>
  );
}
