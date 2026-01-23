# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds Next.js App Router pages, layouts, and route groups (for example `app/today/page.tsx`).
- `app/api/` contains API route handlers.
- `components/` contains shared UI and feature components; `components/ui/` is the shadcn-style primitives layer.
- `lib/` stores helpers, lightweight stores, and utilities (for example `lib/journal-store.ts`).
- `public/` contains static assets.
- Configuration lives in `next.config.ts`, `eslint.config.mjs`, and `tsconfig.json`.

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` starts the Next.js dev server at `http://localhost:3000`.
- `npm run build` creates the production build.
- `npm run start` runs the production build locally.
- `npm run lint` runs ESLint.

## Coding Style & Naming Conventions
- TypeScript + React (Next.js App Router).
- Indentation uses 2 spaces; use double quotes and semicolons to match existing files.
- Tailwind CSS utility classes live in `className` strings; prefer shared patterns in `components/ui`.
- File names use kebab-case (for example `components/app-nav.tsx`); React components use PascalCase.

## Testing Guidelines
- No automated test runner is configured yet (there is no `test` script in `package.json`).
- If you add tests, co-locate them near the feature and add a script (for example `npm run test`) with brief instructions here.

## Commit & Pull Request Guidelines
- Commit messages are short, sentence-case summaries (for example `Add Gratitude page`).
- PRs should include: a brief summary, testing performed (or “not run”), and screenshots for UI changes.

## Architecture Overview
- App Router pages in `app/` render server components by default; client components are opt-in via `"use client"`.
- Feature flows live in route folders (`app/journal`, `app/gratitude`, `app/goals`, `app/today`) with shared UI in `components/`.
- Data is stored in lightweight local stores/helpers in `lib/` (no external database integration yet).

## Agent Notes
- Keep edits focused; avoid unrelated formatting churn.
- Update this guide if you introduce new scripts, directories, or workflows.
