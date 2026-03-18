# External Integrations

**Analysis Date:** 2026-03-18

## APIs & External Services

**Authentication:**
- Google OAuth 2.0 - User login and account creation
  - SDK/Client: `googleapis` v171.4.0
  - Auth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
  - Endpoint: POST `/api/auth/google` (user-service)
  - Flow: Frontend sends ID token → backend validates with Google API

**File Hosting:**
- Cloudinary v2.6.1 - Image upload, storage, and CDN
  - Purpose: Course images, lesson thumbnails
  - Endpoint: POST `/api/media/images` (media-service)
  - Auth: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - Integration: `backend/media-service/src/config/cloudinary.config.ts`
  - Service layer: `backend/media-service/src/services/image.service.ts`

- Supabase Storage - Document uploads (PDFs, DOCX, etc.)
  - Purpose: Lesson documents, course materials
  - Endpoint: POST `/api/media/documents` (media-service)
  - Auth: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - Bucket: `SUPABASE_BUCKET` (default: `documents`)
  - Integration: `backend/media-service/src/config/supabase.config.ts`
  - Service layer: `backend/media-service/src/services/document.service.ts`

## Data Storage

**Databases:**

- MongoDB (Local or MongoDB Atlas)
  - `simplearn_auth` - User accounts, authentication data (user-service)
    - Connection: `MONGODB_URI` (e.g., `mongodb://localhost:27017/simplearn_auth`)
    - ORM: Mongoose 9.2.3
    - Config: `backend/user-service/src/config/database.config.ts`

  - `simplearn_academy` - Classes, subjects, rooms, enrollments (academy-service)
    - Connection: `MONGODB_URI` (local instance)
    - ORM: Mongoose 9.2.4
    - Config: `backend/academy-service/src/config/database.config.ts`

  - `simplearn_courses` or Atlas - Courses, modules, lessons, content blocks (course-service)
    - Connection: `MONGODB_URI` (Atlas or local)
    - ORM: Mongoose 9.2.4
    - Config: `backend/course-service/src/config/database.config.ts`
    - Default: `mongodb://localhost:27017/simplearn_courses`

**File Storage:**

- Cloudinary - Images (course/lesson thumbnails)
- Supabase Storage - Documents (PDFs, DOCX files, etc.)
- Local filesystem - Not used (all media goes to cloud)

**Caching:**

- None configured - frontend uses React Query for client-side caching

## Authentication & Identity

**Auth Provider:**
- Custom JWT + Google OAuth
  - User-service: `backend/user-service/src/routes/auth.route.ts`
  - Implementation:
    - Local: Email/password with bcryptjs hashing
    - OAuth: Google ID token exchange → JWT tokens
    - Tokens: Access token (short-lived) + Refresh token (HTTP-only cookie)
  - Token format: JWT with role claim (ADMIN, INSTRUCTOR, STUDENT)
  - Frontend store: Zustand (`frontend/store/user.store.ts`) persists accessToken + user info to localStorage
  - Middleware: `@simplearn/middlewares` enforces `requireAuth` (JWT validation) + `requireRole` checks

**JWT Configuration:**

- Access token secret: `JWT_ACCESS_SECRET`
- Refresh token secret: `JWT_REFRESH_SECRET`
- Token refresh endpoint: POST `/api/auth/refresh` (user-service)
- Auto-refresh: Axios interceptor in `frontend/api/axios.api.ts` handles 401 responses

**Role-Based Access Control:**

- Roles: `ADMIN`, `INSTRUCTOR`, `STUDENT`
- Backend: `requireRole(['admin'])` middleware in route handlers
- Frontend: Next.js middleware (`frontend/middleware.ts`) checks role from JWT payload (no signature verification)
- Admin bypass: Admin role bypasses most role restrictions

## Monitoring & Observability

**Error Tracking:**
- None configured

**Logs:**
- Morgan (HTTP request logging) - `morgan` v1.10.1 middleware on all services
- Winston logging - Referenced in CLAUDE.md but may not be fully integrated
- Console logging - Basic `console.log` and `console.error` in services

**Request Tracing:**
- None configured

## CI/CD & Deployment

**Hosting:**
- Not configured (local development only)
- Deployment targets: Node.js servers (backend), Vercel/Next.js server or static + CDN (frontend)

**CI Pipeline:**
- None configured - no GitHub Actions or equivalent

**Local Development:**
- Frontend: `npm run dev` starts Next.js dev server on `http://localhost:3000`
- Backend services: `npm run dev` starts tsx watch mode
  - user-service: port 8001
  - academy-service: port 8002
  - course-service: port 8003
  - media-service: port 8004

## Environment Configuration

**Required env vars - Frontend:**

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth Client ID (exposed in build)
- `NEXT_PUBLIC_AUTH_SERVICE_URL` - User-service base URL (default: `http://localhost:8001`)
- `NEXT_PUBLIC_ACADEMY_SERVICE_URL` - Academy-service base URL (default: `http://localhost:8002`)
- `NEXT_PUBLIC_COURSE_SERVICE_URL` - Course-service base URL (default: `http://localhost:8003`)
- `NEXT_PUBLIC_MEDIA_SERVICE_URL` - Media-service base URL (default: `http://localhost:8004`)

**Required env vars - User Service:**

- `MONGODB_URI` - Database connection string
- `JWT_ACCESS_SECRET` - Access token signing key
- `JWT_REFRESH_SECRET` - Refresh token signing key
- `GOOGLE_CLIENT_ID` - OAuth app ID
- `GOOGLE_CLIENT_SECRET` - OAuth app secret
- `GOOGLE_CALLBACK_URL` - Redirect URI after OAuth (default: `http://localhost:3000/auth/callback`)

**Required env vars - Academy Service:**

- `MONGODB_URI` - Database connection string

**Required env vars - Course Service:**

- `MONGODB_URI` - Database connection string
- `JWT_ACCESS_SECRET` - Token validation (inherited from shared middleware)

**Required env vars - Media Service:**

- `JWT_ACCESS_SECRET` - Token validation
- `CLOUDINARY_CLOUD_NAME` - Cloudinary account identifier
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (full access, server-side only)
- `SUPABASE_BUCKET` - Storage bucket name (default: `documents`)

**Secrets location:**
- `.env` files in each service (NOT committed; .env.example provided as templates)

## Webhooks & Callbacks

**Incoming:**
- Google OAuth callback: POST to `GOOGLE_CALLBACK_URL` (frontend route `/auth/callback`)

**Outgoing:**
- None configured

## Inter-Service Communication

**Service-to-Service:**
- Frontend → Backend: HTTP/REST via Axios (all services)
  - Base instances: `frontend/api/axios.api.ts` (general) + service-specific instances
  - Headers: Bearer token in `Authorization` header
  - Credentials: `withCredentials: true` (cookies enabled)

**Services:**
- User-service: Port 8001 - Authentication, user management
- Academy-service: Port 8002 - Classes, subjects, rooms, recommendations
- Course-service: Port 8003 - Courses, modules, lessons, content blocks
- Media-service: Port 8004 - Image and document uploads

## Content Block Types

**Lesson Content (course-service):**

Lessons contain a `contents` array with blocks of type:

- `text` - Rich HTML content (Tiptap editor output in `body` field)
- `image` - Cloudinary URL in `url` field
- `document` - Supabase path with metadata:
  - `url` - Path in Supabase Storage
  - `originalName` - Original filename
  - `size` - File size in bytes
  - `mimeType` - MIME type (e.g., `application/pdf`)

Full content array is replaced on every PUT request (no partial updates).

---

*Integration audit: 2026-03-18*
