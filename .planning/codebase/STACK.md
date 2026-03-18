# Technology Stack

**Analysis Date:** 2026-03-18

## Languages

**Primary:**
- TypeScript 5.x - Used across frontend and all backend services
- JavaScript (ES2022+) - Build scripts and config files

**Supporting:**
- HTML5 / JSX / TSX - Frontend React components and Next.js pages
- CSS / Tailwind CSS v4 - Styling (frontend only)

## Runtime

**Environment:**
- Node.js 20+ - Backend services and development tooling
- Browser ES2017+ - Frontend application (Next.js target)

**Package Manager:**
- npm 10.x - Monorepo with workspaces (frontend, backend services, shared packages)
- Lockfile: `package-lock.json` present

## Frameworks

**Frontend:**
- Next.js 16.1.6 - Server-side rendering, API routes, React 19 framework
- React 19.2.3 - Component library with hooks

**Backend:**
- Express 5.2.1 - HTTP server for all services (user-service, academy-service, course-service, media-service)

**Testing:**
- Vitest 4.1.0 - Unit tests (backend services use this, frontend uses for component testing)
- Playwright 1.58.2 - E2E tests (frontend only)
- Testing Library - React component testing utilities

**Build/Dev:**
- TypeScript Compiler (tsc) - Backend services compile to `dist/`
- tsx 4.21.0 - TypeScript watch mode for development
- Tailwind CSS 4 - Utility-first CSS framework
- Next.js Built-in - SWR/React Query patterns, Server Components
- ESLint 9 - Code linting (frontend)
- Shadcn UI 3.8.5 - Component library for frontend

## Key Dependencies

**Critical:**

- `@simplearn/middlewares` (file-linked) - Shared JWT validation and role-based access control middleware across backend services (`requireAuth`, `requireRole`)
- `jsonwebtoken` 9.0.3 - JWT token generation and verification
- `mongoose` 9.2.3+ - MongoDB ODM for user-service, academy-service, course-service
- `express` 5.2.1 - HTTP framework (all backend services)
- `zod` 4.3.6 - Schema validation for request bodies and configurations
- `axios` 1.13.5 - HTTP client for frontend service-to-backend communication
- `zustand` 5.0.11 - State management (frontend user store, persisted to localStorage)

**Authentication & Security:**

- `bcryptjs` 3.0.3 - Password hashing (user-service only)
- `cookie-parser` 1.4.7 - Parse HTTP cookie headers
- `cors` 2.8.6 - Cross-Origin Resource Sharing middleware
- `googleapis` 171.4.0 - Google OAuth 2.0 client (user-service only)

**Data & Forms:**

- `react-hook-form` 7.71.1 - Form state management (frontend)
- `@hookform/resolvers` 5.2.2 - Schema validation bridge for react-hook-form
- `@tanstack/react-query` 5.90.21 - Server state management (frontend)
- `@tanstack/react-table` 8.21.3 - Data table/grid component (frontend)

**File Upload & Media:**

- `multer` 2.0.1 - File upload middleware (media-service only)
- `cloudinary` 2.6.1 - Image hosting and CDN (media-service)
- `@supabase/supabase-js` 2.49.4 - Supabase client for document storage (media-service)

**UI & Components:**

- `@tiptap/react` 3.19.0 - Rich text editor (frontend)
- `@tiptap/starter-kit` 3.19.0 - TipTap editor plugins
- `tailwind-merge` 3.4.1 - Utility class conflict resolution
- `lucide-react` 0.564.0 - Icon library
- `sonner` 2.0.7 - Toast notifications
- `class-variance-authority` 0.7.1 - Component style composition
- `clsx` 2.1.1 - Conditional CSS class utility
- `@dnd-kit/core` 6.3.1 - Drag-and-drop primitives (frontend)
- `@dnd-kit/sortable` 10.0.0 - Sortable list implementation
- `@dnd-kit/utilities` 3.2.2 - DnD Kit utilities
- `next-themes` 0.4.6 - Theme provider (light/dark mode support)
- `radix-ui` 1.4.3 - Unstyled accessible component primitives
- `@tailwindcss/typography` 0.5.19 - Prose/typography plugin

**Logging & Monitoring:**

- `morgan` 1.10.1 - HTTP request logging middleware
- `winston` 3.19.0 - Structured logging (referenced but may not exist as separate package; use winston directly)

**Utilities:**

- `dotenv` 17.3.1 - Environment variable loading
- `ts-node` 10.9.2 - Execute TypeScript directly (development only)

## Configuration

**Environment:**

All services load `.env` files via `dotenv/config`. Environment variables are NOT committed; use `.env.example` templates:

- `frontend/.env.example` - Frontend service URLs and Google Client ID
- `backend/user-service/.env.example` - Database, JWT secrets, Google OAuth credentials
- `backend/academy-service/.env` - Database URI only
- `backend/course-service/.env` - Database URI and JWT secret
- `backend/media-service/.env` - Cloudinary and Supabase credentials, JWT secret

**Key Variables:**

- `MONGODB_URI` - Local or Atlas MongoDB connection string
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` - Symmetric keys for JWT signing
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - OAuth 2.0 credentials
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Image hosting
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_BUCKET` - Document storage
- `NEXT_PUBLIC_*` - Frontend-exposed variables (hardcoded into build)
- `PORT` - Service port (default 8001-8004)

**Build:**

- Frontend: `tsconfig.json` targets ES2017, uses bundler moduleResolution, no emit (Next.js handles compilation)
- Backend: `tsconfig.json` targets ES2022, NodeNext module resolution, compiles to `dist/` directory
- Shared middleware: `tsconfig.json` compiles TypeScript to `dist/`, consumed by backend services via `file:../shared/middlewares`

## Platform Requirements

**Development:**

- Node.js 20+
- npm 10+
- MongoDB server (local or remote)
- Cloudinary account and credentials
- Supabase project and credentials
- Google OAuth application credentials

**Production:**

- Node.js 20+ runtime
- MongoDB Atlas (cloud) or self-hosted
- Cloudinary (SaaS)
- Supabase (SaaS)
- Frontend: Next.js server or static export + CDN
- Backend services: Node.js servers or containers (no Docker config currently)

---

*Stack analysis: 2026-03-18*
