"use client";

import { useState, useCallback, useMemo } from "react";
import BentoHeader from "./BentoHeader";
import DayCard from "./DayCard";
import SlidePanel from "./SlidePanel";

export type DayProgress = {
  dayIndex: number;
  completed: boolean;
  completedAt: string | null;
  notes: string | null;
  leetcodeUrl: string | null;
  updatedAt: string;
}

export type TagName = 'complexity' | 'patterns' | 'math' | 'hashing' | 'recursion' | 'sorting' | 'arrays' | 'revision' | 'review';

export interface DayData {
  id: string; // "D01"
  index: number; // 0-29
  topic: string;
  tag: TagName;
  week: number;
}

const RAW_DATA = [
  "D01 Big O intro [complexity]",
  "D02 Time complexity drill [complexity]",
  "D03 Space complexity [complexity]",
  "D04 Patterns 1–5 [patterns]",
  "D05 Patterns 6–10 [patterns]",
  "D06 Patterns 11–15 [patterns]",
  "D07 Patterns 16–22 [patterns]",
  "D08 Recode 6 patterns [revision]",
  "D09 Count digits, reverse num [math]",
  "D10 Armstrong, palindrome [math]",
  "D11 GCD, prime check [math]",
  "D12 Freq map, hashing basics [hashing]",
  "D13 First/last occurrence [hashing]",
  "D14 Revision day [revision]",
  "D15 Factorial, fibonacci [recursion]",
  "D16 Sum of N, power(x,n) [recursion]",
  "D17 Bubble sort [sorting]",
  "D18 Selection sort [sorting]",
  "D19 Insertion sort [sorting]",
  "D20 Arrays: largest element [arrays]",
  "D21 Arrays: second largest [arrays]",
  "D22 Arrays: remove duplicates [arrays]",
  "D23 Arrays: rotate by K [arrays]",
  "D24 Arrays: move zeros [arrays]",
  "D25 Arrays: union/intersection [arrays]",
  "D26 Arrays: missing number [arrays]",
  "D27 Arrays: max consecutive 1s [arrays]",
  "D28 Kadane's algorithm [arrays]",
  "D29 Two sum, sort colors [arrays]",
  "D30 Full revision + mock [review]"
];

export const DAYS: DayData[] = RAW_DATA.map((str, i) => {
  const match = str.match(/(D\d{2})\s(.*?)\s\[(.*?)\]/);
  return {
    id: match![1],
    index: i,
    topic: match![2],
    tag: match![3] as TagName,
    week: i < 7 ? 1 : i < 14 ? 2 : i < 21 ? 3 : 4
  };
});

interface TrackerProps {
  initialProgress: DayProgress[];
}

export default function Tracker({ initialProgress }: TrackerProps) {
  const [progressMap, setProgressMap] = useState<Map<number, DayProgress>>(() => {
    const map = new Map<number, DayProgress>();
    initialProgress.forEach((p) => map.set(p.dayIndex, p));
    return map;
  });

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelDayIndex, setPanelDayIndex] = useState(0);

  const completedSet = useMemo(() => {
    const set = new Set<number>();
    progressMap.forEach((p, idx) => {
      if (p.completed) set.add(idx);
    });
    return set;
  }, [progressMap]);

  const done = completedSet.size;
  
  const currentStreak = useMemo(() => {
    let max = -1;
    for (let i = 29; i >= 0; i--) { 
      if (completedSet.has(i)) { max = i; break; } 
    }
    if (max === -1) return 0;
    
    let s = 0;
    for (let i = max; i >= 0; i--) { 
      if (completedSet.has(i)) s++; 
      else break; 
    }
    return s;
  }, [completedSet]);

  const handleToggle = useCallback(async (dayIndex: number) => {
    const current = progressMap.get(dayIndex);
    const newCompleted = !(current?.completed ?? false);

    setProgressMap((prev) => {
      const next = new Map(prev);
      const existing = next.get(dayIndex);
      next.set(dayIndex, {
        ...(existing || { dayIndex, notes: null, leetcodeUrl: null, updatedAt: new Date().toISOString() }),
        completed: newCompleted,
        completedAt: newCompleted ? new Date().toISOString() : null,
      } as DayProgress);
      return next;
    });

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayIndex, completed: newCompleted }),
      });
    } catch {
       // Silent failure/revert handling could go here
    }
  }, [progressMap]);

  const handleReset = useCallback(async () => {
    if (!confirm("Reset all 30 days of progress? This is permanent.")) return;
    try {
      await fetch("/api/reset", { method: "DELETE" });
      setProgressMap(new Map());
    } catch {}
  }, []);

  const handleRemind = useCallback(async () => {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
      alert("Notifications not supported in your browser.");
      return;
    }
    
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      try {
         const reg = await navigator.serviceWorker.register("/sw.js");
         reg.active?.postMessage({
           type: "SCHEDULE_REMINDER",
           data: { day: todayIndex + 1 }
         });
         alert("Daily reminder set for 9:00 AM.");
      } catch {
         // SW registration failed
      }
    } else {
      alert("Notification permission denied.");
    }
  }, []);

  // Today is the first uncompleted day
  const todayIndex = useMemo(() => {
    for (let i = 0; i < 30; i++) {
        if (!completedSet.has(i)) return i;
    }
    return 29;
  }, [completedSet]);

  const weeks = [1, 2, 3, 4] as const;

  return (
    <div className="w-full max-w-[1280px] mx-auto p-4 sm:p-8 xl:p-12 mb-20 relative z-10">
       <BentoHeader done={done} streak={currentStreak} />
       
       <div className="mt-16 space-y-16">
         {weeks.map((week, wIndex) => {
           const weekDays = DAYS.filter(d => d.week === week);
           const isComplete = weekDays.length > 0 && weekDays.every(d => completedSet.has(d.index));
           return (
             <div key={week} className="animate-week-label" style={{ animationDelay: `${wIndex * 150}ms` }}>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="font-sans text-muted text-sm sm:text-base tracking-[0.2em] uppercase origin-left">
                    :: WEEK 0{week} <span className="tracking-widest">—</span>
                  </h2>
                  {isComplete && <span className="text-success font-mono text-xs animate-pulse">// complete ✓</span>}
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                   {weekDays.map(day => (
                      <DayCard 
                        key={day.index} 
                        day={day} 
                        isCompleted={completedSet.has(day.index)}
                        isToday={todayIndex === day.index}
                        onClick={() => {
                          setPanelDayIndex(day.index);
                          setPanelOpen(true);
                        }}
                      />
                   ))}
                </div>
             </div>
           )
         })}
       </div>

       <div className="mt-20 pt-8 border-t border-border flex justify-between font-mono text-xs text-muted">
         <button onClick={handleReset} className="hover:text-amber transition-colors">[/ reset progress]</button>
         <button onClick={handleRemind} className="hover:text-amber transition-colors">[/ remind me daily]</button>
       </div>

       <SlidePanel 
         isOpen={panelOpen} 
         onClose={() => setPanelOpen(false)}
         day={DAYS[panelDayIndex]}
         progress={progressMap.get(panelDayIndex) || null}
         onToggle={() => handleToggle(panelDayIndex)}
         onSaveNotes={async (notes, url) => {
             setProgressMap(prev => {
                const next = new Map(prev);
                const cur = next.get(panelDayIndex) || { dayIndex: panelDayIndex, completed: false, completedAt: null, updatedAt: new Date().toISOString() } as DayProgress;
                next.set(panelDayIndex, { ...cur, notes, leetcodeUrl: url });
                return next;
             });
             await fetch("/api/notes", {
               method: "PATCH",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ dayIndex: panelDayIndex, notes, leetcodeUrl: url }),
             });
         }}
       />
    </div>
  )
}
