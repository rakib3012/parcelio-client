---
name: parcelio-api-integration
description: Implement REST API integration in the Parcelio Vite React frontend using typed domain hooks, TanStack Query, readable names, and complete request states.
---

# Parcelio API Integration Skill

Use this skill when adding, changing, or debugging frontend API integration.

## Scope

This skill applies only to the frontend API layer. The repository is a Vite + React + TypeScript SPA.

- Keep API hooks under `src/lib/hooks/api/`.
- Keep authentication hooks under `src/lib/hooks/api/login_registration/`.
- Keep user hooks under `src/lib/hooks/api/user/`.
- Keep shared request and response types under `src/lib/types/`.
- Keep page and component files responsible for rendering, not request implementation.
- Do not create backend routes, database logic, server actions, or middleware.

## Before Coding

1. Read the related API hook, page, component, type, and route files.
2. Search for an existing request pattern before creating a new one.
3. Confirm the endpoint, HTTP method, request body, query parameters, response shape, and error shape.
4. Reuse existing API utilities, query keys, authentication handling, and types.
5. If the backend contract is missing or unclear, state the assumption. Do not invent backend behavior silently.

## Implementation Rules

- Use TanStack Query for server-state fetching and mutations when applicable.
- Keep request logic inside a reusable hook or API-layer helper under `src/lib/hooks/api/`.
- Do not call `fetch` or `axios` directly from a page or UI component.
- Keep query keys stable, descriptive, and related to the resource.
- Use the correct mutation for create, update, and delete operations.
- Invalidate or update related queries after a successful mutation when needed.
- Keep authentication headers and credentials consistent with existing project behavior.
- Do not duplicate endpoint strings, request logic, or response transformations.
- Do not add a new HTTP client or dependency unless the task explicitly requires it and it is intentionally installed.

## Types

- Define request, response, and error types clearly.
- Put reusable types in `src/lib/types/`.
- Use descriptive names such as `LoginRequest`, `UserProfileResponse`, and `UpdateUserRequest`.
- Never use `any` or suppress TypeScript errors.
- Do not hide an unknown response shape with unsafe casting.
- Keep the type model aligned with the real API contract.

## Human-Readable Code

Write API code that a developer can understand without guessing.

- Use full meaningful names such as `response`, `userProfile`, `requestBody`, `queryKey`, and `errorMessage`.
- Never use single-letter names such as `a`, `b`, `c`, `i`, `x`, or `n`.
- Never use cryptic names such as `res`, `req`, `data`, `obj`, `arr`, `tmp`, `ind`, or `avg`.
- Name hooks after the operation they perform, such as `useUserProfile` or `useUpdateUser`.
- Prefer direct logic over clever abstractions.
- Keep transformations small and easy to follow.

## React Rules

Do not add React optimization patterns to API hooks without a real reason.

- Do not use `useEffect` for fetching data that TanStack Query should manage.
- Do not use `useMemo` unless a transformation is genuinely expensive.
- Do not use `useCallback` unless callback identity must remain stable for a specific reason.
- Do not use `React.memo` for request handling.

## Required UI States

Expose and handle the states relevant to each request:

- loading or pending
- success
- empty response where applicable
- error
- unauthorized or expired authentication where applicable

The UI must not silently fail. Show a clear user-facing message while keeping technical details out of normal user feedback.

## Mutation Flow

Use this flow for mutations:

1. Validate input before sending when appropriate.
2. Call the typed API mutation hook.
3. Prevent duplicate submission while pending.
4. Handle success feedback.
5. Refresh or update affected server state.
6. Handle and display errors clearly.

## Validation

After changing API code:

1. Run the narrowest relevant typecheck, lint, test, or build command.
2. Confirm imports and exported types are correct.
3. Check that query keys and invalidation behavior are correct.
4. Confirm loading, success, empty, error, and unauthorized states are handled.
5. Review the diff for duplicate request logic, unsafe types, unnecessary hooks, and unclear names.

If the requested feature requires a backend change, document the required endpoint contract and stop instead of writing backend code.
