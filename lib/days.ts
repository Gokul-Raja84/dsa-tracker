import type { DayInfo, TagName } from "./types";

export const DAYS: DayInfo[] = [
  { topic: "Big O intro", tag: "complexity", week: 1 },
  { topic: "Time complexity drill", tag: "complexity", week: 1 },
  { topic: "Space complexity", tag: "complexity", week: 1 },
  { topic: "Patterns 1–5", tag: "patterns", week: 1 },
  { topic: "Patterns 6–10", tag: "patterns", week: 1 },
  { topic: "Patterns 11–15", tag: "patterns", week: 1 },
  { topic: "Patterns 16–22", tag: "patterns", week: 1 },
  { topic: "Recode 6 patterns", tag: "revision", week: 2 },
  { topic: "Count digits, reverse num", tag: "math", week: 2 },
  { topic: "Armstrong, palindrome", tag: "math", week: 2 },
  { topic: "GCD, prime check", tag: "math", week: 2 },
  { topic: "Freq map, hashing basics", tag: "hashing", week: 2 },
  { topic: "First/last occurrence", tag: "hashing", week: 2 },
  { topic: "Revision day", tag: "revision", week: 2 },
  { topic: "Factorial, fibonacci", tag: "recursion", week: 3 },
  { topic: "Sum of N, power(x,n)", tag: "recursion", week: 3 },
  { topic: "Bubble sort", tag: "sorting", week: 3 },
  { topic: "Selection sort", tag: "sorting", week: 3 },
  { topic: "Insertion sort", tag: "sorting", week: 3 },
  { topic: "Arrays: largest element", tag: "arrays", week: 3 },
  { topic: "Arrays: second largest", tag: "arrays", week: 3 },
  { topic: "Arrays: remove duplicates", tag: "arrays", week: 4 },
  { topic: "Arrays: rotate by K", tag: "arrays", week: 4 },
  { topic: "Arrays: move zeros", tag: "arrays", week: 4 },
  { topic: "Arrays: union/intersection", tag: "arrays", week: 4 },
  { topic: "Arrays: missing number", tag: "arrays", week: 4 },
  { topic: "Arrays: max consecutive 1s", tag: "arrays", week: 4 },
  { topic: "Kadane's algorithm", tag: "arrays", week: 4 },
  { topic: "Two sum, sort colors", tag: "arrays", week: 4 },
  { topic: "Full revision + mock", tag: "review", week: 4 },
];

export const TAG_COLORS: Record<TagName, string> = {
  complexity: "#378ADD",
  patterns: "#1D9E75",
  math: "#BA7517",
  hashing: "#D4537E",
  recursion: "#7F77DD",
  sorting: "#D85A30",
  arrays: "#639922",
  revision: "#888780",
  review: "#888780",
};

export const WEEK_LABELS: Record<number, string> = {
  1: "// week 1 — complexity + patterns",
  2: "// week 2 — math + hashing + recursion",
  3: "// week 3 — sorting + arrays easy",
  4: "// week 4 — arrays medium + hard + review",
};
