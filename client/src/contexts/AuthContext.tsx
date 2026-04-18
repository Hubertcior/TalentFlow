import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";
import type { Role } from "@/types/domain";
import { api } from "@/api";
import { getToken, setToken, clearToken } from "@/api/client";

export interface Account {
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
  talentIndustry?: string;
  companyName?: string;
  companyIndustry?: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "talentflow.auth";

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
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
