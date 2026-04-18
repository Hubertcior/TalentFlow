import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Role } from "@/types/domain";

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

const STORAGE_KEY = "talentflow.role";

/** Provides the active demo role (talent ↔ mentor) and persists to localStorage. */
export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(() => {
    if (typeof window === "undefined") return "talent";
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "mentor" ? "mentor" : "talent";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, role);
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole: () => setRole(role === "talent" ? "mentor" : "talent") }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
};
