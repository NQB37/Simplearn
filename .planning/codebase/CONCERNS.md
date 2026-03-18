# Codebase Concerns

**Analysis Date:** 2026-03-18

## Tech Debt

**Missing Logger Package:**
- Issue: `backend/user-service/src/middlewares/logger.middleware.ts` imports `@simplearn/logger` package which does not exist
- Files: `backend/user-service/src/middlewares/logger.middleware.ts` (line 1)
- Impact: Logger middleware will fail at runtime; Morgan logging through Winston cannot work
- Fix approach: Create `backend/shared/logger` package with Winston wrapper or remove logger middleware and use `console` directly. The logger middleware is imported but currently unused in the application since it's not wired up in the main server.

**Console Logging Pervasiveness:**
- Issue: 57 instances of `console.log` and `console.error` scattered across backend services instead of centralized logging
- Files: All backend services (`backend/user-service/src/`, `backend/academy-service/src/`, `backend/course-service/src/`, `backend/media-service/src/`)
- Impact: No structured logging, no log levels, hard to debug in production, inconsistent error reporting
- Fix approach: Implement centralized Winston logger or replace all console calls with a logging service

## Known Bugs

**Unimplemented Enrollment Endpoint:**
- Symptoms: `POST /api/enroll` returns 501 Not Implemented
- Files: `backend/academy-service/src/controllers/academy.controller.ts` (lines 56-66)
- Trigger: Any request to `POST /api/enroll` with valid JWT auth and admin role
- Workaround: Endpoint is routed and protected but never executes business logic; currently only responds with status 501

## Security Considerations

**JWT Signature Verification Bypass in Frontend Middleware:**
- Risk: Frontend middleware (`frontend/middleware.ts`) extracts role from JWT without verifying signature. A malicious actor could forge a token with `ADMIN` role.
- Files: `frontend/middleware.ts` (lines 4-18)
- Current mitigation: Backend always verifies JWT signature with `requireAuth` and `requireRole` middleware. Frontend middleware is defense-in-depth only and does not grant actual API access.
- Recommendations: Document this clearly as a UI-only protection layer. Consider adding explicit comment that signature is intentionally not verified server-side verification is required.

**Role Parameter Exposure in Register:**
- Risk: While `authService.register()` doesn't accept a `role` parameter, a future developer might add it to the function signature without realizing the security implication
- Files: `backend/user-service/src/routes/auth.route.ts` (line 9), `backend/user-service/src/services/auth.service.ts` (line 15)
- Current mitigation: Register schema validates only `email`, `password`, `name`. Role is not accepted from request and defaults to `STUDENT`.
- Recommendations: Add explicit test to ensure register cannot be called with role. Add JSDoc comment on `register()` function stating role must not be accepted from request.

**Hardcoded CORS Origin:**
- Risk: All services hardcode `http://localhost:3000` as CORS origin, no environment variable override
- Files: `backend/user-service/src/index.ts` (line 18), `backend/academy-service/src/index.ts`, `backend/course-service/src/index.ts`, `backend/media-service/src/index.ts` (line 13)
- Impact: Cannot change CORS origin without code change; production deployments must modify source
- Fix approach: Move CORS origin to environment variable with `localhost:3000` as development default

**Google OAuth Dummy Password:**
- Risk: Google-registered users get random 16-character dummy password that's never used and never validated
- Files: `backend/user-service/src/services/auth.service.ts` (line 68)
- Impact: Acceptable for OAuth flow but creates unused password field; future password reset logic must account for this
- Fix approach: Mark password as optional for OAuth users or store null; add validation in password reset to reject OAuth users

## Performance Bottlenecks

**N+1 Query Risk in Lesson Contents:**
- Problem: `updateLesson` replaces entire `contents` array on every PUT; no partial updates supported
- Files: `backend/course-service/src/services/lesson.service.ts` (line 20), `backend/course-service/src/controllers/lesson.controller.ts`
- Cause: Full array replacement means all content blocks are written on each edit, even if only one changed
- Improvement path: Implement partial updates (PATCH) to update individual content blocks; alternatively accept full replacement as documented API contract

**Console Logging in Request Handler:**
- Problem: Every request logs to console (`${req.method} ${req.path}`), creating excessive I/O in production
- Files: `backend/user-service/src/index.ts` (line 22), `backend/academy-service/src/index.ts`, `backend/course-service/src/index.ts`, `backend/media-service/src/index.ts` (line 19)
- Impact: Production performance impact, especially under load
- Improvement path: Remove or gate behind debug env var; use Morgan middleware with controlled log level instead

## Fragile Areas

**Express Type Mismatch:**
- Files: `backend/shared/middlewares/src/index.ts`, all service controllers
- Why fragile: Shared middleware exports Express 5 types (`@types/express@^5.0.0`), but some services reference Express 4 signatures. Callback signatures differ (e.g., error handler arity).
- Safe modification: Always use the exported types from `@simplearn/middlewares` in service controllers; don't mix Express 4 and 5 type signatures
- Test coverage: No unit tests for middleware; manual integration testing required

**Loose Typing with `any`:**
- Files: `backend/user-service/src/controllers/auth.controller.ts` (line 82: `req: any`), `backend/shared/middlewares/src/index.ts` (line 7: `req: any`), `backend/user-service/src/middlewares/auth.middleware.ts` (line 5: `req: any`)
- Why fragile: `req.user` assignments have no type safety; accessing undefined properties fails silently until runtime
- Safe modification: Define proper interface extending `Express.Request` with typed `user` property; use everywhere instead of `any`
- Test coverage: Limited coverage for error cases in auth flow

**Error Handling Inconsistency:**
- Problem: Error responses have inconsistent structure: some use `{ error: string }`, others use `{ message: string }`
- Files: `backend/academy-service/src/controllers/academy.controller.ts` (line 11: `{ error }`), `backend/user-service/src/controllers/auth.controller.ts` (line 13: `{ message }`)
- Impact: Frontend error handling code must check both fields or risk missing errors
- Safe modification: Standardize on single error response structure across all services; update all error handlers to use it

**Mongoose Model Export Pattern:**
- Problem: Models are used before connection is guaranteed (models reference schema before `connectDB()` completes)
- Files: All services import models at top-level before `connectDB()` is called in `index.ts`
- Impact: Unlikely to fail in practice due to async nature, but creates theoretical race condition
- Safe modification: Ensure `connectDB()` is first statement in main entry point and awaited before routes are registered

## Scaling Limits

**Single MongoDB Instance for User Service:**
- Current capacity: Local `mongodb://localhost:27017/simplearn_auth` with no replication
- Limit: Single node failure causes complete outage; no backup, no failover
- Scaling path: Use MongoDB Atlas (some services already use it for course-service); implement connection pooling; add replica set for local development

**Stateless Services with Hardcoded Ports:**
- Current capacity: Each service on fixed port (8001-8004), no load balancing
- Limit: Cannot scale horizontally without changing code; single instance bottleneck
- Scaling path: Implement service discovery (Consul, Eureka) or use containerization (Docker) with orchestration (Kubernetes); move ports to environment variables

## Dependencies at Risk

**@simplearn/logger - Non-existent Package:**
- Risk: Referenced in `package.json` but never installed
- Impact: `npm install` succeeds (local file path), but import fails at runtime
- Migration plan: Either create the package or remove the dependency and use Winston directly (already installed)

**Express 5 Adoption:**
- Risk: Express 5 is new; some ecosystem packages may not have compatibility
- Impact: Type mismatches when using npm packages designed for Express 4
- Migration plan: Test all middleware thoroughly; consider staying on Express 4 stable if issues arise; document all breaking changes from Express 4

## Missing Critical Features

**Enrollment System Not Implemented:**
- Problem: Enrollment route exists and is protected but returns 501; no way to enroll students in classes
- Blocks: Student enrollment, class membership, access control for class-specific content
- Files: `backend/academy-service/src/controllers/academy.controller.ts` (lines 56-66)

**No Role Update Validation:**
- Problem: Admins can update any user role without permission checks (only auth requirement)
- Blocks: Prevents audit trail; no validation that role values are valid enums
- Files: `backend/user-service/src/services/admin.service.ts` (line 10)

**No Test Coverage for Academy Service:**
- Problem: Only user-service and course-service have test files; academy-service has zero tests
- Blocks: Risk of regressions in core academic functionality
- Files: `backend/academy-service/src/` has no `.test.ts` files

**No Test Coverage for Media Service:**
- Problem: Media service has test structure but tests are minimal/stubs
- Blocks: No confidence in image/document upload reliability
- Files: `backend/media-service/src/services/` has test files but limited actual assertions

## Test Coverage Gaps

**Academy Service Complete Coverage Gap:**
- What's not tested: All controllers, services, and routes in academy-service
- Files: `backend/academy-service/src/controllers/`, `backend/academy-service/src/services/`, `backend/academy-service/src/routes/`
- Risk: Enrollment bug, academic year CRUD errors, role permission bypass, all would go undetected
- Priority: High

**Media Upload Error Paths:**
- What's not tested: File size validation, invalid file types, Cloudinary/Supabase failures
- Files: `backend/media-service/src/controllers/`, `backend/media-service/src/services/`
- Risk: Malformed uploads, oversized files, or service outages could crash handler without graceful error response
- Priority: Medium

**Frontend E2E Coverage Incomplete:**
- What's not tested: Error states, network failures, role-based access restrictions from frontend
- Files: `frontend/tests/e2e/` exists but only has 5 test files for specific features
- Risk: UI state management bugs, authentication failures, and permission denials go unnoticed
- Priority: Medium

**Lesson Content Block Validation:**
- What's not tested: Invalid content block structures, missing required fields, malicious HTML in text blocks
- Files: `backend/course-service/src/services/lesson.service.ts`, no validation layer
- Risk: Malformed content could crash student dashboard or enable XSS if rich text editor doesn't sanitize
- Priority: High

---

*Concerns audit: 2026-03-18*
