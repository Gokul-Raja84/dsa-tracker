"use client";

import { useEffect, useState } from "react";
import StatsRow, { useCountUp } from "./StatsRow";

export default function BentoHeader({ done, streak }: { done: number; streak: number }) {
  const large30 = useCountUp(30, 800);
  const percentage = Math.round((done / 30) * 100);
  const left = 30 - done;

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 9) setGreeting("// early grind. respect.");
    else if (hour < 12) setGreeting("// morning session. lock in.");
    else if (hour < 17) setGreeting("// afternoon run. keep going.");
    else if (hour < 21) setGreeting("// evening grind. almost there.");
    else setGreeting("// late night mode. legendary.");
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Cell A */}
        <div className="md:col-span-4 bg-surface border border-border p-6 flex flex-col justify-center">
          <div className="font-sans font-extrabold text-[120px] leading-none rough-shadow text-white">
            {large30}
          </div>
          <div className="font-sans font-bold text-3xl tracking-wider mt-2">
            DAY DSA
          </div>
        </div>

        <StatsRow done={done} streak={streak} left={left} percentage={percentage} />
      </div>

      <div className="w-full bg-surface border border-border p-3 font-mono text-sm text-muted">
         {greeting || "// loading context..."}
      </div>
    </div>
  );
}
