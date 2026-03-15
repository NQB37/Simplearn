# Backend Security and Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Address CRITICAL and HIGH priority issues in the backend as identified in the review report, including security vulnerabilities, broken dependencies, and version mismatches.

**Architecture:** Surgical fixes to existing middlewares and controllers, restoration of the shared logger, and setup of a testing environment.

**Tech Stack:** Node.js, Express 5, MongoDB, Vitest.

---

## Chunk 1: Security Fixes

### Task 1: Fix Privilege Escalation in User Service

**Files:**
- Modify: `backend/user-service/src/middlewares/validation.middleware.ts`
- Modify: `backend/user-service/src/controllers/auth.controller.ts`

- [x] **Step 1: Update validation middleware to strip unknown keys and replace req.body**
- [x] **Step 2: Remove explicit role destructuring in auth controller**
- [x] **Step 3: Update auth service register signature**

### Task 2: Secure Refresh Token Handling

**Files:**
- Modify: `backend/user-service/src/controllers/auth.controller.ts`

- [x] **Step 1: Improve secure cookie flag logic**

### Task 3: Remove Hardcoded Secrets in Academy Service

**Files:**
- Modify: `backend/academy-service/src/routes/*.route.ts`
- Create: `backend/academy-service/src/config/env.config.ts` (structured)

- [x] **Step 1: Create structured env.config.ts for academy-service**
- [x] **Step 2: Update routes to use config instead of process.env.JWT_SECRET || 'secret'**

---

## Chunk 2: Shared Library & Dependency Fixes

### Task 4: Restore @simplearn/logger

**Files:**
- Create: `backend/shared/logger/package.json`
- Create: `backend/shared/logger/src/index.ts`
- Create: `backend/shared/logger/tsconfig.json`

- [x] **Step 1: Implement basic winston logger in shared directory**

### Task 5: Align Middleware with Express 5

**Files:**
- Modify: `backend/shared/middlewares/package.json`

- [x] **Step 1: Update express dependency to ^5.0.0**
- [x] **Step 2: Run npm install and build in shared/middlewares**

---

## Chunk 3: Testing Suite Setup

### Task 6: Setup Vitest for User Service

**Files:**
- Modify: `backend/user-service/package.json`
- Create: `backend/user-service/vitest.config.ts`
- Create: `backend/user-service/src/services/auth.service.test.ts`

- [x] **Step 1: Install vitest and dependencies**
- [x] **Step 2: Create initial tests for registration and login**
