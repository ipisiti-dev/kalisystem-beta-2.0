# Copilot Instructions for TagCreator Order Up

## Project Overview
- **TagCreator Order Up** is a Vite + React + TypeScript web app for smart order management, tag-based item sorting, and supplier workflows.
- UI is built with [shadcn-ui](https://ui.shadcn.com/) (Radix UI primitives), styled via Tailwind CSS.
- Data flows are centered around items, tags, suppliers, and bulk order management.

## Architecture & Key Patterns
- **src/** contains all source code, organized by feature:
  - `components/` (UI, forms, cards)
  - `order-portal/` (role-based dashboards)
  - `pages/` (route-level views)
  - `contexts/` (global app state)
  - `lib/` (utilities, data parsing, storage)
  - `types/` (TypeScript types)
- **Routing**: Uses React Router DOM. Pages are in `src/pages/`.
- **State Management**: Context API (`AppContext.tsx`) for global state (tags, managers, orders).
- **Data**: Default data in `default-data.json`, large exports in `tagcreator-export-*.json`.
- **Aliases**: Use `@/` for imports (see `tsconfig.json` and `components.json`).
- **UI Conventions**: All custom UI components follow the `displayName` pattern and are exported as named exports.
- **Bulk Order Flow**: See `order-refactor-plan.txt` for current refactor steps and requirements.

## Developer Workflows
- **Install dependencies**: `npm i`
- **Start dev server**: `npm run dev` (port 5000)
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Lint**: `npm run lint`
- **Deploy**: Use Lovable or follow README instructions.
- **Replit**: `.replit` and `replit.md` document cloud workflows and recent changes.

## Project-Specific Conventions
- **Manager tags**: Always start with `@` (see `Tags.tsx` for validation logic).
- **Supplier/Order defaults**: Validate non-nullable fields and show UI feedback (see `order-refactor-plan.txt`).
- **UI exports**: All UI primitives (e.g., `dropdown-menu.tsx`, `sheet.tsx`) use named exports and `displayName` for clarity.
- **Aliases**: Use `@/components`, `@/lib`, `@/hooks`, etc. for imports.
- **Tailwind**: Config in `tailwind.config.ts`, styles in `src/index.css`.

## Integration Points
- **External dependencies**: Vite, React, shadcn-ui, Tailwind, Zod, Lucide, React Query, DnD Kit, etc. (see `package.json`).
- **Component tagging**: Uses `lovable-tagger` plugin in Vite config for component tracking.
- **Role-based dashboards**: `order-portal/` contains separate dashboards for admin, manager, supplier.

## Examples
- **Add Manager Tag**: See `Tags.tsx` for username validation and toast feedback.
- **Bulk Order Refactor**: See `order-refactor-plan.txt` for current architectural changes and workflow.
- **UI Component Pattern**: All custom UI components (e.g., `dropdown-menu.tsx`) use `React.forwardRef`, named exports, and `displayName`.

## References
- `README.md`, `replit.md`, `.replit`, `order-refactor-plan.txt`, `components.json`, `tsconfig.json`, `vite.config.ts`

---

**Feedback requested:**
- Are any workflows, conventions, or architectural details unclear or missing?
- Is there a specific area (orders, tags, supplier flows) that needs deeper documentation for AI agents?
