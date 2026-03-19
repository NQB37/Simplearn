import { test, expect } from '@playwright/test';

test.describe('Admin Student Account Creation', () => {
  // ACCT-01: Admin can create a student account via the form
  test.skip('admin can navigate to create student page from user list', async ({ page }) => {
    // TODO: Navigate to /admin/users, click "Create Student" button, verify /admin/users/new
  });

  test.skip('admin can fill and submit the create student form', async ({ page }) => {
    // TODO: Fill firstName, lastName, verify email auto-generates
    // TODO: Fill optional personal fields (DOB, phone, address)
    // TODO: Fill optional academic fields
    // TODO: Submit form, verify redirect to /admin/users
    // TODO: Verify success toast with default password
    // TODO: Verify new student appears in user list
  });

  test.skip('duplicate email shows inline error under email field', async ({ page }) => {
    // TODO: Submit form with an existing email
    // TODO: Verify inline error message appears under email field
  });

  // ACCT-02: Created student can log in with default password
  test.skip('newly created student can log in with default password', async ({ page }) => {
    // TODO: Create student via form
    // TODO: Log out admin
    // TODO: Log in as new student with email and simplearn123
    // TODO: Verify successful login
  });
});
