# Codebase Structure

**Analysis Date:** 2026-03-18

## Directory Layout

```
Simplearn/
├── frontend/                           # Next.js 16 React app (port 3000)
│   ├── app/                            # Next.js App Router pages
│   │   ├── (auth)/                     # Public auth routes (login, register)
│   │   ├── admin/                      # Admin dashboard (academics, catalog, users)
│   │   ├── instructor/                 # Instructor dashboard (courses, create)
│   │   ├── student/                    # Student views (dashboard, courses, learn)
│   │   ├── auth/callback               # OAuth callback handler
│   │   ├── forbidden/                  # 403 error page
│   │   ├── layout.tsx                  # Root layout with providers
│   │   └── page.tsx                    # Home/landing page
│   ├── components/                     # React components
│   │   ├── features/                   # Feature-specific components (organized by domain)
│   │   │   ├── academics/              # Academic year/room/subject/class components
│   │   │   ├── auth/                   # Login/register forms
│   │   │   ├── courses/                # Course cards, curriculum editor, viewer
│   │   │   │   ├── curriculum-editor/  # Module/lesson creation & editing (with sortable)
│   │   │   │   └── viewer/             # Course viewing components (sidebar, video player)
│   │   │   └── profile/                # User profile components
│   │   ├── shared/                     # Shared UI (header, footer, course card, modals)
│   │   ├── ui/                         # Shadcn UI primitives (buttons, inputs, dialogs, etc.)
│   │   └── providers/                  # Context/provider wrappers (QueryProvider, ThemeProvider)
│   ├── lib/                            # Utilities & services
│   │   ├── services/                   # API service layer (academy.service, course.service, auth.api, media.service)
│   │   └── mock-data.ts                # Fixture data for development
│   ├── store/                          # Zustand stores (user.store for auth state)
│   ├── hooks/                          # Custom React hooks
│   ├── types/                          # TypeScript interfaces (academics.type, course.type, media.type, index.type)
│   ├── constants/                      # Constants and enums
│   ├── api/                            # HTTP client setup (axios.api.ts with interceptors)
│   ├── tests/                          # Test files
│   │   ├── e2e/                        # Playwright end-to-end tests
│   │   └── unit/                       # Unit tests (Jest/Vitest)
│   ├── middleware.ts                   # Next.js Edge middleware for route protection
│   ├── app/globals.css                 # Global Tailwind styles
│   ├── tsconfig.json                   # TypeScript config with path aliases (@/)
│   ├── next.config.js                  # Next.js config
│   ├── tailwind.config.ts              # Tailwind CSS config (v4)
│   ├── playwright.config.ts            # Playwright E2E test config
│   └── package.json                    # Dependencies, scripts
│
├── backend/                            # Microservices
│   ├── user-service/                   # Authentication & user management (port 8001)
│   │   ├── src/
│   │   │   ├── index.ts                # Express app setup, route registration
│   │   │   ├── config/                 # Environment & database config
│   │   │   ├── routes/                 # Express routers (auth.route, admin.route, user.route)
│   │   │   ├── controllers/            # Route handlers (auth.controller, admin.controller, user.controller)
│   │   │   ├── services/               # Business logic (auth.service: register, login, googleLogin, refresh)
│   │   │   ├── models/                 # Mongoose schema (user.model)
│   │   │   ├── middlewares/            # Local middleware (auth.middleware, validation.middleware)
│   │   │   ├── validators/             # Input validation schemas (auth.validator with registerSchema, loginSchema)
│   │   │   ├── utils/                  # Utility functions
│   │   │   └── @types/                 # TypeScript type augmentations
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── academy-service/                # Academic structure management (port 8002)
│   │   ├── src/
│   │   │   ├── index.ts                # Express setup with routes
│   │   │   ├── routes/                 # academy.route, room.route, class.route, subject.route
│   │   │   ├── controllers/            # Handlers for CRUD operations
│   │   │   ├── services/               # Business logic layer
│   │   │   ├── models/                 # Mongoose schemas
│   │   │   ├── config/
│   │   │   ├── middlewares/
│   │   │   └── validators/
│   │   └── package.json
│   │
│   ├── course-service/                 # Course catalog & curriculum (port 8003)
│   │   ├── src/
│   │   │   ├── index.ts                # Express setup with nested route registration
│   │   │   ├── routes/                 # course.route, module.route (mergeParams), lesson.route (mergeParams)
│   │   │   ├── controllers/            # course.controller, module.controller, lesson.controller
│   │   │   ├── services/               # course.service, module.service, lesson.service
│   │   │   ├── models/                 # Course, Module, Lesson schemas (IContentBlock union on Lesson)
│   │   │   ├── config/
│   │   │   ├── @types/
│   │   │   └── dist/                   # Compiled JavaScript output
│   │   └── package.json
│   │
│   ├── media-service/                  # File upload orchestration (port 8004)
│   │   ├── src/
│   │   │   ├── index.ts                # Express setup, error handler for multer
│   │   │   ├── routes/                 # image.route, document.route
│   │   │   ├── controllers/            # Upload/delete handlers
│   │   │   ├── services/               # Cloudinary & Supabase integration
│   │   │   ├── config/
│   │   │   ├── middleware/             # Multer config
│   │   │   └── dist/
│   │   └── package.json
│   │
│   └── shared/middlewares/             # Shared npm package (linked locally)
│       ├── src/
│       │   └── index.ts                # Export requireAuth(), requireRole() factories
│       ├── dist/                       # Compiled output (consumed by services)
│       ├── package.json                # Published as @simplearn/middlewares
│       └── tsconfig.json
│
├── docs/                               # Project documentation
│   ├── agent-plans/                    # Orchestrator-generated implementation plans
│   └── superpowers/                    # Feature specs and plans
│
├── .planning/codebase/                 # Codebase analysis documents
│   ├── ARCHITECTURE.md                 # System design & layers
│   ├── STRUCTURE.md                    # This file
│   ├── STACK.md                        # Technology & dependencies
│   ├── INTEGRATIONS.md                 # External services
│   ├── CONVENTIONS.md                  # Coding style & patterns
│   ├── TESTING.md                      # Test framework & patterns
│   └── CONCERNS.md                     # Known issues & technical debt
│
├── CLAUDE.md                           # Instructions for Claude Code
├── GEMINI.md                           # Instructions for Gemini
├── .gitignore
└── package.json (root monorepo, if any)
```

## Directory Purposes

**`frontend/app/`**
- Purpose: Next.js App Router pages organized by role/feature
- Contains: Page components, layout wrappers, dynamic routes
- Key files: `(auth)/login/page.tsx`, `admin/academics/page.tsx`, `instructor/courses/[slug]/edit/page.tsx`, `student/dashboard/page.tsx`

**`frontend/components/features/`**
- Purpose: Feature-specific React components, organized by domain (not generic UI)
- Contains: Login forms, course cards, curriculum editor, profile forms
- Pattern: Each feature folder contains only components for that feature; shared UI goes in `components/shared/`

**`frontend/components/ui/`**
- Purpose: Shadcn UI primitive components (Button, Dialog, Input, etc.)
- Contains: Re-exported/customized Shadcn components
- Note: Generated via Shadcn CLI; do not edit directly (regenerate from Shadcn if needed)

**`frontend/lib/services/`**
- Purpose: API client service layer; wraps Axios calls to backend microservices
- Contains: `academy.service.ts`, `course.service.ts`, `auth.api.ts`, `media.service.ts`
- Pattern: Object with async methods mapping to HTTP endpoints; handles response wrapping (e.g., `data.course`, `data.lessons`)

**`frontend/store/`**
- Purpose: Zustand stores for global client state
- Contains: `user.store.ts` with auth state (user, accessToken, isAuthenticated) persisted to localStorage
- Pattern: Single store per domain; use `create()` with `persist` middleware

**`backend/*/src/routes/`**
- Purpose: Express route definitions and middleware composition
- Pattern: Routes group related endpoints and attach auth/validation middleware via `requireAuth()`, `requireRole()`, `validateRequest()`
- Note: Lesson/Module routes use `mergeParams: true` to access parent courseId/moduleId params

**`backend/*/src/controllers/`**
- Purpose: HTTP request handlers; extract params/body, call service layer, return responses
- Pattern: Try-catch wrapper, extract userId/role from `req.user`, construct payload, call service, return JSON response with status code

**`backend/*/src/services/`**
- Purpose: Business logic isolated from HTTP; call Mongoose models, orchestrate data
- Pattern: Pure functions (or methods on service object) that take domain-specific args and return domain objects, not Express Response

**`backend/*/src/models/`**
- Purpose: Mongoose schemas with TypeScript interfaces
- Pattern: Export `interface I{Entity}` (TypeScript) and `mongoose.model()` (runtime); include indexes, refs for relationships

**`backend/shared/middlewares/`**
- Purpose: Centralized auth middleware consumed by multiple services via npm (locally linked)
- Key exports: `requireAuth(jwtSecret)`, `requireRole(allowedRoles[], jwtSecret)` — both return Express middleware functions
- Location after build: Consumed from `dist/` by services via `import { requireAuth } from '@simplearn/middlewares'`

## Key File Locations

**Entry Points:**
- Frontend: `frontend/middleware.ts` (Next.js Edge middleware for route protection), `frontend/app/layout.tsx` (root layout with providers)
- User Service: `backend/user-service/src/index.ts`
- Academy Service: `backend/academy-service/src/index.ts`
- Course Service: `backend/course-service/src/index.ts`
- Media Service: `backend/media-service/src/index.ts`

**Configuration:**
- Frontend env: `frontend/.env` (NEXT_PUBLIC_* variables for service URLs, Google OAuth client ID)
- Frontend path aliases: `frontend/tsconfig.json` (`@/` → `frontend/`)
- User service env: `backend/user-service/.env` (PORT, MONGODB_URI, JWT secrets, Google OAuth)
- Course service env: `backend/course-service/.env` (PORT, MongoDB Atlas URI, JWT_ACCESS_SECRET)
- Media service env: `backend/media-service/.env` (PORT, Cloudinary credentials, Supabase credentials)

**Core Logic:**
- Auth state: `frontend/store/user.store.ts` (Zustand)
- HTTP client setup: `frontend/api/axios.api.ts` (Axios instance with request/response interceptors)
- Route protection: `frontend/middleware.ts` (JWT parsing, role checking)
- Service layer: `frontend/lib/services/*.service.ts` (API calls)
- Auth service: `backend/user-service/src/services/auth.service.ts` (register, login, googleLogin, refresh, logout)
- Course operations: `backend/course-service/src/services/course.service.ts`, `module.service.ts`, `lesson.service.ts`
- Shared auth: `backend/shared/middlewares/src/index.ts` (`requireAuth`, `requireRole`)

**Testing:**
- E2E: `frontend/tests/e2e/*.spec.ts` (Playwright)
- Unit (if any): `frontend/tests/unit/` or `backend/user-service/src/**/*.test.ts`
- Config: `frontend/playwright.config.ts`

## Naming Conventions

**Files:**
- Page components: `page.tsx` in route directories (e.g., `admin/page.tsx`, `[slug]/page.tsx`)
- Feature components: `<feature-name>.tsx` (e.g., `create-course-form.tsx`, `course-card.tsx`)
- Service files: `<domain>.service.ts` (e.g., `course.service.ts`, `academy.service.ts`)
- Test files: `<component>.test.tsx` or `<component>.spec.ts` (e.g., `delete-course-modal.test.tsx`)
- Routes: `<entity>.route.ts` (e.g., `auth.route.ts`, `course.route.ts`)
- Controllers: `<entity>.controller.ts`
- Models: `<entity>.model.ts`
- Schemas: `<entity>Schema` variable names

**Directories:**
- Feature directories: Plural or descriptive (e.g., `courses`, `academics`, `curriculum-editor`)
- API routes in backend: RESTful path structure (`/api/courses`, `/api/courses/{id}/modules`)

**Functions & Variables:**
- Async/handler functions: camelCase (e.g., `getCourses()`, `createLesson()`)
- Service methods: camelCase (e.g., `courseService.updateCourse()`)
- TypeScript interfaces: PascalCase starting with `I` or just PascalCase (e.g., `ICourse`, `Lesson`)
- Zustand actions: camelCase (e.g., `setUser()`, `clearUser()`)

**React Components:**
- PascalCase file names for components (e.g., `CurriculumEditor.tsx`, not `curriculum-editor.tsx`)
- But: Some files use kebab-case (e.g., `course-sidebar.tsx`) — follow existing pattern in feature folder

## Where to Add New Code

**New Feature:**
- Primary code: `frontend/components/features/<feature-name>/` for UI; `backend/<service-name>/src/` for API
- Tests: `frontend/tests/unit/` or `frontend/tests/e2e/` for frontend; `backend/<service-name>/src/**/*.test.ts` for backend
- Service methods: `frontend/lib/services/<domain>.service.ts`
- Types: `frontend/types/<domain>.type.ts`

**New Component/Module:**
- If feature-specific: `frontend/components/features/<feature-name>/<component>.tsx`
- If shared UI: `frontend/components/shared/<component>.tsx`
- If Shadcn primitive: `frontend/components/ui/<component>.tsx` (via Shadcn CLI)

**Backend Endpoint:**
- Create route handler: `backend/<service>/src/routes/<entity>.route.ts`
- Add controller function: `backend/<service>/src/controllers/<entity>.controller.ts`
- Add service method: `backend/<service>/src/services/<entity>.service.ts`
- Define Mongoose model: `backend/<service>/src/models/<entity>.model.ts`

**Utilities:**
- Shared helpers: `frontend/lib/` (or `frontend/lib/utils/` if many)
- Backend helpers: `backend/<service>/src/utils/`

**Styling:**
- Component styles: Inline Tailwind classes in JSX (no separate CSS files for components)
- Global styles: `frontend/app/globals.css`
- Theme configuration: `frontend/tailwind.config.ts`

## Special Directories

**`frontend/.next/`**
- Purpose: Next.js build output
- Generated: Yes (via `npm run build`)
- Committed: No (in .gitignore)

**`frontend/node_modules/` & `backend/*/node_modules/`**
- Purpose: Installed npm packages
- Generated: Yes (via `npm install`)
- Committed: No (in .gitignore)

**`backend/shared/middlewares/dist/`**
- Purpose: Compiled TypeScript output of shared package
- Generated: Yes (via `npm run build` in `backend/shared/middlewares/`)
- Committed: No (in .gitignore) — must be rebuilt after source changes before services can use updated middleware

**`.planning/codebase/`**
- Purpose: Architecture & code analysis documents for AI orchestration
- Generated: Via `/gsd:map-codebase` command
- Committed: Yes (for reference in future phases)

**`docs/`**
- Purpose: Project specs, architecture diagrams, implementation plans
- Contains: Handwritten specs and orchestrator-generated phase plans
- Committed: Yes

---

*Structure analysis: 2026-03-18*
