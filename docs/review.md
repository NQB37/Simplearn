# Code Review Report - Simplearn

## Executive Summary

The Simplearn project demonstrates a solid foundation for a microservices architecture using modern technologies like Next.js 16, React 19, and Node.js with Express 5. However, the current implementation reveals several critical security vulnerabilities, broken dependencies, and inconsistencies that must be addressed to ensure system integrity and maintainability.

---

## Backend Review

### 1. User Service & Auth Logic
*   **CRITICAL: Privilege Escalation**: The `/register` endpoint in `auth.route.ts` allows users to provide an arbitrary `role` property in the request body. While Zod validation exists, it does not strip unknown keys before passing them to the service, enabling new users to register as `ADMIN`.
*   **HIGH: Hardcoded Security Defaults**: `JWT_SECRET` defaults to `'secret'` in several locations (e.g., `academy.route.ts`), posing a significant risk in non-local environments.
*   **HIGH: Insecure Refresh Token Handling**: The `refresh` token cookie's `secure` flag is only set if `config.env === 'production'`. This leaves it insecure in staging or other non-production environments.
*   **LOW: Redundant Dependency**: The `pg` (PostgreSQL) package is included in `package.json` but is never utilized, as the service exclusively uses MongoDB.

### 2. Academy Service
*   **MEDIUM: Inconsistent Data Transformation**: Unlike the `user-service`, `academy-service` does not transform `_id` to `id` in its Mongoose models, creating inconsistent API responses for frontend consumers.
*   **MEDIUM: Incomplete Features**: The `enrollUser` endpoint is registered but returns a `501 Not Implemented` response, indicating incomplete development.
*   **MEDIUM: Redundant Middleware usage**: Routes utilize both `requireAuth` and `requireRole` in sequence. Since `requireRole` also performs token verification, `requireAuth` is redundant and adds unnecessary processing.

### 3. Shared Library
*   **CRITICAL: Broken Dependency**: The `@simplearn/logger` package referenced by all services is missing from the `backend/shared` directory, preventing a successful build.
*   **HIGH: Version Mismatch**: Shared middlewares depend on Express 4, while services are built on Express 5. This can lead to subtle runtime incompatibilities.

---

## Frontend Review

### 1. Architecture & State Management
*   **HIGH: Lack of Data-Fetching Strategy**: The application relies on raw `useEffect` and `useState` for API synchronization. This leads to excessive boilerplate and lacks caching, revalidation, and error recovery features provided by libraries like TanStack Query (SWR/React Query).
*   **MEDIUM: Repetitive Component Logic**: The `admin/academics/page.tsx` file (17KB+) contains substantial repetitive logic for entity management (Rooms, Subjects, etc.) that should be abstracted into reusable hooks or components.

### 2. API Communication
*   **MEDIUM: Environment Dependency**: API calls directly reference `process.env.NEXT_PUBLIC_ACADEMY_SERVICE_URL`. Centralizing these calls through an API Gateway or a unified service layer would improve maintainability and decouple the frontend from backend infrastructure.

---

## Security & Infrastructure

### 1. Testing Infrastructure
*   **CRITICAL: Missing Testing**: No unit, integration, or E2E tests were found in the entire repository. This makes the system extremely fragile to regressions.

### 2. Infrastructure
*   **MEDIUM: Hardcoded DNS**: Both services hardcode DNS servers (`1.1.1.1`), which can cause network failures in restricted corporate environments or local discovery issues.

---

## Recommendations

1.  **Immediate Security Fix**: Update the `validateRequest` middleware to replace `req.body` with the result of `schema.parseAsync()` and ensure the `registerSchema` is strictly enforced.
2.  **Shared Package Restoration**: Re-implement or restore the `@simplearn/logger` package.
3.  **Architecture Alignment**: Implement a unified data-fetching strategy on the frontend (e.g., React Query) and centralize API definitions.
4.  **Testing Strategy**: Establish a testing suite using `Vitest` or `Jest` for backend logic and `Playwright` for critical frontend flows.
