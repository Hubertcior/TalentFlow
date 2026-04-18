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
