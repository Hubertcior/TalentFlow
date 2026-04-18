import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Role } from "@/types/domain";

export interface MockAccount {
  id: string;
  displayName: string;
  subtitle: string;
  initials: string;
  role: Role;
  talentId: string | null;
  companyId: string | null;
  bio: string;
  color: string;
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: "acc-candidate-1",
    displayName: "Zofia Malinowska",
    subtitle: "UI/UX + Frontend · Wrocław",
    initials: "ZM",
    role: "talent",
    talentId: "t-me",
    companyId: null,
    bio: "Selfmade designerka i frontend dev. Buduję aplikacje od 16 r.ż. — bez bootcampu, bez studiów.",
    color: "from-primary to-violet",
  },
  {
    id: "acc-candidate-2",
    displayName: "Piotr Nowak",
    subtitle: "Backend Developer · Warszawa",
    initials: "PN",
    role: "talent",
    talentId: "t-me-2",
    companyId: null,
    bio: "Pasjonat open source i systemów rozproszonych. Komercyjne projekty od 17 r.ż.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "acc-mentor",
    displayName: "Kamil Wiśniewski",
    subtitle: "Mentor · TechFlow",
    initials: "KW",
    role: "mentor",
    talentId: null,
    companyId: "c-me",
    bio: "Head of Product w TechFlow. Szukam ambitnych talentów do prawdziwych projektów.",
    color: "from-violet to-purple-700",
  },
];

interface AuthContextValue {
  account: MockAccount | null;
  login: (account: MockAccount) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "talentflow.auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccountState] = useState<MockAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      const savedId = JSON.parse(saved) as string;
      return MOCK_ACCOUNTS.find((a) => a.id === savedId) ?? null;
    } catch {
      return null;
    }
  });

  // Sync store on mount if already logged in
  useEffect(() => {
    if (account) {
      // Lazy import to avoid circular dependency at module load time
      import("@/store/useTalentFlow").then(({ useTalentFlow }) => {
        useTalentFlow.getState().setActiveUser(account.talentId, account.companyId);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (acc: MockAccount) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(acc.id));
    setAccountState(acc);
    import("@/store/useTalentFlow").then(({ useTalentFlow }) => {
      useTalentFlow.getState().setActiveUser(acc.talentId, acc.companyId);
    });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAccountState(null);
  };

  return (
    <AuthContext.Provider value={{ account, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
