# TagCreator - Smart Order Management

## Overview
TagCreator is a full-stack React application for efficient order management, featuring a modern interface for handling items, categories, suppliers, and order creation. It utilizes a hybrid storage system combining browser localStorage with a file-based backend for data persistence, ensuring data accessibility across browsers and devices with responsive user interactions. The project aims to streamline order processing, inventory management, and supplier coordination for businesses.

## User Preferences
I prefer iterative development with clear explanations for any significant changes. Please ask before making major architectural decisions or refactoring large portions of the codebase. I value clean, readable code and prefer functional components in React. Do not make changes to files related to deployment configurations without explicit instruction.

## System Architecture

### Frontend
The application is a React 18 application built with Vite and TypeScript. It uses `shadcn-ui` components (built on Radix UI) styled with Tailwind CSS for a modern, accessible, and responsive design. `React Router v6` manages client-side routing, and state management is handled by React Context API combined with TanStack Query for data fetching and caching. UI/UX features include dark mode support, mobile-responsive design with a burger menu, gradient backgrounds for category tags, and custom components like `QuantityInput`.

### Backend
An Express.js server (Node.js) on port 3001 manages CORS-enabled API endpoints. It handles reading and writing application data to JSON files stored in the `/data` directory, serving as the file-based persistence layer.

### Hybrid Storage System
The application employs a dual-layer storage approach:
1.  **Primary**: Browser `localStorage` for immediate reads/writes and offline functionality.
2.  **Secondary**: A backend API automatically synchronizes all changes to JSON files in the `/data` directory.
3.  **Auto-sync**: All data changes are debounced (500ms) and synced to the backend files in the background.
4.  **Fallback**: If the API is unavailable, the application continues to function using `localStorage` only.

**Data Files** (in `/data/` directory): `items.json`, `categories.json`, `suppliers.json`, `tags.json`, `settings.json`, `completed-orders.json`, `pending-orders.json`, `manager-tags.json`, `current-order.json`, `current-order-metadata.json`.

### Key Features
-   **Order Management**: Quick order creation using natural language parsing, bulk ordering, and a detailed workflow with status tracking (Hold, Pending, Processing, Received, Paid, Completed). Orders can be tagged with metadata (Order Type, Store, Payment Method, Manager) influencing summary templates.
-   **Item & Category Management**: Comprehensive browsing, filtering, and management of items and categories. Items support variant tags (Quantity, Supplier, Brand, Khmer Name) with distinct visual indicators. Categories can be grouped and filtered.
-   **Supplier Management**: Functionality to manage suppliers and associate them with items.
-   **Data Persistence**: Hybrid storage ensures data integrity and accessibility.
-   **UI/UX**: Modern and intuitive interface with a focus on efficient workflows, including mobile responsiveness and dark mode.
-   **Validation**: Zod is used for data validation across the application.
-   **Manager Sharing System**: Allows generating store-specific, read-only links for managers to view processing and completed orders.
-   **Invoice Attachment**: Supports attaching invoices via URL, file upload, or camera capture, with base64 storage.

### Technical Implementations & Design Choices
-   **Variant Tag System**: Items can have multiple colored variant tags (Quantity, Supplier, Brand, Khmer Name) for visual identification.
-   **Order Workflow**: Multi-stage order processing with conditional button states and status badges.
-   **Category Grouping & Filtering**: Collapsible category cards with filter buttons for predefined groups (Food, Beverages, Households).
-   **Fuzzy Matching & Parsing**: Enhanced parsing logic and Levenshtein distance for improved quick order creation.
-   **Dispatch Page**: Renamed from "Bulk", features automatic cleaning and checking of pasted item lists, and automatic detection of "Staff food" items for specific categorization and supplier assignment.

## External Dependencies

### Frontend
-   **Vite**: Build tool.
-   **React**: Frontend library.
-   **TypeScript**: Type-checking.
-   **React Router DOM**: Client-side routing.
-   **TanStack React Query**: Data fetching and caching.
-   **shadcn-ui**: UI component library.
-   **Tailwind CSS**: Styling framework.
-   **Lucide React**: Icon library.
-   **Zod**: Schema validation.

### Backend
-   **Express**: Web server framework.
-   **CORS**: Cross-origin resource sharing middleware.
-   **Node.js**: JavaScript runtime.