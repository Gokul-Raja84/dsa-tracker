"use client";
import type { DayData } from "./Tracker";

export default function DayCard({ 
  day, 
  isCompleted, 
  isToday, 
  onClick 
}: { 
  day: DayData; 
  isCompleted: boolean; 
  isToday: boolean;
  onClick: () => void;
}) {
  const tagColors: Record<string, { bg: string; text: string }> = {
    complexity: { bg: "var(--tag-complexity)", text: "var(--tag-complexity-text)" },
    patterns: { bg: "var(--tag-patterns)", text: "var(--tag-patterns-text)" },
    math: { bg: "var(--tag-math)", text: "var(--tag-math-text)" },
    hashing: { bg: "var(--tag-hashing)", text: "var(--tag-hashing-text)" },
    sorting: { bg: "var(--tag-sorting)", text: "var(--tag-sorting-text)" },
    recursion: { bg: "var(--tag-recursion)", text: "var(--tag-recursion-text)" },
    arrays: { bg: "var(--tag-arrays)", text: "var(--tag-arrays-text)" },
    revision: { bg: "var(--tag-revision)", text: "var(--tag-revision-text)" },
    review: { bg: "var(--tag-review)", text: "var(--tag-review-text)" }
  };
  
  const tagStyle = tagColors[day.tag] || tagColors.review;

  return (
    <div 
      onClick={onClick}
      className={`
        relative p-4 sm:p-5 h-36 flex flex-col justify-between cursor-pointer group glass-shimmer
        bg-surface transition-colors duration-300
        ${isToday ? 'border-[1.5px] border-dashed border-amber' : 'border border-border'}
        ${isCompleted && !isToday ? 'bg-primary/20 opacity-50 hover:opacity-100' : ''}
      `}
    >
       <div className="flex justify-between items-start">
         <div className="font-sans font-bold text-2xl text-white transition-transform duration-75 ease-out group-hover:scale-105 origin-top-left">
           {day.id}
         </div>
         {isCompleted && (
           <div className="text-success text-lg">✓</div>
         )}
       </div>

       <div>
         <div className="font-mono text-xs mb-2 leading-tight text-white/80 line-clamp-2">
           {day.topic}
         </div>
         <div 
           className="tag-chip inline-block px-2 py-0.5 font-mono text-[10px] uppercase font-bold"
           style={{ backgroundColor: tagStyle.bg, color: tagStyle.text }}
         >
           {day.tag}
         </div>
       </div>
    </div>
  );
}
