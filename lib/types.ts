export interface DayInfo {
  topic: string;
  tag: string;
  week: number;
}

export interface DayProgress {
  id: number;
  dayIndex: number;
  completed: boolean;
  completedAt: string | null;
  notes: string | null;
  leetcodeUrl: string | null;
  updatedAt: string;
}

export type TagName =
  | "complexity"
  | "patterns"
  | "math"
  | "hashing"
  | "recursion"
  | "sorting"
  | "arrays"
  | "revision"
  | "review";
