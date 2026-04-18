import { useState } from "react";
import { useAuth, type RegisterData } from "@/contexts/AuthContext";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Briefcase, Eye, EyeOff, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "login" | "register";
type RoleChoice = "talent" | "mentor";

const DEMO_ACCOUNTS = [
  { label: "Zofia — Talent", email: "zofia@demo.pl", password: "demo123", role: "talent" as RoleChoice },
  { label: "Piotr — Talent", email: "piotr@demo.pl", password: "demo123", role: "talent" as RoleChoice },
  { label: "Kamil — Mentor", email: "kamil@demo.pl", password: "demo123", role: "mentor" as RoleChoice },
];

export default function LoginPage() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<Tab>("login");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="mb-10 text-center">
        <div className="flex justify-center mb-4">
          <Logo size={48} />
        </div>
        <div className="brand-wordmark text-3xl">
          talen<span className="text-primary">f</span><span className="text-primary">low</span>
        </div>
        <p className="text-muted-foreground mt-2 text-sm">
          Platforma rekrutacji bez bramek wejściowych
        </p>
      </div>

      <div className="w-full max-w-md">
        {/* Tab switcher */}
        <div className="flex rounded-xl ring-1 ring-border bg-surface p-1 mb-6">
          {(["login", "register"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition",
                tab === t
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t === "login" ? "Zaloguj się" : "Zarejestruj się"}
            </button>
          ))}
        </div>

        {tab === "login" ? (
          <LoginForm onLogin={login} onSwitchToRegister={() => setTab("register")} />
        ) : (
          <RegisterForm onRegister={register} onSwitchToLogin={() => setTab("login")} />
        )}

        {/* Demo accounts */}
        <div className="mt-8">
          <p className="text-xs text-muted-foreground text-center mb-3">
            — lub skorzystaj z konta demo —
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                onClick={() => login(acc.email, acc.password)}
                className={cn(
                  "text-center p-3 rounded-xl ring-1 ring-border bg-surface text-xs transition hover:ring-primary/50 hover:bg-card",
                  acc.role === "talent" ? "hover:text-primary" : "hover:text-violet",
                )}
              >
                <div className={cn("text-[10px] font-bold uppercase tracking-widest mb-1", acc.role === "talent" ? "text-primary" : "text-violet")}>
                  {acc.role === "talent" ? "Talent" : "Mentor"}
                </div>
                <div className="font-medium text-foreground leading-tight">{acc.label.split(" — ")[0]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Login form ────────────────────────────────────────────────────────────────

function LoginForm({ onLogin, onSwitchToRegister }: { onLogin: (e: string, p: string) => Promise<void>; onSwitchToRegister: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) { setError("Wypełnij wszystkie pola"); return; }
    setLoading(true);
    try {
      await onLogin(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd logowania");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="elevated p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="twoj@email.pl"
            className="mt-1"
            autoComplete="email"
          />
        </div>
        <div>
          <Label htmlFor="password">Hasło</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              autoComplete="current-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full gap-2">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <ChevronRight size={15} />}
          {loading ? "Logowanie…" : "Zaloguj się"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Nie masz konta?{" "}
        <button onClick={onSwitchToRegister} className="text-primary hover:underline font-medium">
          Zarejestruj się
        </button>
      </p>
    </Card>
  );
}

// ── Register form ─────────────────────────────────────────────────────────────

const INDUSTRIES = ["IT & Technologie", "Marketing", "Prawo", "Hotelarstwo", "Rachunkowość", "Budownictwo", "Finanse", "E-commerce", "Inne"];

function RegisterForm({ onRegister, onSwitchToLogin }: { onRegister: (d: RegisterData) => Promise<void>; onSwitchToLogin: () => void }) {
  const [role, setRole] = useState<RoleChoice>("talent");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  // Talent extras
  const [roleTitle, setRoleTitle] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [talentIndustry, setTalentIndustry] = useState(INDUSTRIES[0]);
  // Mentor extras
  const [companyName, setCompanyName] = useState("");
  const [companyIndustry, setCompanyIndustry] = useState(INDUSTRIES[0]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!displayName.trim() || !email.trim() || !password) {
      setError("Imię, email i hasło są wymagane"); return;
    }
    if (password.length < 6) { setError("Hasło musi mieć co najmniej 6 znaków"); return; }
    if (role === "mentor" && !companyName.trim()) { setError("Podaj nazwę firmy"); return; }

    setLoading(true);
    try {
      await onRegister({
        email: email.trim(),
        password,
        displayName: displayName.trim(),
        role,
        roleTitle: role === "talent" ? roleTitle.trim() || undefined : undefined,
        city: role === "talent" ? city.trim() || undefined : undefined,
        age: role === "talent" && age ? parseInt(age, 10) : undefined,
        talentIndustry: role === "talent" ? talentIndustry : undefined,
        companyName: role === "mentor" ? companyName.trim() : undefined,
        companyIndustry: role === "mentor" ? companyIndustry : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd rejestracji");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="elevated p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role toggle */}
        <div>
          <Label>Jestem</Label>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setRole("talent")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition",
                role === "talent"
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-surface border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <Sparkles size={14} /> Talentem
            </button>
            <button
              type="button"
              onClick={() => setRole("mentor")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition",
                role === "mentor"
                  ? "bg-violet/10 border-violet text-violet"
                  : "bg-surface border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <Briefcase size={14} /> Mentorem
            </button>
          </div>
        </div>

        {/* Common fields */}
        <div>
          <Label htmlFor="reg-name">Imię i nazwisko</Label>
          <Input id="reg-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="np. Zofia Malinowska" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="reg-email">Email</Label>
          <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="twoj@email.pl" className="mt-1" autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="reg-pw">Hasło</Label>
          <div className="relative mt-1">
            <Input
              id="reg-pw"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="min. 6 znaków"
              className="pr-10"
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Talent extras */}
        {role === "talent" && (
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border">
            <div className="col-span-2">
              <Label htmlFor="roleTitle">Dziedzina / Headline</Label>
              <Input id="roleTitle" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} placeholder="np. Frontend Developer" className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="talentIndustry">Branża</Label>
              <select
                id="talentIndustry"
                value={talentIndustry}
                onChange={(e) => setTalentIndustry(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="city">Miasto</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="np. Warszawa" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="age">Wiek</Label>
              <Input id="age" type="number" min={16} max={99} value={age} onChange={(e) => setAge(e.target.value)} placeholder="np. 22" className="mt-1" />
            </div>
          </div>
        )}

        {/* Mentor extras */}
        {role === "mentor" && (
          <div className="space-y-3 pt-1 border-t border-border">
            <div>
              <Label htmlFor="companyName">Nazwa firmy</Label>
              <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="np. TechFlow Sp. z o.o." className="mt-1" />
            </div>
            <div>
              <Label htmlFor="industry">Branża</Label>
              <select
                id="industry"
                value={companyIndustry}
                onChange={(e) => setCompanyIndustry(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full gap-2">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <ChevronRight size={15} />}
          {loading ? "Tworzę konto…" : "Utwórz konto"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Masz już konto?{" "}
        <button onClick={onSwitchToLogin} className="text-primary hover:underline font-medium">
          Zaloguj się
        </button>
      </p>
    </Card>
  );
}
