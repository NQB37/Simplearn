# Technology Stack

**Analysis Date:** 2026-03-18

## Frontend
- **Framework:** Next.js 15+ (React 19)
- **Styling:** Tailwind CSS v4
- **Components:** Radix UI, Shadcn UI, Lucide React
- **State Management:** Zustand 5.x
- **Data Fetching:** TanStack Query (React Query) 5.x, Axios 1.x
- **Forms & Validation:** React Hook Form, Zod 3.x
- **Rich Text Editor:** Tiptap / @tiptap/react

## Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5.x
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose 9.x
- **Validation:** Zod 3.x
- **Security:** JWT (jsonwebtoken), Bcryptjs

## Shared Libraries
- **@simplearn/logger:** Shared logging utility (Winston/Morgan)
- **@simplearn/middlewares:** Shared Express middlewares (Auth, RBAC, Error Handling)

## Infrastructure & Tooling
- **Package Manager:** npm
- **Execution:** tsx (TypeScript execution)
- **API Client (Backend):** Axios
- **Message Broker:** RabbitMQ (planned/referenced for microservices communication)

## Testing
- **Unit/Integration:** Vitest
- **End-to-End:** Playwright
- **Utilities:** @testing-library/react, @testing-library/jest-dom
