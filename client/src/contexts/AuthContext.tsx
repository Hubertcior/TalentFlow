import { createContext, useContext, useEffect, useState, ReactNode } from "react";
<<<<<<< HEAD
import { toast } from "sonner";
import type { Role } from "@/types/domain";
import { api } from "@/api";
import { getToken, setToken, clearToken } from "@/api/client";

export interface Account {
=======
import type { Role } from "@/types/domain";

export interface MockAccount {
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
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

<<<<<<< HEAD
interface AuthContextValue {
  account: Account | null;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  role: "talent" | "mentor";
  roleTitle?: string;
  city?: string;
  age?: number;
  companyName?: string;
  companyIndustry?: string;
=======
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
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "talentflow.auth";

<<<<<<< HEAD
function dtoToAccount(dto: { id: string; displayName: string; subtitle: string; initials: string; role: string; talentId: string | null; companyId: string | null; bio: string; color: string }): Account {
  return {
    id: dto.id,
    displayName: dto.displayName,
    subtitle: dto.subtitle,
    initials: dto.initials,
    role: dto.role.toLowerCase() as Role,
    talentId: dto.talentId,
    companyId: dto.companyId,
    bio: dto.bio,
    color: dto.color,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccountState] = useState<Account | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsAuthLoading(false);
      return;
    }

    api.auth.me()
      .then(async (dto) => {
        const acc = dtoToAccount(dto);
        setAccountState(acc);
        const { useTalentFlow } = await import("@/store/useTalentFlow");
        const store = useTalentFlow.getState();
        await store.initData();
        store.setActiveUser(acc.talentId, acc.companyId);
      })
      .catch(() => {
        clearToken();
        localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => setIsAuthLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyLogin = async (token: string, dto: Parameters<typeof dtoToAccount>[0]) => {
    setToken(token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dto.id));
    const acc = dtoToAccount(dto);
    setAccountState(acc);
    const { useTalentFlow } = await import("@/store/useTalentFlow");
    const store = useTalentFlow.getState();
    await store.initData();
    store.setActiveUser(acc.talentId, acc.companyId);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login(email, password);
      await applyLogin(response.token, response.account);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd logowania");
      throw err;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await api.auth.register(data);
      await applyLogin(response.token, response.account);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd rejestracji");
      throw err;
    }
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem(STORAGE_KEY);
    setAccountState(null);
    import("@/store/useTalentFlow").then(({ useTalentFlow }) => {
      useTalentFlow.getState().resetData();
    });
  };

  return (
    <AuthContext.Provider value={{ account, isAuthLoading, login, register, logout }}>
=======
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
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
