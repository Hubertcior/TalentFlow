import { apiFetch } from "./client";

// ── Backend DTO shapes ────────────────────────────────────────────────────────

export interface AccountDto {
  id: string;
  displayName: string;
  subtitle: string;
  initials: string;
  role: string; // "Talent" | "Mentor"
  talentId: string | null;
  companyId: string | null;
  bio: string;
  color: string;
}

export interface LoginResponse {
  token: string;
  account: AccountDto;
}

export interface BadgeDto {
  id: string;
  company: string;
  taskTitle: string;
  rank: number;
  total: number;
  awardedAt: string;
}

export interface TalentDto {
  id: string;
  name: string;
  initials: string;
  role: string;
  bio: string;
  age: number;
  city: string;
  availability: string; // "Now" | "Soon" | "Busy"
  portfolioUrl: string | null;
  interests: string[];
  badges: BadgeDto[];
}

export interface CompanyDto {
  id: string;
  name: string;
  mentorName: string;
  industry: string;
}

export interface TaskDto {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  brief: string;
  reward: string;
  status: string; // "Open" | "Judging" | "Closed"
  industry: string;
  dueAt: string;
  createdAt: string;
}

export interface SubmissionDto {
  id: string;
  taskId: string;
  talentId: string;
  talentName: string;
  summary: string;
  link: string | null;
  submittedAt: string;
  rank: number | null;
}

export interface DecisionDto {
  id: string;
  talentId: string;
  talentName: string;
  companyId: string;
  companyName: string;
  taskId: string | null;
  outcome: string; // "Accepted" | "Rejected"
  tip: string | null;
  note: string | null;
  createdAt: string;
  usefulness: number | null;
  responseTimeHours: number;
}

export interface CompanyScoreDto {
  companyId: string;
  companyName: string;
  mentorName: string;
  totalDecisions: number;
  feedbackRate: number;
  avgResponseHours: number;
  avgUsefulness: number;
  score: number;
  isTopEmployer: boolean;
}

// ── API functions ─────────────────────────────────────────────────────────────

export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    register: (data: {
      email: string;
      password: string;
      displayName: string;
      role: "talent" | "mentor";
      roleTitle?: string;
      city?: string;
      age?: number;
      companyName?: string;
      companyIndustry?: string;
    }) =>
      apiFetch<LoginResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    me: () => apiFetch<AccountDto>("/api/auth/me"),

    logout: () =>
      apiFetch<void>("/api/auth/logout", { method: "POST" }),
  },

  talents: {
    getAll: (params?: { availability?: string; verified?: boolean; interest?: string; q?: string }) => {
      const qs = new URLSearchParams();
      if (params?.availability) qs.set("availability", params.availability);
      if (params?.verified != null) qs.set("verified", String(params.verified));
      if (params?.interest) qs.set("interest", params.interest);
      if (params?.q) qs.set("q", params.q);
      const query = qs.toString();
      return apiFetch<TalentDto[]>(`/api/talents${query ? `?${query}` : ""}`);
    },

    getById: (id: string) => apiFetch<TalentDto>(`/api/talents/${id}`),

    updateMe: (data: {
      name?: string;
      roleTitle?: string;
      bio?: string;
      city?: string;
      availability?: string;
      portfolioUrl?: string;
      interests?: string[];
    }) =>
      apiFetch<TalentDto>("/api/talents/me", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },

  companies: {
    getAll: () => apiFetch<CompanyDto[]>("/api/companies"),
    getById: (id: string) => apiFetch<CompanyDto>(`/api/companies/${id}`),
  },

  tasks: {
    getAll: (status?: string) =>
      apiFetch<TaskDto[]>(`/api/tasks${status ? `?status=${status}` : ""}`),

    getById: (id: string) => apiFetch<TaskDto>(`/api/tasks/${id}`),

    create: (data: { title: string; brief: string; reward: string; industry: string; dueAt: string }) =>
      apiFetch<TaskDto>("/api/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getSubmissions: (taskId: string) =>
      apiFetch<SubmissionDto[]>(`/api/tasks/${taskId}/submissions`),

    submit: (taskId: string, data: { summary: string; link?: string }) =>
      apiFetch<SubmissionDto>(`/api/tasks/${taskId}/submissions`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    selectTop3: (taskId: string, rankings: { id: string; rank: number }[]) =>
      apiFetch<void>(`/api/tasks/${taskId}/top3`, {
        method: "POST",
        body: JSON.stringify({ rankings }),
      }),
  },

  decisions: {
    getAll: () => apiFetch<DecisionDto[]>("/api/decisions"),

    create: (data: {
      talentId: string;
      companyId: string;
      taskId?: string;
      outcome: string;
      tip?: string;
      note?: string;
    }) =>
      apiFetch<DecisionDto>("/api/decisions", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    rateUsefulness: (id: string, usefulness: number) =>
      apiFetch<DecisionDto>(`/api/decisions/${id}/usefulness`, {
        method: "PATCH",
        body: JSON.stringify({ usefulness }),
      }),
  },

  employers: {
    getScores: () => apiFetch<CompanyScoreDto[]>("/api/employers/scores"),
  },
};
