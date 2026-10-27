# Project Guidelines & Architecture Standards

## 1. Authentication & Role-Based Access Control (RBAC)

### A. Route Protection Architecture
- **`RoleBasedRoute`**: The primary, centralized route guard for protected role-based areas (`/admin`, `/rider`, `/user_dashboard`).
  - Handles:
    1. Checking for accessToken (Cookies or localStorage fallback).
    2. Session rehydration / fetching user from `/api/auth/me` if not in Zustand store.
    3. Showing accessible loading spinners while verifying.
    4. Token expiry / API failure handling (logs out and redirects to `/login`).
    5. Role authorization (`allowedRoles.includes(currentUser.role)`).
    6. Redirecting unauthorized users to their own role dashboard.
- **`ProtectedRoute`**: Kept exclusively for authenticated routes that any logged-in user can visit regardless of role (e.g., general account settings, user profile).

### B. Single Source of Truth for Role Navigation
- All role-to-path resolution **must** go through `getRoleDestination(role)` in `@/lib/utils/roleCheckFunction.ts`.
- **Never** hardcode ternary role checks (e.g., `role === 'admin' ? '/admin' : ...`) across components or pages.
- Used consistently in:
  - `RoleBasedRoute.tsx` (unauthorized role fallback)
  - `LoginPage.tsx` (auto-redirect & post-login redirect)
  - `SingupPage.tsx` (auto-redirect & post-signup redirect)

---

## 2. Fast Refresh & Module Export Rules

- **`react-refresh/only-export-components`**:
  - React component files (`.tsx`) **must only export React components**.
  - **Never** export helper functions, constants, or utility objects from a component file.
  - If a function or constant is needed only inside that component file, declare it locally **without** `export`.
  - If a function or constant is shared across multiple files, place it in a dedicated utility file (e.g., `src/lib/utils/...`) and export it from there.

---

## 3. State Management & TypeScript

- Use Zustand (`authStore.ts`) for client authentication state (`isAuthenticated`, `currentUser`, `login`, `logout`).
- Ensure strict TypeScript typing using types defined in `@/lib/types/auth.ts` (`User["role"]`).
