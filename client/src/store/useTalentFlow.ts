import { create } from "zustand";
import type {
  Talent, Company, BattleTask, Submission, Decision, Availability,
} from "@/types/domain";
import { api } from "@/api/client";

interface TalentFlowState {
  talents: Talent[];
  companies: Company[];
  tasks: BattleTask[];
  submissions: Submission[];
  decisions: Decision[];
  initialized: boolean;

  initialize: () => Promise<void>;

  // Talent actions
  updateMyTalent: (patch: Partial<Pick<Talent, "name" | "role" | "bio" | "city" | "availability" | "portfolioUrl">>) => Promise<void>;
  updateMyInterests: (interests: string[]) => Promise<void>;
  setMyAvailability: (a: Availability) => Promise<void>;

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
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;
    const data = await api.getSeed();
    set({ ...data, initialized: true });
  },

  updateMyTalent: async (patch) => {
    const me = get().talents.find((t) => t.isMe);
    if (!me) return;
    set((s) => ({ talents: s.talents.map((t) => (t.isMe ? { ...t, ...patch } : t)) }));
    await api.updateTalent(me.id, patch).catch(console.error);
  },

  updateMyInterests: async (interests) => {
    const me = get().talents.find((t) => t.isMe);
    if (!me) return;
    set((s) => ({ talents: s.talents.map((t) => (t.isMe ? { ...t, interests } : t)) }));
    await api.updateTalent(me.id, { interests }).catch(console.error);
  },

  setMyAvailability: async (availability) => {
    const me = get().talents.find((t) => t.isMe);
    if (!me) return;
    set((s) => ({ talents: s.talents.map((t) => (t.isMe ? { ...t, availability } : t)) }));
    await api.updateTalent(me.id, { availability }).catch(console.error);
  },

  submitToTask: async (taskId, summary, link) => {
    const me = get().talents.find((t) => t.isMe);
    if (!me) return;
    const submittedAt = new Date().toISOString();
    const optimistic: Submission = { id: `s-${Date.now()}`, taskId, talentId: me.id, summary, link, submittedAt };
    set((s) => ({
      submissions: [
        ...s.submissions.filter((x) => !(x.taskId === taskId && x.talentId === me.id)),
        optimistic,
      ],
    }));
    try {
      const created = await api.createSubmission({ taskId, talentId: me.id, summary, link, submittedAt });
      set((s) => ({ submissions: s.submissions.map((x) => (x.id === optimistic.id ? created : x)) }));
    } catch (e) { console.error(e); }
  },

  rateDecision: async (decisionId, usefulness) => {
    set((s) => ({ decisions: s.decisions.map((d) => (d.id === decisionId ? { ...d, usefulness } : d)) }));
    await api.updateDecision(decisionId, { usefulness }).catch(console.error);
  },

  selectTopThree: async (taskId, top) => {
    const state = get();
    const updatedSubs = state.submissions.map((sub) => {
      if (sub.taskId !== taskId) return sub;
      const found = top.find((t) => t.id === sub.id);
      return { ...sub, rank: found?.rank };
    });
    const task = state.tasks.find((t) => t.id === taskId);
    let updatedTalents = state.talents;
    if (task) {
      const company = state.companies.find((c) => c.id === task.companyId);
      const totalEntries = updatedSubs.filter((x) => x.taskId === taskId).length;
      const winnerSubs = updatedSubs.filter((x) => x.taskId === taskId && x.rank);
      updatedTalents = state.talents.map((tal) => {
        const winner = winnerSubs.find((w) => w.talentId === tal.id);
        if (!winner || !company) return tal;
        if (tal.badges.some((b) => b.taskTitle === task.title && b.company === company.name)) return tal;
        return {
          ...tal,
          badges: [
            ...tal.badges,
            { id: `b-${Date.now()}-${tal.id}`, company: company.name, taskTitle: task.title, rank: winner.rank!, total: totalEntries, awardedAt: new Date().toISOString() },
          ],
        };
      });
    }
    const updatedTasks = state.tasks.map((t) => (t.id === taskId ? { ...t, status: "closed" as const } : t));
    set({ submissions: updatedSubs, talents: updatedTalents, tasks: updatedTasks });
    try {
      await Promise.all([
        ...top.map(({ id, rank }) => api.updateSubmission(id, { rank })),
        api.updateTask(taskId, { status: "closed" }),
      ]);
    } catch (e) { console.error(e); }
  },

  acceptTalent: async (talentId, companyId, taskId) => {
    const now = new Date().toISOString();
    const optimistic: Decision = { id: `d-${Date.now()}`, talentId, companyId, taskId, outcome: "accepted", createdAt: now, responseTimeHours: 24 };
    set((s) => ({ decisions: [...s.decisions, optimistic] }));
    try {
      const created = await api.createDecision({ talentId, companyId, taskId, outcome: "accepted", createdAt: now, responseTimeHours: 24 });
      set((s) => ({ decisions: s.decisions.map((d) => (d.id === optimistic.id ? created : d)) }));
    } catch (e) { console.error(e); }
  },

  rejectTalent: async (talentId, companyId, { tip, note, taskId }) => {
    const now = new Date().toISOString();
    const optimistic: Decision = { id: `d-${Date.now()}`, talentId, companyId, taskId, outcome: "rejected", tip, note, createdAt: now, responseTimeHours: 24 };
    set((s) => ({ decisions: [...s.decisions, optimistic] }));
    try {
      const created = await api.createDecision({ talentId, companyId, taskId, outcome: "rejected", tip, note, createdAt: now, responseTimeHours: 24 });
      set((s) => ({ decisions: s.decisions.map((d) => (d.id === optimistic.id ? created : d)) }));
    } catch (e) { console.error(e); }
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

export const MY_COMPANY_ID = "c-me";

/** Derived: mentor scoring for the leaderboard. */
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

// Memoized: returns the same reference when companies/decisions arrays haven't changed,
// preventing useSyncExternalStore from detecting an unstable snapshot.
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

      const avgResponseHours = myDecisions.length === 0
        ? 0
        : myDecisions.reduce((sum, d) => sum + d.responseTimeHours, 0) / myDecisions.length;

      const ratings = rejections.filter((d) => typeof d.usefulness === "number");
      const avgUsefulness = ratings.length === 0
        ? 0
        : ratings.reduce((sum, d) => sum + (d.usefulness ?? 0), 0) / ratings.length;

      const speedScore = Math.max(0, 100 - avgResponseHours);
      const score =
        feedbackRate * 70 +
        (speedScore / 100) * 30;

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