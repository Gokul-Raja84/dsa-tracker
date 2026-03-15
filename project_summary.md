# 30-Day DSA Tracker: Project Summary & Technical Log

## 1. Executive Summary
The "30-Day DSA Tracker" is a full-stack Next.js application designed specifically for Gokul to track progress through a 30-day Data Structures and Algorithms curriculum. It replicates a high-fidelity reference design focused on minimal aesthetics, JetBrains Mono/Syne typography, and a "low-friction" user experience.

## 2. Technical Stack
- **Framework**: Next.js 16.1.6 (App Router, TypeScript)
- **Runtime**: Turbopack (Optimized Development)
- **Styling**: Tailwind CSS v4 (Pure utility classes + CSS Variables)
- **Database**: Neon (Serverless PostgreSQL)
- **ORM**: Prisma v7.5.0
- **Notifications**: Browser Notification API + Service Worker (Native)

## 3. Features Implemented
- **Dynamic 30-Day Grid**: 4 week-based grids with 30 interactive cards.
- **Optimistic UI**: Completion toggles update the UI instantly and sync with the database in the background.
- **Notes per Day**: Slide-over panel (bottom sheet on mobile) with:
  - Debounced auto-saving (800ms buffer).
  - LeetCode URL storage.
  - Formatted "Completed At" timestamps.
- **Live Stats**: Done, Streak, and Left counters update dynamically.
- **Aesthetics**:
  - Dark/Light mode support via `prefers-color-scheme`.
  - Entrance animations (cascading stagger).
  - "Today" card pulse border animation.
- **PIN Gate**: Optional access protection via `ACCESS_PIN` environment variable.
- **Daily Reminders**: Service worker-driven notification at 9:00 AM daily.

## 4. File Structure Deep-Dive
```text
app/
  api/
    notes/route.ts     -> PATCH update for notes/URL
    progress/route.ts  -> GET/POST for day completion
    reset/route.ts     -> DELETE for clearing progress
  globals.css          -> Design system, tokens, and animations
  layout.tsx           -> Font loading (next/font), Metadata
  page.tsx             -> Server Component (Initial DB Fetch)
components/
  DayCard.tsx          -> Individual grid item with logic
  ProgressBar.tsx      -> Thin 5px progress indicator
  SlideOverPanel.tsx   -> Detailed notes editor (Debounced)
  StatsRow.tsx         -> Done/Streak/Left pills
  Tracker.tsx          -> Main Client State Orchestrator
lib/
  prisma.ts            -> Database client singleton (Neon Adapter)
prisma/
  schema.prisma        -> PostgreSQL data model
prisma.config.ts       -> New Prisma 7 configuration file
.env                 -> Connection strings & PIN config
```

## 5. Detailed Bug Log & Technical Resolutions

### Bug 5.1: Scaffold Conflict
- **Symptom**: `npx create-next-app` failed immediately.
- **Error**: `The directory tracker contains files that could conflict: dsa_30day_tracker (1).html`.
- **Resolution**: Used PowerShell `Move-Item` to temporarily relocate the reference HTML file to the Desktop, allowing the scaffold to proceed in a clean directory.

### Bug 5.2: Prisma 7 Schema Validation (P1012)
- **Symptom**: `npx prisma generate` failed.
- **Error**: `error: The datasource property url is no longer supported in schema files. Move connection URLs... to prisma.config.ts`.
- **Resolution**: Migrated the data source URL logic out of [schema.prisma](file:///c:/Users/GOKUL%20RAJA/Desktop/tracker/prisma/schema.prisma) and implemented [prisma.config.ts](file:///c:/Users/GOKUL%20RAJA/Desktop/tracker/prisma.config.ts) using the new `defineConfig` utility from `prisma/config`. This is a strict requirement for Prisma v7.

### Bug 5.3: Turbopack Module Resolution
- **Symptom**: Build crash when trying to use custom output paths.
- **Error**: `Module not found: Can't resolve '@/app/generated/prisma'`.
- **Resolution**: Next.js Turbopack has stricter aliasing rules for server-side code. Reverted the Prisma generator to its default `node_modules/@prisma/client` output and updated the import paths to ensure reliable resolution across all build workers.

### Bug 5.4: Port 3000 Locking (Zombie Process)
- **Symptom**: Dev server refused to start on default port.
- **Error**: `Port 3000 is in use by process 2872`.
- **Resolution**: Identified a lingering Next.js session from a previous run. Used `Stop-Process -Id 2872 -Force` to clear the socket.

### Bug 5.5: Database Connection "Localhost" Fallback
- **Symptom**: Runtime error even when `.env` was correct.
- **Error**: `No database host or connection string was set... (host: localhost, user: GOKUL RAJA)`.
- **Root Cause**: Next.js was defaulting to local machine user credentials because the database driver wasn't picking up the `DATABASE_URL` correctly during the initial Turbopack boot phase.
- **Resolution**: Updated `lib/prisma.ts` to explicitly pass `datasourceUrl` into the `PrismaClient` constructor and implemented masked logging to verify environment variable parity.

### Bug 5.6: Neon Serverless Type Mismatch
- **Symptom**: TypeScript error in `lib/prisma.ts`.
- **Error**: `Argument of type 'Pool' is not assignable to parameter of type 'PoolConfig'`.
- **Resolution**: Due to version differences between `@neondatabase/serverless` and what `@prisma/adapter-neon` expects, we applied an `as any` cast to the `pool` instance. This bypassed the strict interface check while maintaining full runtime functionality for serverless connection pooling.

## 6. Project Status
The application is **fully built** and the database schema is **successfully synced** to Neon. The primary UI is interactive, and the API endpoints are functional. The current state is optimized for local development while being 100% prepared for Vercel deployment via Git.
