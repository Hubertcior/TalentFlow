import { create } from "zustand";
import type {
  Talent, Company, BattleTask, Submission, Decision, Availability,
} from "@/types/domain";
import { api, type TalentDto, type CompanyDto, type TaskDto, type SubmissionDto, type DecisionDto } from "@/api";

// ── DTO → Domain mappers ──────────────────────────────────────────────────────

function mapTalent(dto: TalentDto, isMe?: boolean): Talent {
  return {
    id: dto.id,
    name: dto.name,
    initials: dto.initials,
    role: dto.role,
    bio: dto.bio,
    age: dto.age,
    city: dto.city,
    availability: dto.availability.toLowerCase() as Availability,
    portfolioUrl: dto.portfolioUrl ?? undefined,
    interests: dto.interests,
    badges: dto.badges.map((b) => ({
      id: b.id,
      company: b.company,
      taskTitle: b.taskTitle,
      rank: b.rank as 1 | 2 | 3,
      total: b.total,
      awardedAt: b.awardedAt,
    })),
    isMe,
  };
}

function mapCompany(dto: CompanyDto, isMe?: boolean): Company {
  return { id: dto.id, name: dto.name, mentorName: dto.mentorName, industry: dto.industry, isMe };
}

function mapTask(dto: TaskDto): BattleTask {
  return {
    id: dto.id,
    companyId: dto.companyId,
    title: dto.title,
    brief: dto.brief,
    reward: dto.reward,
    status: dto.status.toLowerCase() as BattleTask["status"],
    industry: dto.industry,
    dueAt: dto.dueAt,
    createdAt: dto.createdAt,
  };
}

function mapSubmission(dto: SubmissionDto): Submission {
  return {
    id: dto.id,
    taskId: dto.taskId,
    talentId: dto.talentId,
    summary: dto.summary,
    link: dto.link ?? undefined,
    submittedAt: dto.submittedAt,
    rank: (dto.rank ?? undefined) as 1 | 2 | 3 | undefined,
  };
}

function mapDecision(dto: DecisionDto): Decision {
  return {
    id: dto.id,
    talentId: dto.talentId,
    companyId: dto.companyId,
    taskId: dto.taskId ?? undefined,
    outcome: dto.outcome.toLowerCase() as "accepted" | "rejected",
    tip: dto.tip ?? undefined,
    note: dto.note ?? undefined,
    createdAt: dto.createdAt,
    usefulness: dto.usefulness ?? undefined,
    responseTimeHours: dto.responseTimeHours,
  };
}

// ── Store ─────────────────────────────────────────────────────────────────────

interface TalentFlowState {
  talents: Talent[];
  companies: Company[];
  tasks: BattleTask[];
  submissions: Submission[];
  decisions: Decision[];
  isLoading: boolean;

  // Bootstrap
  initData: () => Promise<void>;
  resetData: () => void;

  // Talent actions
  updateMyTalent: (patch: Partial<Pick<Talent, "name" | "role" | "bio" | "city" | "availability" | "portfolioUrl">>) => void;
  updateMyInterests: (interests: string[]) => Promise<void>;
  setMyAvailability: (a: Availability) => Promise<void>;
  saveProfile: () => Promise<void>;

  submitToTask: (taskId: string, summary: string, link?: string) => Promise<void>;
  rateDecision: (decisionId: string, usefulness: number) => Promise<void>;

  // Mentor actions
  selectTopThree: (taskId: string, top: { id: string; rank: 1 | 2 | 3 }[]) => Promise<void>;
  acceptTalent: (talentId: string, companyId: string, taskId?: string) => Promise<void>;
  rejectTalent: (talentId: string, companyId: string, opts: { tip: string; note?: string; taskId?: string }) => Promise<void>;

  // Auth action
  setActiveUser: (talentId: string | null, companyId: string | null) => void;
}

export const useTalentFlow = create<TalentFlowState>((set, get) => ({
  talents: [],
  companies: [],
  tasks: [],
  submissions: [],
  decisions: [],
  isLoading: false,

  initData: async () => {
    set({ isLoading: true });
    try {
      const [talents, companies, tasks, decisions] = await Promise.all([
        api.talents.getAll(),
        api.companies.getAll(),
        api.tasks.getAll(),
        api.decisions.getAll(),
      ]);

      const submissionArrays = await Promise.all(
        tasks.map((t) => api.tasks.getSubmissions(t.id)),
      );
      const submissions = submissionArrays.flat();

      set({
        talents: talents.map((t) => mapTalent(t)),
        companies: companies.map((c) => mapCompany(c)),
        tasks: tasks.map(mapTask),
        submissions: submissions.map(mapSubmission),
        decisions: decisions.map(mapDecision),
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  resetData: () => set({
    talents: [], companies: [], tasks: [], submissions: [], decisions: [],
  }),

  // Optimistic update only — call saveProfile() to persist
  updateMyTalent: (patch) => set((s) => ({
    talents: s.talents.map((t) => (t.isMe ? { ...t, ...patch } : t)),
  })),

  updateMyInterests: async (interests) => {
    set((s) => ({
      talents: s.talents.map((t) => (t.isMe ? { ...t, interests } : t)),
    }));
    const dto = await api.talents.updateMe({ interests });
    set((s) => ({
      talents: s.talents.map((t) => (t.isMe ? { ...mapTalent(dto), isMe: true } : t)),
    }));
  },

  setMyAvailability: async (availability) => {
    set((s) => ({
      talents: s.talents.map((t) => (t.isMe ? { ...t, availability } : t)),
    }));
    const dto = await api.talents.updateMe({ availability });
    set((s) => ({
      talents: s.talents.map((t) => (t.isMe ? { ...mapTalent(dto), isMe: true } : t)),
    }));
  },

  saveProfile: async () => {
    const me = get().talents.find((t) => t.isMe);
    if (!me) return;
    const dto = await api.talents.updateMe({
      name: me.name,
      roleTitle: me.role,
      bio: me.bio,
      city: me.city,
      portfolioUrl: me.portfolioUrl,
      availability: me.availability,
      interests: me.interests,
    });
    set((s) => ({
      talents: s.talents.map((t) => (t.isMe ? { ...mapTalent(dto), isMe: true } : t)),
    }));
  },

  submitToTask: async (taskId, summary, link) => {
    const dto = await api.tasks.submit(taskId, { summary, link });
    const sub = mapSubmission(dto);
    set((s) => ({
      submissions: [
        ...s.submissions.filter((x) => !(x.taskId === taskId && x.talentId === sub.talentId)),
        sub,
      ],
    }));
  },

  rateDecision: async (decisionId, usefulness) => {
    const dto = await api.decisions.rateUsefulness(decisionId, usefulness);
    const updated = mapDecision(dto);
    set((s) => ({
      decisions: s.decisions.map((d) => (d.id === decisionId ? updated : d)),
    }));
  },

  selectTopThree: async (taskId, top) => {
    await api.tasks.selectTop3(taskId, top);
    // Refetch affected data since backend creates badges and closes the task
    const [updatedTasks, submissions, talents] = await Promise.all([
      api.tasks.getAll(),
      api.tasks.getSubmissions(taskId),
      api.talents.getAll(),
    ]);
    const myId = get().talents.find((t) => t.isMe)?.id;
    set((s) => ({
      tasks: updatedTasks.map(mapTask),
      submissions: [
        ...s.submissions.filter((x) => x.taskId !== taskId),
        ...submissions.map(mapSubmission),
      ],
      talents: talents.map((t) => mapTalent(t, t.id === myId || undefined)),
    }));
  },

  acceptTalent: async (talentId, companyId, taskId) => {
    const dto = await api.decisions.create({ talentId, companyId, taskId, outcome: "Accepted" });
    set((s) => ({ decisions: [mapDecision(dto), ...s.decisions] }));
  },

  rejectTalent: async (talentId, companyId, { tip, note, taskId }) => {
    const dto = await api.decisions.create({ talentId, companyId, taskId, outcome: "Rejected", tip, note });
    set((s) => ({ decisions: [mapDecision(dto), ...s.decisions] }));
  },

  setActiveUser: (talentId, companyId) => set((s) => ({
    talents: s.talents.map((t) => {
      const shouldBeMe = t.id === talentId;
      if (Boolean(t.isMe) === shouldBeMe) return t;
      return { ...t, isMe: shouldBeMe || undefined };
    }),
    companies: s.companies.map((c) => {
      const shouldBeMe = c.id === companyId;
      if (Boolean(c.isMe) === shouldBeMe) return c;
      return { ...c, isMe: shouldBeMe || undefined };
    }),
  })),
}));

// ── Derived: company leaderboard ──────────────────────────────────────────────

export interface CompanyScore {
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

// Memoized: returns the same reference when inputs haven't changed
export const selectCompanyScores = (() => {
  let prevCompanies: Company[] | undefined;
  let prevDecisions: Decision[] | undefined;
  let cache: CompanyScore[] = [];

  return (state: TalentFlowState): CompanyScore[] => {
    if (state.companies === prevCompanies && state.decisions === prevDecisions) {
      return cache;
    }

    const rows: CompanyScore[] = state.companies.map((c) => {
      const myDecisions = state.decisions.filter((d) => d.companyId === c.id);
      const rejections = myDecisions.filter((d) => d.outcome === "rejected");
      const withFeedback = rejections.filter((d) => d.tip || d.note);
      const feedbackRate = rejections.length === 0 ? 1 : withFeedback.length / rejections.length;

      const avgResponseHours =
        myDecisions.length === 0
          ? 0
          : myDecisions.reduce((sum, d) => sum + d.responseTimeHours, 0) / myDecisions.length;

      const ratings = rejections.filter((d) => typeof d.usefulness === "number");
      const avgUsefulness =
        ratings.length === 0
          ? 0
          : ratings.reduce((sum, d) => sum + (d.usefulness ?? 0), 0) / ratings.length;

      const speedScore = Math.max(0, 100 - avgResponseHours);
      const score = feedbackRate * 70 + (speedScore / 100) * 30;

      return {
        companyId: c.id,
        companyName: c.name,
        mentorName: c.mentorName,
        totalDecisions: myDecisions.length,
        feedbackRate,
        avgResponseHours,
        avgUsefulness,
        score: Math.round(score),
        isTopEmployer: false,
      };
    });

    rows.sort((a, b) => b.score - a.score);
    if (rows.length > 0 && rows[0].totalDecisions > 0) {
      rows[0] = { ...rows[0], isTopEmployer: true };
    }

    prevCompanies = state.companies;
    prevDecisions = state.decisions;
    cache = rows;
    return rows;
  };
})();
