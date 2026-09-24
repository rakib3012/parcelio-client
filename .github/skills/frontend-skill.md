---
name: parcelio-frontend
description: Build and modify this Parcelio Vite React frontend using the repository architecture, readable code rules, and focused validation workflow.
---

# Parcelio Frontend Skill

Use this skill for every frontend coding task in this repository.

## Project Boundary

- This is a frontend-only Vite + React + TypeScript SPA.
- Use the dependencies and folder structure that already exist in the repository.
- Use React Router, Zustand, TanStack Query, Tailwind CSS, React Hook Form, and Zod according to existing project patterns.
- Do not introduce backend code, server components, server actions, middleware assumptions, or unrelated frameworks.

## Required Workflow

Before editing:

1. Read the relevant files and nearby implementation patterns.
2. Identify the smallest set of files that need to change.
3. Check for an existing component, hook, store, context, type, utility, or API pattern to reuse.
4. State a short implementation plan.

While editing:

1. Make the smallest correct change.
2. Keep page files in `src/pages/`.
3. Keep shared components in `src/components/` and UI primitives in `src/components/ui/`.
4. Keep layouts in `src/layouts/`.
5. Keep hooks in `src/lib/hooks/` and API hooks in `src/lib/hooks/api/`.
6. Keep stores in `src/lib/store/`, contexts in `src/lib/context/`, types in `src/lib/types/`, utilities in `src/lib/`, and routes in `src/route/`.
7. Keep API request logic outside page and component files.
8. Use TanStack Query for server-state requests and mutations when appropriate.
9. Use React Hook Form and Zod for forms when appropriate.

## Human-Readable Code Rules

Write code for a human developer to understand quickly.

- Prefer simple, direct logic over clever abstractions.
- Keep functions focused and reasonably small.
- Use full, meaningful names for variables, parameters, functions, interfaces, types, and components.
- Use names such as `user`, `index`, `average`, `response`, `userProfile`, and `loginRequest`.
- Never use single-letter names such as `a`, `b`, `c`, `i`, `x`, `y`, or `n`.
- Never use cryptic abbreviations such as `ind`, `avg`, `us`, `res`, `req`, `obj`, `arr`, or `tmp`.
- A name must explain what it stores, receives, does, or represents.
- Prefer clarity over abstraction and avoid premature optimization.
- Do not add comments that merely restate obvious code.

## React Simplicity Rules

Do not add optimization patterns by default.

- Use `useEffect` only for a real external side effect or synchronization requirement.
- Use `useMemo` only when an expensive calculation has a clear need for memoization.
- Use `useCallback` only when callback identity must remain stable for a specific reason.
- Use `React.memo` only when there is a demonstrated or clear rendering benefit.
- Do not use these patterns to make ordinary code appear more advanced.
- If one is necessary, keep the reason clear and preserve readability.

## Quality Rules

- Keep components typed, accessible, responsive, and focused.
- Handle loading, success, empty, error, and unauthorized states when relevant.
- Reuse existing UI patterns and icons before creating new ones.
- Do not use `any` or suppress TypeScript errors.
- Do not create duplicate API logic or duplicate UI primitives.
- Do not add a dependency unless the task requires it and the dependency is intentionally installed.

## Validation

After editing:

1. Run the narrowest relevant test, typecheck, lint, or build command available.
2. Fix errors caused by the change.
3. Review the final diff for unnecessary files, complexity, short names, and unused imports.
4. Confirm the existing Vite React architecture remains intact.
5. Report what changed and what validation was run.

If the requested behavior requires a backend change, describe the required API contract and stop instead of inventing backend code.
