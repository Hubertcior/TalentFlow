<<<<<<< HEAD
export const TOKEN_KEY = "talentflow.jwt";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers as Record<string, string> | undefined ?? {}),
  };

  const res = await fetch(path, { ...init, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (res.status === 204 || !contentType.includes("application/json")) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
=======
import type { Talent, Company, BattleTask, Submission, Decision } from "@/types/domain";

const BASE = "/api";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export interface SeedData {
  talents: Talent[];
  companies: Company[];
  tasks: BattleTask[];
  submissions: Submission[];
  decisions: Decision[];
}

export const api = {
  getSeed: () => req<SeedData>("/seed"),

  updateTalent: (id: string, patch: Partial<Talent>) =>
    req<Talent>(`/talents/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),

  createSubmission: (data: Omit<Submission, "id">) =>
    req<Submission>("/submissions", { method: "POST", body: JSON.stringify(data) }),

  updateSubmission: (id: string, patch: Partial<Submission>) =>
    req<Submission>(`/submissions/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),

  updateTask: (id: string, patch: Partial<BattleTask>) =>
    req<BattleTask>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),

  createDecision: (data: Omit<Decision, "id">) =>
    req<Decision>("/decisions", { method: "POST", body: JSON.stringify(data) }),

  updateDecision: (id: string, patch: Partial<Decision>) =>
    req<Decision>(`/decisions/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
};
>>>>>>> 16fa846829754b5880229515a4d7bd00a7c354b6
