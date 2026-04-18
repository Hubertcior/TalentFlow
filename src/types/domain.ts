/**
 * Domain types for the TalentFlow prototype.
 * All data lives client-side in the Zustand store seeded from `mockData`.
 */

export type Role = "talent" | "mentor";

export interface Skill {
  name: string;
  /** 0–10 self-rated proficiency */
  level: number;
}

export type Availability = "now" | "soon" | "busy";

export interface Badge {
  id: string;
  /** Company that issued the badge */
  company: string;
  /** Battle task that earned it */
  taskTitle: string;
  /** "Top X / N solutions" */
  rank: number;
  total: number;
  /** ISO date */
  awardedAt: string;
}

export interface Talent {
  id: string;
  name: string;
  initials: string;
  role: string; // headline e.g. "UI/UX + Frontend"
  bio: string;
  age: number;
  city: string;
  availability: Availability;
  portfolioUrl?: string;
  skills: Skill[];
  badges: Badge[];
  /** Whether this is the demo user's own card (only one) */
  isMe?: boolean;
}

export interface Company {
  id: string;
  name: string;
  /** Mentor display name representing the company in this prototype */
  mentorName: string;
  industry: string;
  /** Whether this is the demo mentor's company */
  isMe?: boolean;
}

export type TaskStatus = "open" | "judging" | "closed";

export interface BattleTask {
  id: string;
  companyId: string;
  title: string;
  brief: string;
  reward: string; // e.g. "Verified by Mentor + 500 PLN"
  status: TaskStatus;
  /** ISO due date */
  dueAt: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  taskId: string;
  talentId: string;
  /** One-paragraph approach */
  summary: string;
  link?: string;
  submittedAt: string;
  /** Set when mentor selects Top 3 */
  rank?: 1 | 2 | 3;
}

export type DecisionTip =
  | "Popracuj nad komunikacją w zespole"
  | "Podszkol framework, którego używamy (React)"
  | "Brak dopasowania kulturowego do zespołu"
  | (string & {});

export interface Decision {
  id: string;
  talentId: string;
  companyId: string;
  taskId?: string;
  /** "accepted" gives a badge, "rejected" requires a tip */
  outcome: "accepted" | "rejected";
  tip?: DecisionTip;
  /** Optional custom note from the mentor */
  note?: string;
  createdAt: string;
  /** Talent's rating of the feedback usefulness, 1–5 */
  usefulness?: number;
  /** Time in hours the mentor took to respond */
  responseTimeHours: number;
}
