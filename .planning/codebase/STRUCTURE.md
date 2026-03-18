# Codebase Structure

**Analysis Date:** 2026-03-18

## Monorepo Overview
The project is a monorepo containing a frontend Next.js application and a suite of backend microservices.

## Backend Services (`backend/`)
- `auth-service/`: Manages authentication and user sessions.
- `course-service/`: Handles course creation, curriculum management, and enrollment logic.
- `academy-service/`: Core academy management logic.
- `media-service/`: Specialized service for media uploads (Cloudinary, Supabase).
- `user-service/`: Manages user profiles and RBAC.
- `shared/`: Common logic used across services.
  - `middlewares/`: Authentication, RBAC, and error handling.
  - `logger/`: Shared logging utilities.

## Frontend Architecture (`frontend/`)
- `app/`: Next.js App Router structure.
  - `(auth)/`: Login, registration routes.
  - `admin/`: Admin-specific dashboards and tools.
  - `instructor/`: Instructor-specific course management.
  - `student/`: Student-specific learning experience.
- `components/`: UI components.
  - `features/`: Domain-specific components (Auth, Courses, etc.).
  - `shared/`: Reusable cross-feature components.
  - `ui/`: Core design system components (Shadcn UI).
- `hooks/`: Custom React hooks for API interaction (`use-courses.ts`, `use-media.ts`).
- `store/`: Zustand stores for global state (`user.store.ts`).
- `lib/`: Utility functions and shared services.
- `types/`: Global and domain-specific TypeScript definitions.
- `tests/`: Testing directory.
  - `unit/`: Vitest unit and integration tests.
  - `e2e/`: Playwright end-to-end tests.

## Root Configuration
- `gemini.md`: Core project documentation and instructions.
- `.planning/`: Project management and codebase analysis documents.
- `.playwright-mcp/`: Playwright MCP configuration.
