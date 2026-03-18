# Architecture

**Analysis Date:** 2026-03-18

## Pattern Overview

**Overall:** Distributed monorepo with separate microservices (one per domain) + Next.js frontend. Each service follows MVC-like pattern (routes → controllers → services → models). Frontend uses React Server Components with client-side state management via Zustand.

**Key Characteristics:**
- Port-isolated Express services communicate via HTTP/REST
- Shared middleware package (`@simplearn/middlewares`) for auth/role enforcement
- JWT-based authentication with HTTP-only cookies for refresh tokens
- MongoDB primary storage; Cloudinary (images) + Supabase (documents) for media
- Next.js App Router with role-based route protection via middleware
- Zustand store with localStorage persistence for frontend auth state

## Layers

**API Gateway / Frontend (`frontend/`):**
- Purpose: User interface, route protection, orchestration of service calls
- Location: `frontend/`
- Contains: Next.js pages, React components, Zustand stores, Axios service layer
- Depends on: Auth service (user-service), Academy service, Course service, Media service
- Used by: Browser clients

**Authentication Service (`backend/user-service/`):**
- Purpose: User registration, login, JWT token issuance, refresh token management
- Location: `backend/user-service/src/`
- Contains: auth/user/admin routes, controllers, services, Mongoose User model
- Depends on: MongoDB (simplearn_auth), Google OAuth2
- Used by: Frontend (for login/register/logout), other services (for token validation)

**Academy Service (`backend/academy-service/`):**
- Purpose: Academic structure — years, rooms, subjects, classes management
- Location: `backend/academy-service/src/`
- Contains: Routes for academic-years, rooms, subjects, classes; controllers; Mongoose schemas
- Depends on: MongoDB (simplearn_academy)
- Used by: Frontend admin dashboard, student recommendations

**Course Service (`backend/course-service/`):**
- Purpose: Course catalog, curriculum (modules, lessons), lesson content management
- Location: `backend/course-service/src/`
- Contains: Course/Module/Lesson controllers, services, nested routes with `mergeParams: true`, Mongoose models
- Depends on: MongoDB Atlas, JWT validation via `@simplearn/middlewares`
- Used by: Frontend instructor (course creation/editing), student (course viewing)

**Media Service (`backend/media-service/`):**
- Purpose: Stateless file upload/storage orchestration for course content
- Location: `backend/media-service/src/`
- Contains: Image and document upload routes, Cloudinary/Supabase integration, multer file handling
- Depends on: Cloudinary (images), Supabase Storage (documents)
- Used by: Course service, frontend curriculum editor

**Shared Middleware Package (`backend/shared/middlewares/`):**
- Purpose: Centralized auth/authorization logic consumed by all backend services
- Location: `backend/shared/middlewares/src/`
- Contains: `requireAuth()`, `requireRole()` Express middleware factories
- Depends on: jsonwebtoken for JWT verification
- Used by: Course service, Media service routes (user-service uses local auth.middleware.ts)

## Data Flow

**User Login Flow:**

1. User enters credentials on `frontend/(auth)/login/page.tsx` → `useAuthStore`
2. Frontend calls `POST /api/auth/login` (user-service)
3. user-service validates, returns `{ user, accessToken }` + sets HTTP-only `refreshToken` cookie
4. Frontend stores `accessToken` + user in Zustand store (persisted to localStorage)
5. Axios interceptor (`frontend/api/axios.api.ts`) attaches `Bearer <accessToken>` to all requests
6. On 401 response, interceptor auto-refreshes via `POST /api/auth/refresh`, retries request

**Course Creation Flow:**

1. Instructor opens `frontend/instructor/courses/create` → `CreateCourseForm`
2. Submits to `courseService.createCourse()` → `POST /api/courses` (course-service)
3. Course-service `requireAuth` + `requireRole(['instructor', 'admin'])` validates JWT
4. `courseController.createCourse()` extracts `instructorId` from `req.user.id` (decoded JWT)
5. Calls `courseService.createCourse()` → saves to MongoDB Atlas
6. Returns `{ course }` → frontend stores in component state or react-query cache

**Lesson Content Edit Flow:**

1. Instructor on `frontend/instructor/courses/[slug]/edit` → `CurriculumEditor`
2. Edits lesson contents (text blocks, images, documents)
3. Submits `PUT /api/courses/{courseId}/modules/{moduleId}/lessons/{lessonId}` with full `contents: ContentBlock[]` array
4. Course-service validates auth/role, calls `lessonService.updateLesson()`
5. Entire `contents` array is replaced (not merged) in MongoDB
6. For images: earlier uploaded via `POST /api/media/images` to Cloudinary, URL returned
7. For documents: earlier uploaded via `POST /api/media/documents` to Supabase, path + metadata returned

**Student Course View Flow:**

1. Student navigates to `frontend/student/dashboard` or `/student/courses/[slug]/learn/[lessonId]`
2. Frontend calls `courseService.getCourses()` and `courseService.getLessons()`
3. Course-service public routes (`GET /api/courses`, `GET /api/courses/{slug}`) need NO auth
4. Lesson routes (`GET`) require `requireAuth()` only, all authenticated users can view
5. Frontend renders `CourseViewer` component with lesson content (text HTML, images, documents)

**State Management:**

- Auth state: Zustand `useUserStore` (user, accessToken, isAuthenticated) persisted to localStorage
- Route protection: Next.js middleware (no signature verification, just JWT parsing) + component-level gating
- Service-layer API calls: Axios with interceptors for token refresh, error handling
- Query caching: React Query (if configured) via `QueryProvider` in root layout

## Key Abstractions

**Service Layer (Backend):**
- Purpose: Encapsulate database/business logic, decouple controllers from Mongoose
- Examples: `backend/course-service/src/services/course.service.ts`, `backend/user-service/src/services/auth.service.ts`
- Pattern: Functions like `createCourse()`, `getCourseBySlug()` that call `.save()`, `.findById()` on models

**Route Nesting (Nested Resources):**
- Purpose: Represent hierarchical relationships (Course → Module → Lesson)
- Examples: `backend/course-service/src/routes/module.route.ts` (uses `mergeParams: true`), `backend/course-service/src/routes/lesson.route.ts`
- Pattern: Routes registered at parent level: `app.use('/api/courses/:courseId/modules/:moduleId/lessons', lessonRoutes)`

**API Interceptors (Frontend):**
- Purpose: Global request/response handling for auth, token refresh, error logging
- Examples: `frontend/api/axios.api.ts`
- Pattern: Request interceptor adds Bearer token; response interceptor catches 401, refreshes, retries with queue deduplication

**Mongoose Schemas with TypeScript:**
- Purpose: Type-safe database models with runtime Mongoose validation
- Examples: `backend/course-service/src/models/lesson.model.ts` (ILesson interface, LessonSchema)
- Pattern: Export both interface (TypeScript) and Mongoose model; schema includes indexes, refs for relationships

**Content Block Polymorphism:**
- Purpose: Support multiple content types (text/image/document) in lessons
- Examples: `frontend/types/course.type.ts` (ContentBlock discriminated union), `backend/course-service/src/models/lesson.model.ts` (IContentBlock)
- Pattern: TypeScript discriminated union on frontend; Mongoose enum + optional fields on backend

## Entry Points

**Frontend:**
- Location: `frontend/app/layout.tsx` (root layout with providers), `frontend/middleware.ts` (route protection)
- Triggers: Browser navigation, page load
- Responsibilities: Render pages, protect routes via JWT parsing, render role-based UI

**User Service:**
- Location: `backend/user-service/src/index.ts`
- Triggers: HTTP requests to port 8001
- Responsibilities: Initialize Express, CORS, routes (/api/auth, /api/admin, /api/users), MongoDB connection

**Course Service:**
- Location: `backend/course-service/src/index.ts`
- Triggers: HTTP requests to port 8003
- Responsibilities: Initialize Express, register nested routes, JWT validation via shared middleware

**Academy Service:**
- Location: `backend/academy-service/src/index.ts`
- Triggers: HTTP requests to port 8002
- Responsibilities: Manage academic data, serve public endpoints (e.g., GET /api/academy/academic-years)

**Media Service:**
- Location: `backend/media-service/src/index.ts`
- Triggers: Multipart form-data POST requests to port 8004
- Responsibilities: Parse uploads via multer, proxy to Cloudinary/Supabase, return URLs/paths

## Error Handling

**Strategy:** Try-catch in controllers, pass error messages to client; no global error handler on frontend except Axios interceptor.

**Patterns:**

- **Backend Controllers:** Wrap service calls in try-catch, return JSON `{ message: string }` or `{ error: string }` with HTTP status codes (400, 401, 403, 404, 500)
- **Frontend Axios Interceptor:** Catch 401 → refresh token, retry. Catch other errors → console.error, return Promise.reject
- **Frontend Components:** Use react-query hooks (if available) with .error state, or manual try-catch in event handlers, render error messages to user via toast/modal
- **Validation Errors:** Backend middleware validates request body (zod/joi), returns 400 if invalid (e.g., `validateRequest(registerSchema)` in auth.route.ts)

## Cross-Cutting Concerns

**Logging:**
- Backend: Simple `console.log()` for request method/path in middleware; `console.error()` in catch blocks
- Frontend: `console.error()` in Axios interceptor for 401/session expiry

**Validation:**
- Backend: Validator middleware (`validateRequest()`) in auth routes; Mongoose schema validation on save
- Frontend: React Hook Form (if in components) or manual validation in service methods

**Authentication:**
- Backend: User-service issues JWT + HTTP-only refresh cookie; shared middleware validates JWT on protected routes
- Frontend: Middleware parses JWT cookie (no verification) for role; Zustand store tracks auth state; Axios includes accessToken in Authorization header

**CORS:**
- All backend services hardcoded to allow `http://localhost:3000` with credentials: true

---

*Architecture analysis: 2026-03-18*
