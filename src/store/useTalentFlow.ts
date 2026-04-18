import { create } from "zustand";
import type {
  Talent, Company, BattleTask, Submission, Decision, Skill, Availability,
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
  updateMySkills: (skills: Skill[]) => void;
  setMyAvailability: (a: Availability) => void;

  submitToTask: (taskId: string, summary: string, link?: string) => void;
  rateDecision: (decisionId: string, usefulness: number) => void;

  // Mentor actions
  selectTopThree: (taskId: string, top: { id: string; rank: 1 | 2 | 3 }[]) => void;
  acceptTalent: (talentId: string, companyId: string, taskId?: string) => void;
  rejectTalent: (talentId: string, companyId: string, opts: { tip: string; note?: string; taskId?: string }) => void;
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

  updateMySkills: (skills) => set((s) => ({
    talents: s.talents.map((t) => (t.isMe ? { ...t, skills } : t)),
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
    // Update submissions with new ranks
    const updatedSubs = s.submissions.map((sub) => {
      if (sub.taskId !== taskId) return sub;
      const found = top.find((t) => t.id === sub.id);
      return { ...sub, rank: found?.rank };
    });

    // Award badges to ranked talents (only for tasks owned by my company in this prototype)
    const task = s.tasks.find((t) => t.id === taskId);
    let updatedTalents = s.talents;
    if (task) {
      const company = s.companies.find((c) => c.id === task.companyId);
      const totalEntries = updatedSubs.filter((x) => x.taskId === taskId).length;
      const winnerSubs = updatedSubs.filter((x) => x.taskId === taskId && x.rank);
      updatedTalents = s.talents.map((tal) => {
        const winner = winnerSubs.find((w) => w.talentId === tal.id);
        if (!winner || !company) return tal;
        // Skip if already badged for this task (idempotency)
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
}));

export const MY_COMPANY_ID = myCompanyId;

/** Derived: mentor scoring for the leaderboard. */
export interface CompanyScore {
  companyId: string;
  companyName: string;
  mentorName: string;
  totalDecisions: number;
  feedbackRate: number; // 0–1, % of decisions that have a tip when rejected
  avgResponseHours: number;
  avgUsefulness: number; // 0–5
  score: number; // composite 0–100
  isTopEmployer: boolean;
}

export const selectCompanyScores = (state: TalentFlowState): CompanyScore[] => {
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

    // Composite score (0–100): weighting feedback rate, speed, usefulness.
    const speedScore = Math.max(0, 100 - avgResponseHours); // <1h=100, 100h=0
    const score =
      feedbackRate * 50 +
      (avgUsefulness / 5) * 30 +
      (speedScore / 100) * 20;

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
  return rows;
};
