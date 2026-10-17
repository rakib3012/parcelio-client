---
description: Mandatory rules for all tasks in the Parcelio client workspace.
globs: ["**/*"]
alwaysApply: true
---

# Parcelio Client — Agent Rules

## 1. Read Before You Write

Before every task:

1. Read the relevant agent file from `.github/agent/parcelio-agent.md`.
2. Read the relevant skills from `.github/skills/` (frontend, API integration, modern UI).
3. Inspect the existing implementation. Reuse existing components, hooks, stores, types, and utilities before creating new ones.

## 2. Project Identity

- Vite + React 19 + TypeScript SPA. **Not** Next.js, no server components, no server actions, no middleware.
- React Router v7 for routing.
- Zustand for client state. TanStack Query for server state.
- React Hook Form + Zod for forms.
- Tailwind CSS v4 + shadcn/ui (base-nova style) for design.
- Lucide React for icons. Geist / Urbanist fonts.
- Path alias: `@` → `./src`

## 3. File Placement — Strict

| Concern | Location |
|---|---|
| Pages | `src/pages/` |
| UI primitives (shadcn) | `src/components/ui/` |
| Feature/shared components | `src/components/<Feature>/` |
| Modals | `src/components/Modal/` |
| Layouts | `src/layouts/` |
| General hooks | `src/lib/hooks/` |
| API hooks | `src/lib/hooks/api/<domain>/` |
| Zustand stores | `src/lib/store/` |
| React contexts | `src/lib/context/` |
| TypeScript types | `src/lib/types/` |
| Utilities | `src/lib/` |
| Route config | `src/route/` |

Do not place files outside these directories.

## 4. Architecture Decision Order

1. Reuse existing component
2. Reuse existing hook
3. Reuse existing store or context
4. Reuse existing type
5. Reuse existing utility
6. Reuse existing API pattern
7. Create new **only** if reuse is impossible

## 5. Naming & Code Quality

- Use full, meaningful names: `user`, `index`, `response`, `userProfile`, `loginRequest`.
- **Never** use single-letter names (`a`, `b`, `i`, `x`) or cryptic abbreviations (`res`, `req`, `obj`, `arr`).
- Prefer simple direct logic over clever abstractions.
- Keep functions small and focused.
- Keep components typed, accessible, and responsive.

## 6. Component Architecture & One Component Per File (STRICT)

- **One Component Per File**: Every React component MUST live in its own separate, dedicated file.
- **NEVER declare multiple components in a single file**: No secondary components, helper components, card items, badge components, or icon components inside a page or parent component file. Extract every one of them to its own file in `src/components/<Feature>/` or `src/components/ui/`.
- **Modals in Dedicated `src/components/Modal/` Folder**: All modal dialogs (create/edit forms, confirmation dialogs, detail modals, status modals) MUST be defined in `src/components/Modal/` as separate files.
- **NEVER define inline modals in pages**: A page or parent component must only import the modal component from `src/components/Modal/` and pass open/close handlers and props.

## 7. React Rules

- Functional components with hooks only.
- **Do not** use `useEffect` unless there is a real external side effect.
- **Do not** use `useMemo` / `useCallback` / `React.memo` unless genuinely needed.
- **Do not** use `any` or suppress TypeScript errors.
- Handle all states: loading, success, empty, error, unauthorized.

## 8. shadcn/ui — Mandatory

- **Always** use shadcn components from `src/components/ui/` for standard UI elements.
- If a required primitive is missing, add it following `components.json` config before building the feature.
- Never build raw ad-hoc HTML when a shadcn primitive exists.
- **Strictly** use standard Tailwind classes — no arbitrary bracket values (`w-[340px]`, `text-[52px]`).

## 9. API Integration & One Hook Per File (STRICT)

- All API request logic lives in `src/lib/hooks/api/<domain>/`.
- **Strictly One Operation Per File**: Each API file MUST contain only ONE operation — one fetch function and its corresponding React Query hook (e.g. `getAllBookings.ts` contains `fetchAllBookings` + `useAdminBookings`; `updateBookingStatus.ts` contains `updateBookingStatus` + `useUpdateBookingStatus`).
- **NEVER combine multiple methods in a single file**: Do NOT create monolithic files with multiple endpoints (no generic `bookings.ts` containing GET all, GET one, and PATCH). Every method/operation must have its own separate file named after that specific operation.
- Every hook file **must** use named exports for BOTH the fetch function and the hook (e.g. `export const createUser = ...` and `export const useCreateUser = ...`).
- **No barrel re-exports**: Do not create or use barrel files (`index.ts` / `users.ts`) to re-export hooks. Components must import directly from the specific hook file.
- **Self-contained**: Each hook file must define its own types without importing domain types from sibling hook files.
- Use TanStack Query for fetching and mutations.
- **Never** call `fetch` or `axios` directly from page or component files.
- Define request/response types in `src/lib/types/` or directly inside the hook file.
- Handle loading, success, empty, error, and unauthorized states.

## 9. Routing & Auth

- All routes defined in `src/route/router.tsx`.
- Protected routes use `ProtectedRoute` → checks `useAuthStore.isAuthenticated`.
- Unauthenticated users are redirected to `/login` with location state.
- Three roles: `user` | `rider` | `admin`.

## 10. Design System

- CSS variables defined in `src/index.css` (oklch-based, neutral palette).
- Accent color: `#CAEA3C` (lime-green, used for avatar badges).
- Base radius: `0.625rem` with scaling variants.
- shadcn style: `base-nova`, icon library: `lucide`.
- Use Tailwind utility classes from the design system. Do not scatter raw colors.

## 11. Frontend-Only Boundary

- **Never** create backend code, Express routes, database logic, or server-side auth.
- If a feature needs backend work, describe the required API contract and stop.

## 12. Validation Checklist (Every Task)

- [ ] Existing architecture preserved
- [ ] No Next.js code introduced
- [ ] Existing hooks, stores, components reused where possible
- [ ] Tailwind patterns maintained, no arbitrary values
- [ ] TypeScript valid, no `any`
- [ ] UI responsive and accessible
- [ ] All async states handled
- [ ] shadcn components used for standard UI elements
