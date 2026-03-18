# Codebase Conventions

**Analysis Date:** 2026-03-18

## Naming Conventions
- **Frontend Components:** `kebab-case.tsx` in `components/ui` and `features`.
- **Backend Layers:** `dot.notation.ts` (e.g., `auth.controller.ts`, `auth.service.ts`).
- **Variables & Functions:** `camelCase` (e.g., `const userData`, `function handleAuth()`).
- **Types & Interfaces:** `PascalCase` (e.g., `type UserProfile`, `interface AuthResponse`).

## Code Style
- **Frontend:** Next.js App Router (React 19), Tailwind CSS v4. Use of `cn` utility for conditional styling and Radix UI-based components (Shadcn UI).
- **Backend:** Controller-Service-Model architecture. Express 5.x for API development.
- **Shared Logic:** Common Express middlewares (Auth, RBAC) extracted into `@simplearn/middlewares` shared package.
- **Validation:** Extensive use of `zod` for request and response validation on both frontend and backend.

## State Management
- **Zustand:** Global client-side state (e.g., `user.store.ts`).
- **TanStack Query:** Server-side state and caching for data fetching.

## TypeScript Standards
- **Strict Typing:** Avoid `any`. Interfaces preferred over types for data objects.
- **Global Types:** Located in `frontend/types/` or `backend/@types/`.
- **Enums:** Used for status values and role types (STUDENT, INSTRUCTOR, ADMIN).

## Error Handling
- **Backend:** Global error handler middleware used for consistent JSON error responses (`{ message: string }`).
- **Frontend:** Use of `sonner` for toast notifications and `React Hook Form` for form-level error display.
