# 30-Day DSA Tracker

A modern, fast, and minimalistic 30-Day DSA Tracker, based on Striver's A2Z sheet. 

## Tech Stack
- **Next.js 14 (App Router)**
- **Tailwind CSS v4** (Utility-first styling matching original look & feel)
- **Prisma** (Database ORM)
- **Neon** (Serverless serverless PostgreSQL database driver)

## Prerequisites
- Node.js >= 18
- A free [Neon Database](https://neon.tech) (PostgreSQL)

## Setup Steps
1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Create a free Neon database.
   - Get the Postgres connection string from your Neon dashboard.
   - Rename `.env.example` to `.env.local` or `.env` and configure your `DATABASE_URL`.
   - Optionally, set `ACCESS_PIN` in your environment variables if you want to protect the tracker.

3. **Migrate Database**
   Push the schema to your Neon database:
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev --name init
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel
1. Push your code to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Under Environment Variables in Vercel settings, add your `DATABASE_URL`.
4. Run the deployment. 
*(The `postinstall` script in `package.json` will automatically generate Prisma Client on Vercel.)*

---
*Built for Gokul's DSA Journey // 2026*
