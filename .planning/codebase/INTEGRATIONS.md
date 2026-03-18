# Integrations

**Analysis Date:** 2026-03-18

## External Services
- **Cloudinary:** Media management and storage (used in `media-service`).
- **Supabase:** Used for storage and potential database features (referenced in `media-service`).
- **Google APIs:** Used in `user-service` via `googleapis` (OAuth2, potentially).

## Authentication & Authorization
- **JWT-based Authentication:** Custom JWT implementation for user sessions.
- **Role-Based Access Control (RBAC):** Roles (ADMIN, INSTRUCTOR, STUDENT) enforced via backend middleware.
- **Bcryptjs:** Secure password hashing.

## Data Storage
- **MongoDB:** Primary NoSQL database for content-heavy services.
- **Local Storage:** `multer` used for temporary or small file uploads.
- **Cloud Storage:** Integration with Cloudinary and Supabase for media assets.

## Communication
- **RESTful APIs:** Frontend-to-backend and service-to-service communication.
- **RabbitMQ:** Mentioned as the intended message broker for asynchronous service communication.
- **Local File Linking:** backend shared packages linked via `file:` in `package.json` for shared logic.
