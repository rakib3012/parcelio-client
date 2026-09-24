---
name: modern-ui
description: "Use when building or improving modern Parcelio UI pages, dashboards, data tables, responsive layouts, filters, pagination, loading states, and accessible interactions."
---

# Modern UI Skill

Use this skill for modern, production-ready UI work in the Parcelio Vite + React frontend.

## Design Direction

Build interfaces that feel intentional, clean, modern, and easy to scan.

- Use the existing Geist font, Tailwind CSS v4, shadcn-style components, Base UI primitives, and Lucide icons.
- Reuse existing components before creating new primitives.
- Use CSS variables and the existing color system instead of scattering raw colors.
- Use restrained borders, clear spacing, readable contrast, and consistent visual hierarchy.
- Use small motion only for meaningful loading, reveal, hover, and state transitions.
- Do not create decorative UI that reduces clarity or makes the workflow slower.
- Do not use excessive gradients, oversized headings, unnecessary glass effects, or crowded cards.
- Keep card corners, shadows, spacing, and control sizes consistent throughout the page.

## Required UI States

Every page or data view must consider the states that apply:

- loading state with a skeleton or clear progress indicator
- successful state with the real content
- empty state with a useful message and next action when appropriate
- error state with clear recovery feedback
- unauthorized state when authentication is required
- disabled and pending states for actions

Do not leave blank space, broken layouts, or silent failures when data is loading or unavailable.

## Data Table Requirements

For every table that displays a collection of data, include these controls unless the task clearly does not need them:

- Show the total number of records above the table, such as `Total: 128`.
- Show a `Rows per page` selector above or beside the table.
- Show pagination below the table.
- Display the current range, such as `Showing 1-10 of 128`.
- Provide previous and next controls.
- Disable previous on the first page and next on the last page.
- Provide page numbers when the number of pages is reasonable.
- Use ellipsis for large page ranges instead of rendering every page number.
- Preserve the selected rows-per-page value while changing pages.
- Reset to the first page when search, filters, or sorting changes the result set.
- Keep table headers visible and descriptive.
- Use a stable table layout so content does not cause controls to jump.
- Show a useful empty state inside the table area when no records match.
- Make the table horizontally scrollable on small screens without breaking the page.

If pagination is server-side, keep page, limit, search, filter, and sort values in the query state and request only the required page. If pagination is client-side, clearly separate the complete collection from the visible page rows.

## Table Accessibility

- Use semantic `table`, `thead`, `tbody`, `tr`, `th`, and `td` elements.
- Associate headers with their columns.
- Use accessible labels for pagination, rows-per-page, search, filters, and icon-only buttons.
- Use tooltips for unfamiliar icon-only controls.
- Preserve keyboard focus and visible focus styles.
- Do not rely on color alone to communicate status.
- Use status text or badges with sufficient contrast.
- Keep action labels understandable to screen readers.

## Page Layout Rules

- Start with a clear page title and concise supporting context when needed.
- Put primary actions where users expect them, usually near the title.
- Group search, filters, and sorting controls in a clear toolbar above the data.
- Keep related controls together and avoid mixing unrelated actions.
- Use responsive layouts that work on mobile, tablet, and desktop.
- Keep important actions reachable on narrow screens.
- Avoid placing cards inside cards unless the inner element is a genuinely framed tool or repeated item.
- Use consistent maximum widths and page padding.
- Do not let long text overlap controls or force unexpected layout shifts.

## Controls and Interaction

- Use familiar icons from `lucide-react` inside buttons when an icon exists.
- Use icon-only buttons for familiar compact actions and provide accessible labels and tooltips.
- Use text or icon-plus-text buttons for important or unfamiliar commands.
- Use select controls for rows per page and finite option sets.
- Use checkboxes or switches for binary settings.
- Use tabs for related views.
- Use confirmation dialogs for destructive actions when accidental activation is possible.
- Show feedback after save, delete, update, export, or other important actions.
- Prevent duplicate submissions while an action is pending.

## React Simplicity

Keep UI code readable and avoid unnecessary optimization.

- Do not use `useEffect` for values that can be calculated during render.
- Do not use `useMemo` unless a calculation is genuinely expensive.
- Do not use `useCallback` unless callback identity is required for a specific reason.
- Do not use `React.memo` without a clear rendering benefit.
- Prefer simple state and direct event handlers.
- Keep table, pagination, filter, and toolbar responsibilities understandable.

## Naming and Code Quality

- Use full meaningful names for variables, functions, props, parameters, and types.
- Use names such as `totalRecords`, `rowsPerPage`, `currentPage`, `searchQuery`, `visibleRows`, and `paginationRange`.
- Never use single-letter names such as `a`, `b`, `c`, `i`, `x`, or `n`.
- Never use cryptic names such as `ind`, `avg`, `res`, `req`, `obj`, `arr`, or `tmp`.
- Split large page components into focused components when that improves readability.
- Keep reusable table, pagination, filter, and status UI in appropriate shared component locations.
- Do not add comments that merely repeat what obvious code does.

## Responsive Behavior

Verify at minimum:

- desktop layout with full table controls
- tablet layout with compressed spacing
- mobile layout with horizontal table scrolling and usable controls

On mobile:

- keep the page title and primary action usable
- allow filters to wrap or collapse cleanly
- keep rows-per-page and pagination controls readable
- avoid tiny text and impossible tap targets
- prevent controls from overflowing their container

## Validation Checklist

Before finishing modern UI work, verify:

- total record count is visible above each applicable table
- rows-per-page control is present and functional
- pagination is below the table and functional
- previous and next buttons have correct disabled states
- filtering and searching reset pagination correctly
- loading, empty, error, and success states are handled
- tables are accessible and keyboard usable
- layout works on desktop and mobile
- no text or controls overlap
- names are descriptive and readable
- unnecessary React optimization hooks were not added
- existing project components and styles were reused where possible
- the narrowest available lint, typecheck, test, or build command passes
