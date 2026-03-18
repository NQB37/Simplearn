# Architecture

**Analysis Date:** 2026-03-18

## Pattern Overview

**Overall:** Microservices Architecture with a Next.js Frontend.

**Key Characteristics:**
- **Decoupled Services:** Each domain (Users, Courses, Academy, Media) is managed by a dedicated Express.js service.
- **Shared Middleware:** Common logic like authentication and error handling is extracted into a shared library.
- **Unified Frontend:** A single Next.js application serves all user roles (Student, Instructor, Admin).

## Layers

**API Layer (Backend):**
- Purpose: Provides RESTful endpoints for the frontend.
- Location: `backend/[service-name]/src/routes`
- Contains: Express routers and route definitions.
- Depends on: Controllers.
- Used by: Frontend application.

**Controller Layer (Backend):**
- Purpose: Handles incoming requests, validates input, and orchestrates services.
- Location: `backend/[service-name]/src/controllers`
- Contains: Request handlers.
- Depends on: Services, Validators.

**Service Layer (Backend):**
- Purpose: Contains core business logic and interacts with models.
- Location: `backend/[service-name]/src/services`
- Contains: Business logic classes/functions.
- Depends on: Models.

**Data Access Layer (Backend):**
- Purpose: Manages database interactions using Mongoose.
- Location: `backend/[service-name]/src/models`
- Contains: Mongoose schemas and models.

## Data Flow

**Standard Request Flow:**

1. **Frontend Request:** Next.js components or hooks (e.g., `frontend/hooks/use-courses.ts`) call backend APIs.
2. **Routing:** Express router (e.g., `backend/course-service/src/routes/course.route.ts`) matches the request.
3. **Middleware:** Shared or local middlewares (e.g., `@simplearn/middlewares`) handle authentication/validation.
4. **Controller:** Controller (e.g., `backend/course-service/src/controllers/course.controller.ts`) processes the request.
5. **Service/Model:** Business logic is applied, and MongoDB is queried via Mongoose models.

**State Management:**
- **Frontend:** React Query for server state (`frontend/components/providers/query-provider.tsx`) and Zustand for local state (`frontend/store/user.store.ts`).

## Key Abstractions

**Shared Middlewares:**
- Purpose: Encapsulate common Express middleware across services.
- Examples: `backend/shared/middlewares/src/index.ts`
- Pattern: Shared internal package linked via `file:` dependencies in `package.json`.

## Entry Points

**Microservices:**
- Location: `backend/[service-name]/src/index.ts`
- Triggers: Node.js runtime (via `tsx` in development).
- Responsibilities: Server initialization, database connection, middleware setup, and route mounting.

**Frontend:**
- Location: `frontend/app/layout.tsx` and `frontend/app/page.tsx`
- Triggers: Browser navigation.
- Responsibilities: App-wide layout, providers, and initial page rendering.

## Error Handling

**Strategy:** Centralized middleware-based error handling.

**Patterns:**
- **Shared Error Middleware:** Likely located in `@simplearn/middlewares` (referenced in `backend/user-service/package.json`).
- **Zod Validation:** Used for request payload validation in controllers/validators (e.g., `backend/user-service/src/validators/`).

## Cross-Cutting Concerns

**Logging:** Winston and Morgan used in services (e.g., `backend/user-service/src/index.ts`).
**Validation:** Zod is used across the backend.
**Authentication:** JWT-based authentication, managed by the `user-service` (auth-service) and verified via shared middlewares.

---

*Architecture analysis: 2026-03-18*
