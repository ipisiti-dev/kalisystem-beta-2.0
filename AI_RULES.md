# AI Rules for TagCreator - Kalisystem Interface

This document outlines the technical stack and specific library usage guidelines for AI agents contributing to the Kalisystem Interface project.

## Tech Stack Overview

*   **Frontend Framework:** React 18 with Vite for fast development and TypeScript for type safety.
*   **UI Component Library:** `shadcn/ui`, built on Radix UI primitives, providing accessible and customizable components.
*   **Styling:** Tailwind CSS for utility-first styling, ensuring a consistent and responsive design.
*   **Icons:** `lucide-react` for a comprehensive and customizable icon set.
*   **Routing:** React Router v6 for efficient client-side navigation.
*   **State Management:** React Context API for global state, complemented by TanStack Query for data fetching, caching, and synchronization.
*   **Data Validation:** Zod for robust schema validation across the application.
*   **Drag and Drop:** `@dnd-kit` library for implementing interactive drag-and-drop features.
*   **Toast Notifications:** `sonner` for elegant and user-friendly toast messages.
*   **Date Utilities:** `date-fns` for all date manipulation and formatting needs.
*   **Backend (for data persistence):** An Express.js (Node.js) server handles file-based data persistence, with Supabase integration for cloud synchronization.

## Library Usage Rules

To maintain consistency, performance, and readability, please adhere to the following guidelines when using libraries:

*   **UI Components (`shadcn/ui`):**
    *   Always prioritize using existing `shadcn/ui` components.
    *   If a component requires customization beyond what `shadcn/ui` offers, create a new component in `src/components/` that wraps or extends the `shadcn/ui` primitive. **Never modify `shadcn/ui` files directly.**
*   **Styling (`Tailwind CSS`):**
    *   All styling must be done using Tailwind CSS utility classes.
    *   Avoid inline styles or creating separate `.css` or `.module.css` files for components.
    *   Ensure designs are responsive by utilizing Tailwind's responsive utility classes.
*   **Icons (`lucide-react`):**
    *   Use icons exclusively from the `lucide-react` library.
*   **Routing (`React Router DOM`):**
    *   Manage all client-side routing using `react-router-dom`.
    *   Keep the main route definitions within `src/App.tsx`.
*   **State Management (`React Context API`, `TanStack Query`):**
    *   For global application state (e.g., items, categories, settings), use the `AppContext` and `CoreDataContext` providers.
    *   For data fetching, caching, and server-state management, use `TanStack Query`.
*   **Data Validation (`Zod`):**
    *   Implement `Zod` for all data schema validation, especially for form inputs and API interactions.
*   **Drag and Drop (`@dnd-kit`):**
    *   Any drag-and-drop functionality should be built using `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities`.
*   **Toast Notifications (`sonner`):**
    *   Use `sonner` for all user feedback notifications (success, error, info).
*   **Date Handling (`date-fns`):**
    *   Utilize `date-fns` for any date parsing, formatting, or manipulation tasks.
*   **Utility Functions:**
    *   General utility functions (e.g., `cn` for Tailwind class merging) should reside in `src/lib/utils.ts`.
*   **File Structure:**
    *   New components should be created in `src/components/`.
    *   New pages should be created in `src/pages/`.
    *   New hooks should be created in `src/hooks/`.
    *   Contexts are located in `src/contexts/`.
    *   Utility files are in `src/lib/`.
    *   Type definitions are in `src/types/`.
    *   Directory names must be all lower-case.