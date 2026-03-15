"use client";

import { useEffect, useState } from "react";

export function useCountUp(end: number, duration: number = 800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
}

export default function StatsRow({ done, streak, left, percentage }: { done: number, streak: number, left: number, percentage: number }) {
  const doneCount = useCountUp(done, 800);
  const streakCount = useCountUp(streak, 800);
  
  const progressBarColor = percentage < 34 ? "bg-amber" : percentage < 67 ? "bg-[#3b82f6]" : "bg-success";

  return (
    <>
      <div className="md:col-span-2 bg-surface border border-border p-6 flex flex-col justify-between">
        <div className="font-mono text-muted text-sm uppercase">Done</div>
        <div className="font-sans font-extrabold text-7xl text-amber">
          {doneCount}
        </div>
      </div>

      <div className={`md:col-span-2 bg-surface border p-6 flex flex-col justify-between transition-colors duration-400 ${streak >= 5 ? 'animate-pulse-amber' : 'border-border'}`}>
        <div className="font-mono text-muted text-sm uppercase flex items-center gap-2">
          Streak <span className="text-xl inline-block origin-bottom" style={{ animation: "flame 1.5s infinite ease-in-out alternate" }}>🔥</span>
        </div>
        <div className="font-sans font-extrabold text-7xl text-white">
          {streakCount}
        </div>
      </div>

      <div className="md:col-span-4 bg-surface border border-border p-6 flex flex-col justify-between">
        <div>
          <div className="font-mono text-muted text-sm uppercase flex justify-between">
            <span>Progress</span>
            <span>{left} days left</span>
          </div>
          <div className="font-sans font-bold text-5xl mt-4">
            {percentage}%
          </div>
        </div>
        <div className="w-full h-2 bg-primary mt-6 relative overflow-hidden">
           <div className={`absolute top-0 left-0 h-full transition-all duration-1000 ${progressBarColor}`} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </>
  );
}
