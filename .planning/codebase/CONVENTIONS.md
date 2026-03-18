# Coding Conventions

**Analysis Date:** 2026-03-18

## Naming Patterns

**Files:**
- Services: `[feature].service.ts` (e.g., `course.service.ts`, `auth.service.ts`)
- Controllers: `[feature].controller.ts` (e.g., `class.controller.ts`)
- Models: `[feature].model.ts` (e.g., `course.model.ts`, `user.model.ts`)
- Routes: `[feature].route.ts` (e.g., `course.route.ts`)
- Hooks: `use-[feature].ts` (e.g., `use-courses.ts`, `use-academics.ts`)
- Components: `kebab-case.tsx` (e.g., `create-course-modal.tsx`, `delete-course-modal.tsx`)
- Types: `[feature].type.ts` (e.g., `course.type.ts`, `index.type.ts`)
- Config: `[feature].config.ts` (e.g., `env.config.ts`, `database.config.ts`)
- Test files: `[file].test.ts` or `[file].spec.ts` (co-located with source)

**Functions:**
- camelCase: `getCourses()`, `createLesson()`, `updateModule()`
- Async functions: `async function getCourses()` or `export const getCourses = async ()`
- Handler functions: `handle[Action]` (e.g., `handleSave`, `handleDelete`)
- Getter functions: `get[Noun]` (e.g., `getClasses`, `getCourseBySlug`)

**Variables:**
- camelCase: `classForm`, `myCourses`, `enrolledStudents`
- State setters: `set[State]` (e.g., `setIsOpen`, `setClassForm`, `setUser`)
- Boolean prefixes: `is`, `has`, `can`, `should` (e.g., `isOpen`, `isLoading`, `hasError`)
- API URLs: `[SERVICE]_BASE_URL` (e.g., `COURSE_BASE_URL`)

**Types:**
- Interfaces: PascalCase with `I` prefix for Mongoose interfaces (e.g., `ICourse`, `IUser`, `IClass`)
- Type aliases: PascalCase (e.g., `CreateCoursePayload`, `UserStore`)
- Enums: PascalCase (e.g., `Status`, `Role`)
- Constants: UPPER_SNAKE_CASE for module-level (e.g., `STUB_COURSES`, `INSTRUCTOR_TOKEN`)

## Code Style

**Formatting:**
- No explicit formatter configured; ESLint enforces style
- Indentation: 2 spaces (implicit, enforced by linters)
- Line length: No strict limit observed
- Trailing semicolons: Yes

**Linting:**
- Frontend: ESLint with `eslint-config-next` (core-web-vitals + typescript) — see `frontend/eslint.config.mjs`
- Backend: No ESLint config; TypeScript compiler (strict mode) enforces type safety
- Command: `npm run lint` (frontend only)

**TypeScript Strictness:**
- Frontend: `strict: true` in `tsconfig.json`
- Backend (user-service, course-service): `strict: true`
- Target: ES2017 (frontend), ES2022/ES2023 (backend)
- Module resolution: `bundler` (frontend), `NodeNext` (backend)

## Import Organization

**Order:**
1. External packages (`import express from 'express'`)
2. Internal types/interfaces (`import { ICourse } from '../models/course.model.js'`)
3. Services, utilities, helpers (`import * as courseService from '../services/course.service.js'`)
4. Local/relative imports (`import { Button } from '@/components/ui/button'`)

**Path Aliases:**
- Frontend: `@/*` → root directory (e.g., `@/components/ui/button`, `@/lib/services/course.service`)
- Backend: No path aliases; relative imports from `src/`

**ES Modules:**
- Backend services use ES modules (`"type": "module"` in package.json)
- Backend imports end with `.js` extension in import statements (e.g., `from '../models/course.model.js'`)
- Frontend uses ES modules with TypeScript

## Error Handling

**Patterns:**
- Try-catch in async functions with `catch (err: any)` or `catch (error: any)`
- Controllers catch errors and return HTTP status codes with `res.status(code).json({ error: message })`
- Services throw errors or return null for "not found" cases
- Frontend uses `toast` from `sonner` package for user-facing errors: `toast.error('Failed to create course')`
- Console error logging on backend: `console.error('Error message:', error)`

**Example (Backend Controller):**
```typescript
export const createClass = async (req: Request, res: Response) => {
  try {
    const newClass = await classService.createClass(req.body);
    res.status(201).json(newClass);
  } catch (err: any) {
    console.error('Error creating class', err);
    res.status(400).json({ error: err.message });
  }
};
```

**Example (Frontend Service):**
```typescript
const createMutation = useMutation({
  mutationFn: (payload: CreateCoursePayload) => courseService.createCourse(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['courses'] });
    toast.success('Course created successfully');
  },
  onError: () => toast.error('Failed to create course'),
});
```

## Logging

**Framework:** `console.log()`, `console.error()` — no Winston logger setup in user-service yet

**Patterns:**
- Error logging: `console.error('Operation context', error)`
- No info/debug logging observed
- Axios interceptor logs: `console.error('Session expired. Please login again.')`

## Comments

**When to Comment:**
- Complex auth logic (e.g., JWT payload parsing, refresh token flow)
- Stub/mock data in tests: `// Stub course data keyed by instructorId == instructor-001`
- API endpoint expectations: `// Returns 501 (not implemented)`
- Important assumptions: `// Next.js middleware only parses the payload, it does not verify the signature`

**JSDoc/TSDoc:**
- Not extensively used
- Type annotations preferred over JSDoc for parameter/return documentation
- Service interfaces are typed with TypeScript

**Example (Backend Service):**
```typescript
export const createCourse = async (data: {
  title: string;
  slug: string;
  description: string;
  subjectId: string;
  instructorId: string;
}): Promise<ICourse> => {
  const newCourse = new Course(data);
  return newCourse.save();
};
```

## Function Design

**Size:**
- Small, focused functions (avg 10-20 lines)
- Controllers delegate to services
- Services handle business logic; models handle data

**Parameters:**
- Named parameters preferred: `{ courseId, moduleId }` over positional
- Object destructuring in function signature: `async ({ lessonId, data }: { lessonId: string; data: { ... } })`
- Type annotations on all parameters

**Return Values:**
- Explicit return types: `Promise<ICourse[]>`, `Promise<ICourse | null>`
- Services return Mongoose models or null
- Controllers return JSON responses via `res.json()` or `res.status().json()`
- Frontend hooks return typed Query/Mutation objects

**Example (Frontend Hook):**
```typescript
export function useCourseBySlug(slug: string) {
  return useQuery({
    queryKey: ['courses', slug],
    queryFn: () => courseService.getCourseBySlug(slug),
    enabled: !!slug,
  });
}
```

## Module Design

**Exports:**
- Named exports for functions: `export const getCourses = async () => { ... }`
- Default exports for Mongoose models: `export default mongoose.model<ICourse>('Course', CourseSchema)`
- Barrel exports in services via object literal: `export const courseService = { getCourses, ... }`

**Example (Frontend Service):**
```typescript
export const courseService = {
  getCourses: async (): Promise<Course[]> => { ... },
  getCourseBySlug: async (slug: string): Promise<Course> => { ... },
  createCourse: async (payload: CreateCoursePayload): Promise<{ course: Course }> => { ... },
};
```

**Barrel Files:**
- Not extensively used
- Imports are explicit: `import * as courseService from '../services/course.service.js'`

## Frontend-Specific Conventions

**React Components:**
- Functional components with hooks
- `'use client'` directive at top of client components
- State management: Zustand for global auth state (`useUserStore`)
- Data fetching: TanStack React Query (`useQuery`, `useMutation`)
- Form state: Local `useState` for form data (e.g., `[classForm, setClassForm]`)

**Component Patterns:**
- Dialog/Modal wrapper components (e.g., `AddClassModal`, `DeleteCourseModal`)
- Re-export UI primitives from `@/components/ui/` (Shadcn/UI)
- Icons from `lucide-react`
- Form validation with `zod` + `react-hook-form`

---

*Convention analysis: 2026-03-18*
