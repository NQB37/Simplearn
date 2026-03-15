# Frontend Refactor Design Spec

**Date:** 2026-03-15
**Status:** Approved
**Topic:** Addressing CRITICAL/HIGH/MEDIUM issues in the frontend from `docs/review.md`.

## 1. Overview
This design aims to resolve architectural, state management, and API communication issues in the Simplearn frontend. Key improvements include implementing TanStack Query for data fetching, centralizing API calls through a service layer, and refactoring the oversized `admin/academics/page.tsx` into modular, entity-specific components.

## 2. Architecture: Services & Data-Fetching

### Services Layer
- **Location:** `frontend/lib/services/academy.service.ts`
- **Responsibility:** Centralize all API calls to the Academy microservice.
- **Design:** Encapsulate `process.env.NEXT_PUBLIC_ACADEMY_SERVICE_URL` and use `axiosInstance`.
- **Interface Examples:**
  ```typescript
  export const academyService = {
    getAcademicYears: () => axiosInstance.get('/academic-years'),
    createAcademicYear: (data: any) => axiosInstance.post('/academic-years', data),
    // ... other methods for rooms, subjects, classes
  };
  ```

### TanStack Query (React Query)
- **Integration:** Wrap services in custom hooks to manage caching, loading states, and automatic revalidation.
- **Hook Examples:**
  ```typescript
  export const useAcademicYears = () => useQuery({
    queryKey: ['academic-years'],
    queryFn: academyService.getAcademicYears,
  });
  ```
- **Mutation Revalidation:** Use `queryClient.invalidateQueries` after successful Add/Edit/Delete actions.

## 3. Component Refactoring: Entity-Specific Managers

### Decomposition of `admin/academics/page.tsx`
The single 17KB file will be broken into:
- `frontend/components/features/academics/academic-years-manager.tsx`
- `frontend/components/features/academics/rooms-manager.tsx`
- `frontend/components/features/academics/subjects-manager.tsx`
- `frontend/components/features/academics/classes-manager.tsx`

### Responsibilities
Each Manager component will:
- Use its specific TanStack Query hooks for data management.
- Render its own `Card`, `Table`, and relevant `Modal` components (e.g., `AddYearModal`).
- Handle local loading and error states.

### Main Page Orchestration
- `frontend/app/admin/academics/page.tsx` will become a lightweight container using Next.js `Tabs` to switch between the four Manager components.

## 4. API Communication & Security
- **Axios Configuration:** Update `frontend/api/axios.api.ts` to handle base URLs more flexibly if needed, though domain services are the primary abstraction.
- **Validation:** Use shared Zod schemas (where possible) to ensure frontend validation strictly matches backend requirements.

## 5. Testing Strategy

### E2E Testing (Playwright)
- **File:** `frontend/tests/e2e/admin-academics.spec.ts`
- **Flows:** Tab switching, list rendering, form submission in modals, and success/error toast verification.

### Unit/Component Testing (Vitest + RTL)
- **Services:** Test `academy.service.ts` for correct URL construction and error handling.
- **Components:** Test `ClassesManager` for complex rendering logic (e.g., resolving IDs to names).

## 6. Success Criteria
- [ ] `admin/academics/page.tsx` size reduced by >60%.
- [ ] No direct `process.env` references in UI components.
- [ ] Data fetching boilerplate (useEffect/useState) removed in favor of `useQuery`.
- [ ] 100% pass rate for new E2E tests for Academics management.
