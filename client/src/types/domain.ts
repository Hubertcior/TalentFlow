/** Domain types for TalentFlow. Data is fetched from the backend API. */

export type Role = "talent" | "mentor";

export type Availability = "now" | "soon" | "busy";

export interface Badge {
  id: string;
  /** Company that issued the badge */
  company: string;
  /** Task that earned it */
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
  /** Headline / field, e.g. "Marketing & Komunikacja" */
  role: string;
  bio: string;
  age: number;
  city: string;
  availability: Availability;
  portfolioUrl?: string;
  /** Free-text interest tags, e.g. ["marketing cyfrowy", "social media"] */
  interests: string[];
  badges: Badge[];
  /** Whether this is the demo user's own card (only one at a time) */
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
  reward: string;
  status: TaskStatus;
  /** Industry category for filtering, e.g. "Marketing", "Prawo", "IT" */
  industry: string;
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
  | "Potrzebujesz więcej praktycznego doświadczenia w tej dziedzinie"
  | "Brak dopasowania do aktualnych potrzeb firmy"
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
