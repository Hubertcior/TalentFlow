import { create } from "zustand";
import type {
  Talent, Company, BattleTask, Submission, Decision, Availability,
} from "@/types/domain";
import {
  SEED_TALENTS, SEED_COMPANIES, SEED_TASKS, SEED_SUBMISSIONS, SEED_DECISIONS,
} from "@/data/mockData";

interface TalentFlowState {
  talents: Talent[];
  companies: Company[];
  tasks: BattleTask[];
  submissions: Submission[];
  decisions: Decision[];

  // Talent actions
  updateMyTalent: (patch: Partial<Pick<Talent, "name" | "role" | "bio" | "city" | "availability" | "portfolioUrl">>) => void;
  updateMyInterests: (interests: string[]) => void;
  setMyAvailability: (a: Availability) => void;

  submitToTask: (taskId: string, summary: string, link?: string) => void;
  rateDecision: (decisionId: string, usefulness: number) => void;

  // Mentor actions
  selectTopThree: (taskId: string, top: { id: string; rank: 1 | 2 | 3 }[]) => void;
  acceptTalent: (talentId: string, companyId: string, taskId?: string) => void;
  rejectTalent: (talentId: string, companyId: string, opts: { tip: string; note?: string; taskId?: string }) => void;

  // Auth action
  setActiveUser: (talentId: string | null, companyId: string | null) => void;
}

const myCompanyId = "c-me";

/** Single source of truth for the prototype. All data is in-memory. */
export const useTalentFlow = create<TalentFlowState>((set, get) => ({
  talents: SEED_TALENTS,
  companies: SEED_COMPANIES,
  tasks: SEED_TASKS,
  submissions: SEED_SUBMISSIONS,
  decisions: SEED_DECISIONS,

  updateMyTalent: (patch) => set((s) => ({
    talents: s.talents.map((t) => (t.isMe ? { ...t, ...patch } : t)),
  })),

  updateMyInterests: (interests) => set((s) => ({
    talents: s.talents.map((t) => (t.isMe ? { ...t, interests } : t)),
  })),

  setMyAvailability: (availability) => set((s) => ({
    talents: s.talents.map((t) => (t.isMe ? { ...t, availability } : t)),
  })),

  submitToTask: (taskId, summary, link) => {
    const me = get().talents.find((t) => t.isMe);
    if (!me) return;
    set((s) => ({
      submissions: [
        ...s.submissions.filter((x) => !(x.taskId === taskId && x.talentId === me.id)),
        {
          id: `s-${Date.now()}`,
          taskId,
          talentId: me.id,
          summary,
          link,
          submittedAt: new Date().toISOString(),
        },
      ],
    }));
  },

  rateDecision: (decisionId, usefulness) => set((s) => ({
    decisions: s.decisions.map((d) => (d.id === decisionId ? { ...d, usefulness } : d)),
  })),

  selectTopThree: (taskId, top) => set((s) => {
    const updatedSubs = s.submissions.map((sub) => {
      if (sub.taskId !== taskId) return sub;
      const found = top.find((t) => t.id === sub.id);
      return { ...sub, rank: found?.rank };
    });

    const task = s.tasks.find((t) => t.id === taskId);
    let updatedTalents = s.talents;
    if (task) {
      const company = s.companies.find((c) => c.id === task.companyId);
      const totalEntries = updatedSubs.filter((x) => x.taskId === taskId).length;
      const winnerSubs = updatedSubs.filter((x) => x.taskId === taskId && x.rank);
      updatedTalents = s.talents.map((tal) => {
        const winner = winnerSubs.find((w) => w.talentId === tal.id);
        if (!winner || !company) return tal;
        if (tal.badges.some((b) => b.taskTitle === task.title && b.company === company.name)) return tal;
        return {
          ...tal,
          badges: [
            ...tal.badges,
            {
              id: `b-${Date.now()}-${tal.id}`,
              company: company.name,
              taskTitle: task.title,
              rank: winner.rank!,
              total: totalEntries,
              awardedAt: new Date().toISOString(),
            },
          ],
        };
      });
    }

    const updatedTasks = s.tasks.map((t) => (t.id === taskId ? { ...t, status: "closed" as const } : t));

    return { submissions: updatedSubs, talents: updatedTalents, tasks: updatedTasks };
  }),

  acceptTalent: (talentId, companyId, taskId) => set((s) => ({
    decisions: [
      ...s.decisions,
      {
        id: `d-${Date.now()}`,
        talentId,
        companyId,
        taskId,
        outcome: "accepted",
        createdAt: new Date().toISOString(),
        responseTimeHours: 24,
      },
    ],
  })),

  rejectTalent: (talentId, companyId, { tip, note, taskId }) => set((s) => ({
    decisions: [
      ...s.decisions,
      {
        id: `d-${Date.now()}`,
        talentId,
        companyId,
        taskId,
        outcome: "rejected",
        tip,
        note,
        createdAt: new Date().toISOString(),
        responseTimeHours: 24,
      },
    ],
  })),

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

export const MY_COMPANY_ID = myCompanyId;

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