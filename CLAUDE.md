# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reading Tracker is a full-stack Next.js 14 (App Router) application for tracking books, logging reading sessions, earning points, and collecting achievement badges. Uses TypeScript, Tailwind CSS, Prisma ORM with PostgreSQL (Neon in production), and custom session-based authentication. Deployed on Vercel.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint (Next.js defaults)
- `npm run seed` — Seed database with test user (test@example.com / testpass123) and sample data
- `npx prisma migrate dev` — Run database migrations
- `npx prisma generate` — Regenerate Prisma client (also runs automatically on `npm install` via postinstall)

No test framework is configured.

## Architecture

**Frontend pages** (`src/app/`): Next.js App Router with server components for data-fetching pages and `'use client'` components for interactive forms. Pages: dashboard (`/`), auth (`/login`, `/register`), books (`/books`, `/books/new`), reading log (`/log`), badges (`/badges`).

**API routes** (`src/app/api/`): Handle auth (`login`, `register`, `logout`), books (CRUD), and reading sessions (logging + badge awarding). All protected routes use `getCurrentUser()` from `src/lib/auth.ts`.

**Business logic** (`src/lib/`):
- `auth.ts` — bcrypt password hashing, session creation/validation via HTTP-only cookies (30-day expiry)
- `badges.ts` — 80+ badges across 7 categories with 4 tiers (bronze/silver/gold/platinum), threshold-based awarding
- `points.ts` — Points calculation (pages read + 50 bonus for book completion)
- `streaks.ts` — Reading streak calculation (consecutive days)
- `db.ts` — Singleton Prisma client

**Database** (`prisma/schema.prisma`): PostgreSQL (Neon in production) with models for User, Session (auth), Book, ReadingSession, and UserBadge. Requires `DATABASE_URL` environment variable (set automatically via Vercel). Path alias `@/*` maps to `./src/*`.

**Types** (`src/types/index.ts`): Shared types including `BookStatus`, `Genre` (23 genres in fiction/non-fiction/other groups), `BadgeTier`, `BadgeCategory`, and genre arrays/labels.

## Key Conventions

- Genre categorization matters: fiction, non-fiction, and other genres have separate badge mastery tracks defined in `src/types/index.ts`
- Badge awarding happens in the `POST /api/sessions` route after logging a reading session
- Books use string status values ("READING" / "COMPLETED"), not an enum
- Auth cookies use `sameSite: 'lax'`, secure only in production

## Deployment

Production URL: https://reading-tracker-eight-theta.vercel.app

Deployed on Vercel with Neon Postgres (database: `neon-blue-window`). Environment variables including `DATABASE_URL` are set automatically via the Vercel–Neon integration.

- `npx vercel --prod` — Deploy to production
- `npx vercel env pull .env.local` — Pull production env vars for local development
- `npx prisma db push` — Sync schema changes to the database
