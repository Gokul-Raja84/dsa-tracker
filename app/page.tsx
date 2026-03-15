import { prisma } from "@/lib/prisma";
import Tracker from "@/components/Tracker";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const progress = await prisma.dayProgress.findMany({
    orderBy: { dayIndex: "asc" },
  });

  const serialized = progress.map((p) => ({
    ...p,
    completedAt: p.completedAt ? p.completedAt.toISOString() : null,
    updatedAt: p.updatedAt.toISOString(),
  }));

  // Removed accessPin from props as the app is for 'solo developer built for themselves' 
  // without SaaS features based on the new spec.
  return (
    <main className="min-h-screen relative overflow-x-hidden selection:bg-amber selection:text-black">
      {/* SVG Grain Filter Base (Tactile Craft Grain) */}
      <svg className="hidden">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.65" 
            numOctaves="3" 
            stitchTiles="stitch"
          />
        </filter>
      </svg>
      <div className="grain-overlay" style={{ filter: "url('#noiseFilter')" }}></div>

      <Tracker initialProgress={serialized} />
    </main>
  );
}
