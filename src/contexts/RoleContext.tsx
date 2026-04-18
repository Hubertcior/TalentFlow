import { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import type { Role } from "@/types/domain";

/** Thin wrapper kept for backwards compatibility — role is now derived from the logged-in account. */
export const RoleProvider = ({ children }: { children: ReactNode }) => <>{children}</>;

export const useRole = (): { role: Role } => {
  const { account } = useAuth();
  return { role: account?.role ?? "talent" };
};
