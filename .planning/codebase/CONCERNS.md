# Codebase Concerns

**Analysis Date:** 2026-03-18

## Tech Debt

**E2E Test Stubs:**
- Issue: Extensive use of stubbed responses in Playwright tests bypasses actual backend integration, potentially masking API contract mismatches.
- Files: `frontend/tests/e2e/module-crud.spec.ts`, `frontend/tests/e2e/lesson-content.spec.ts`, `frontend/tests/e2e/media-upload.spec.ts`
- Impact: Tests may pass even if the backend API changes or fails.
- Fix approach: Transition to integration tests or use a mock server that strictly enforces the API schema.

**Temporary UUIDs in Curriculum Editor:**
- Issue: Lessons use temporary UUIDs on the frontend which are replaced by MongoDB ObjectIDs after saving.
- Files: `frontend/components/features/courses/curriculum-editor/lesson-panel.tsx`
- Impact: Potential race conditions or UI flickering during sync; complexity in managing ID mappings.
- Fix approach: Implement a more robust optimistic update strategy or allow backend-generated IDs to be pre-fetched.

## Security Considerations

**Missing Ownership Checks:**
- Risk: The `course-service` verifies if a user has the 'instructor' role but does not check if the instructor owns the specific course they are trying to update or delete.
- Files: `backend/course-service/src/controllers/course.controller.ts`, `backend/course-service/src/services/course.service.ts`
- Current mitigation: None (only role-based check in `course.route.ts`).
- Recommendations: Implement an ownership middleware or service-level check to ensure `instructorId` matches `req.user.id`.

**Secret Management:**
- Risk: Secrets like `JWT_SECRET` and Supabase keys are managed via `.env` files and passed as parameters to middlewares.
- Files: `backend/course-service/src/routes/course.route.ts`, `backend/user-service/src/config/env.config.ts`
- Current mitigation: Standard environment variable usage.
- Recommendations: Use a centralized secret management service (e.g., AWS Secrets Manager, HashiCorp Vault) for production environments.

## Performance Bottlenecks

**Unpaginated Listings:**
- Problem: Course listing and user listing fetch all records at once.
- Files: `backend/course-service/src/services/course.service.ts`, `backend/user-service/src/services/admin.service.ts`
- Cause: `Course.find().sort({ createdAt: -1 })` without limit/skip.
- Improvement path: Implement skip/limit pagination and return total counts for frontend pagination components.

## Fragile Areas

**RBAC Implementation Duplication:**
- Files: `backend/shared/middlewares/src/index.ts` and `backend/user-service/src/middlewares/auth.middleware.ts`
- Why fragile: Divergent logic for role checking (one uses `toLowerCase()`, the other `toUpperCase()`) can lead to inconsistent authorization results across services.
- Safe modification: Consolidate all auth/RBAC logic into the `@simplearn/middlewares` shared package and ensure all services use it exclusively.

## Missing Critical Features

**Discussion and Q&A:**
- Problem: The curriculum viewer has placeholders for Discussion/Q&A but no implementation.
- Files: `frontend/app/student/courses/[slug]/learn/[lessonId]/page.tsx`
- Blocks: Student-instructor interaction.

**Specialized Video Player:**
- Problem: Currently using a native HTML5 video player as a placeholder.
- Files: `frontend/components/features/courses/viewer/video-player.tsx`
- Blocks: Advanced features like bit-rate switching, protected streaming, and detailed analytics.

---

*Concerns audit: 2026-03-18*
