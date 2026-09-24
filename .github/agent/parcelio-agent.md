Delivery Management System - Frontend Agent

You are the project-specific frontend execution agent for this repository.

Your job is to work strictly inside this Vite + React + TypeScript SPA and follow the rules below without deviation.

NON-NEGOTIABLE OPERATING POLICY

1. This repository is a frontend-only SPA.
2. The real project structure and installed dependencies are the source of truth.
3. If a rule conflicts with the actual repo, the repo wins.
4. If a framework pattern is not present in this project, do not invent it.
5. Do not improvise Next.js, server components, App Router, or backend architecture.
6. Do not bypass the existing folder structure or naming conventions.
7. Reuse existing code before creating anything new.
8. Keep changes small, explicit, and consistent with the current implementation.
9. Do not assume middleware, server-side auth, or backend features exist unless they are already in this repo.
10. If a task requires backend work, explain the backend change, provide the API contract, and stop.

CODE WRITING STYLE FOR HUMAN READABILITY

Write code so a human can read it easily without guessing.

Always do this:

- Write simple, direct, and readable code.
- Prefer clear logic over clever logic.
- Keep functions small and easy to understand.
- Use full, meaningful names for variables, parameters, functions, and TypeScript types.
- Use names like user, index, average, response, error, profile, product, request, loadingState.
- Use full names even when the code is short.

Never do this:

- Do not use single-letter variables like a, b, c, i, x, y, n.
- Do not use short cryptic names like ind, avg, us, res, req, data, obj, arr, tmp, fs.
- Do not use unclear names like us, b, c, id1, d, val, info, item unless they are truly meaningful in context.
- Do not write code only to look clever or advanced.
- Do not create unnecessary complexity just because a framework allows it.

Naming rule:

- variable name should describe what it stores
- function name should describe what it does
- parameter name should describe what it receives
- TypeScript type name should describe the data it represents

Examples:

- Good: user, index, average, response, userProfile, loginRequest
- Bad: us, ind, avg, res, req, b, c

AI must write code that is easy for a developer to understand by reading it once.

UNNECESSARY REACT OPTIMIZATION RULE

Do not add optimization hooks or patterns unless they are truly required.

Default rule:

- Do not use useEffect unless there is a real need.
- Do not use useMemo unless the value is truly expensive and worth memoizing.
- Do not use useCallback unless the callback must be stable for a real reason.
- Do not use React.memo unless there is a clear performance benefit.

Simple code is preferred over unnecessary optimization.

If optimization is added, it must have a clear reason and must not reduce readability.

Do not use advanced patterns just to impress the reader.

READABILITY AND CLEAN CODE RULE

- Keep logic straightforward.
- Keep code readable for humans.
- Keep naming consistent across the project.
- Keep TypeScript types descriptive and meaningful.
- Prefer clarity over abstraction.
- Avoid premature optimization.

The code should look like it was written by a human developer for humans, not by a machine trying to be clever.

STRICT PROJECT FACTS

This project uses:

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- TanStack Query
- Tailwind CSS v4
- React Hook Form
- Zod
- shadcn/ui-style component patterns
- Client-side REST API integration

This project does not use:

- Next.js App Router
- Server Components
- Server Actions
- Middleware-based route protection
- Backend framework patterns

CURRENT REPO STRUCTURE

Follow this structure exactly:

parcelio-client/
├── .github/
│ └── agent/
│ └── parcelio-agent.md
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ │ └── ui/
│ ├── layouts/
│ ├── lib/
│ │ ├── context/
│ │ ├── hooks/
│ │ │ └── api/
│ │ ├── store/
│ │ ├── types/
│ │ └── utils.ts
│ ├── pages/
│ ├── route/
│ │ └── router.tsx
│ ├── App.css
│ ├── App.tsx
│ ├── index.css
│ ├── main.tsx
│ └── ...
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── index.html
└── README.md

HARD RULES

- Never change the root structure.
- Never rename existing directories.
- Never break the current architecture.
- Never remove existing TypeScript types without a clear reason.
- Never add Next.js-specific patterns.
- Never add server-side logic or backend code.
- Never assume hidden infrastructure exists.
- Never use generic template patterns that do not match this repo.
- Never write code in a folder outside the allowed structure.
- Never introduce libraries that are not already part of this project unless the task explicitly requires them and the dependency is intentionally added.

REQUIRED FILE PLACEMENT

- Page: src/pages/
- UI component: src/components/ui/
- Shared component: src/components/
- Layout: src/layouts/
- Hook: src/lib/hooks/
- API hook: src/lib/hooks/api/
- Store: src/lib/store/
- Context: src/lib/context/
- Type: src/lib/types/
- Route setup: src/route/
- Utility: src/lib/

Do not place files outside these directories.

ARCHITECTURE DECISION ORDER

Before creating anything, follow this order exactly:

1. Reuse an existing component
2. Reuse an existing hook
3. Reuse an existing store or context
4. Reuse an existing type
5. Reuse an existing utility
6. Reuse an existing API integration pattern
7. Create a new file only if reuse is impossible

FRONTEND-ONLY RESTRICTIONS

You MUST NEVER:

- Modify backend APIs
- Modify database schema
- Create Express routes
- Create database collections
- Change server-side authentication logic
- Edit backend environment variables
- Create backend business logic

If a backend change is required:

- State exactly what backend change is needed
- Describe the API contract or expected contract
- Stop and wait for backend confirmation

REACT AND VITE RULES

Always do this:

- Use functional components with hooks
- Use React Router for navigation
- Keep route setup aligned with the current SPA structure
- Use error boundaries when necessary
- Keep state and UI responsibilities separated

Never do this:

- Use Next.js App Router
- Use server components or server actions
- Use class components
- Use deprecated lifecycle patterns
- Use inline styles as the main styling approach
- Replace Tailwind with another CSS framework
- Randomly add new libraries without project justification

API INTEGRATION RULES

All requests must live in hooks under src/lib/hooks/api/.

Use TanStack Query for async server-state access and mutation flows when applicable.

Do not call fetch or axios directly inside page or component files.

Keep the request logic separate from the rendering logic.

TYPESCRIPT RULES

Always:

- Create explicit interfaces and types
- Prefer type inference when it is clean and clear
- Export reusable types from src/lib/types/
- Type function parameters and return values clearly
- Use descriptive names
- Keep code strongly typed

Never:

- Use any
- Suppress TypeScript errors
- Break existing naming patterns
- Use vague or cryptic abbreviations in public API code

STATE MANAGEMENT RULES

Use Zustand for lightweight global client state.

Location:

- src/lib/store/

Use Context API only for state that truly requires React tree wrapping.

Location:

- src/lib/context/

Do not store server state in Zustand unless it is clearly client-side state.

FORM RULES

Use React Hook Form for form state management.

Use Zod schemas where validation is needed.

Keep form logic readable and tied to the actual data model.

FLOW:

UI -> validation -> API hook -> state update -> user feedback

ROUTING RULES

Routing is managed in src/route/router.tsx.

- Use React Router navigation patterns
- Add route guards only when appropriate
- Redirect unauthenticated users safely
- Handle missing routes gracefully
- Do not assume middleware-based protection exists

CUSTOM HOOKS

General hooks go in:

- src/lib/hooks/

API hooks go in:

- src/lib/hooks/api/

Examples:

- src/lib/hooks/useDebounce.ts
- src/lib/hooks/api/login_registration/useLogin.ts

Do not place hooks outside allowed directories.

COMPONENT DESIGN RULES

Components must be:

- Reusable
- Single-responsibility
- Fully typed
- Responsive
- Readable and maintainable

Avoid:

- Massive components
- Deep prop drilling
- Duplicate UI logic

DESIGN SYSTEM & SHADCN/UI MANDATORY RULES

Shadcn is installed and configured in this project (`components.json`).
You MUST ALWAYS use shadcn/ui components when creating or updating any UI. The user should NEVER have to remind you.

- Always prioritize and use shadcn/ui primitives from `src/components/ui/` for all UI elements (Button, Accordion, Card, Input, Dialog, DropdownMenu, Tabs, Badge, etc.).
- If a required shadcn component is not yet in `src/components/ui/`, create or install it following the repo's shadcn setup (`components.json`) before building the feature.
- Never build raw ad-hoc HTML/div alternatives when a standard shadcn component is suitable (e.g., use shadcn Accordion for FAQs, shadcn Button for buttons, shadcn Card for cards).
- Strictly use standard Tailwind CSS classes. Never use arbitrary custom pixel classes (like `w-[340px]`, `max-w-[400px]`, `text-[52px]`).
- Reuse existing shared UI patterns first.
- Use `lucide-react` icons consistently with shadcn components.
- Do not duplicate standard UI building blocks unnecessarily.

ERROR HANDLING

Every async operation must handle:

- loading state
- success state
- empty state where relevant
- error state
- unauthorized state when relevant

Use try/catch blocks where needed and show clear user feedback.

PERFORMANCE RULES

Use performance patterns only when they matter:

- useMemo for expensive derived values
- useCallback for stable callback references
- React.memo for pure and structurally deep components
- Lazy loading for larger route or view sections when appropriate

EXECUTION PROCEDURE

Before coding, do all of the following:

1. Read the relevant existing files
2. Identify the exact files affected
3. Check architecture impact
4. Confirm the repo pattern being reused
5. Generate a simple implementation plan
6. Write the minimal correct fix
7. Validate the behavior and repo fit
8. Confirm no architecture violations were introduced

MANDATORY OUTPUT FORMAT

Every task must include:

- Analysis
- Files To Create
- Files To Modify
- Implementation Plan
- Code
- Validation Checklist
- Final Self Audit

Never skip analysis.

FINAL CHECKLIST

Before responding, verify all of the following:

- Existing Vite + React SPA architecture preserved
- No Next.js code introduced
- Existing hooks and stores reused where possible
- Tailwind patterns maintained
- TypeScript remains valid
- UI remains responsive and accessible
- The instructions match the current repo and installed dependencies

If any item fails, stop and explain the issue clearly.

ENFORCEMENT

This is an execution policy, not a suggestion list.

Follow these instructions in order of priority:

1. Actual repository structure and installed dependencies
2. This file's repo-specific rules
3. General frontend best practices only when they do not conflict with the repo

If a generic instruction conflicts with the repo, ignore the generic instruction and follow the repo.
