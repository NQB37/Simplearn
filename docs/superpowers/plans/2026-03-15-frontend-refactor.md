# Frontend Refactor Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Address CRITICAL/HIGH/MEDIUM issues in the frontend by implementing a centralized service layer, TanStack Query for data fetching, and modularizing the Academics management UI.

**Architecture:** 
- Centralize API calls in `lib/services/academy.service.ts`.
- Use TanStack Query hooks for state and cache management.
- Refactor `admin/academics/page.tsx` into smaller, entity-specific manager components.

**Tech Stack:** Next.js 16, React 19, TanStack Query v5, Axios, Tailwind CSS v4, Shadcn UI.

---

### Task 1: Setup TanStack Query

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/components/providers/query-provider.tsx`
- Modify: `frontend/app/layout.tsx`

- [ ] **Step 1: Install TanStack Query**
- [ ] **Step 2: Create Query Provider**
- [ ] **Step 3: Register Provider in Layout**
- [ ] **Step 4: Commit**

---

### Task 2: Centralized Academy Service

**Files:**
- Create: `frontend/lib/services/academy.service.ts`

- [ ] **Step 1: Implement Service Layer**
- [ ] **Step 2: Commit**

---

### Task 3: Custom Data Fetching Hooks

**Files:**
- Create: `frontend/hooks/use-academics.ts`

- [ ] **Step 1: Create useQuery hooks**
- [ ] **Step 2: Create useMutation hooks**
- [ ] **Step 3: Commit**

---

### Task 4: Modularize Academics Managers

**Files:**
- Create: `frontend/components/features/academics/academic-years-manager.tsx`
- Create: `frontend/components/features/academics/rooms-manager.tsx`
- Create: `frontend/components/features/academics/subjects-manager.tsx`
- Create: `frontend/components/features/academics/classes-manager.tsx`
- Modify: `frontend/app/admin/academics/page.tsx`

- [ ] **Step 1: Implement Academic Years Manager**
- [ ] **Step 2: Implement other Managers**
- [ ] **Step 3: Refactor Main Page**
- [ ] **Step 4: Commit**

---

### Task 5: E2E Testing with Playwright

**Files:**
- Create: `frontend/tests/e2e/admin-academics.spec.ts`

- [ ] **Step 1: Write E2E Test**
- [ ] **Step 2: Run and Verify**
- [ ] **Step 3: Commit**
