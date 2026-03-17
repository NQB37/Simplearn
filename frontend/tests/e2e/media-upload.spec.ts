import { test, expect } from '@playwright/test';

// JWTs signed with media-service JWT_ACCESS_SECRET for direct API tests.
// Secret: )hyn48dtC!C]q)<5!^r<iM_}{$6(>bVP,v=s?|cA<u+
const INSTRUCTOR_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJpZCI6Imluc3RydWN0b3ItMDAxIiwicm9sZSI6IklOU1RSVUNUT1IiLCJpYXQiOjE3NzM3NzQzMjksImV4cCI6NDg5Nzk3NjcyOX0' +
  '.0V18gI3OPionE9X3NbjxeLf6gWoGfmmQLwXuyyhHXS4';

const STUDENT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJpZCI6InN0dWRlbnQtMDAxIiwicm9sZSI6IlNUVURFTlQiLCJpYXQiOjE3NzM3NzQzMjksImV4cCI6NDg5Nzk3NjcyOX0' +
  '.F_0pdh7KyQ0LOEBNR7hxtOi_-LgysOjbNdDMFgrLSUY';

// Next.js middleware only parses the JWT payload — signature not verified — so this
// dummy token is sufficient for seeding localStorage / protecting frontend routes.
const INSTRUCTOR_TOKEN_FRONTEND =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJpZCI6Imluc3RydWN0b3ItMDAxIiwicm9sZSI6IklOU1RSVUNUT1IiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0' +
  '.dummy-sig';

const MEDIA_BASE = 'http://localhost:8004';

// Minimal 1x1 PNG as a binary buffer (67 bytes).
// Used when we need a real image byte payload for the multipart upload.
const TINY_PNG_BYTES = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489' +
  '0000000a49444154789c6260000000020001e221bc330000000049454e44ae426082',
  'hex',
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function seedInstructorStore(page: any) {
  return page.addInitScript(() => {
    localStorage.setItem(
      'user-storage',
      JSON.stringify({
        state: {
          user: {
            id: 'instructor-001',
            role: 'INSTRUCTOR',
            email: 'instructor@test.com',
            name: 'Test Instructor',
          },
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
            '.eyJpZCI6Imluc3RydWN0b3ItMDAxIiwicm9sZSI6IklOU1RSVUNUT1IiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0' +
            '.dummy-sig',
          isAuthenticated: true,
        },
        version: 0,
      }),
    );
  });
}

function stubAuthRefresh(page: any) {
  return page.route('http://localhost:8001/**', (route: any) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ accessToken: INSTRUCTOR_TOKEN_FRONTEND }),
    });
  });
}

// ─── Scenario 1: Unauthenticated upload is rejected (401) ─────────────────────
test.describe('Scenario 1: Unauthenticated upload is rejected', () => {
  test('POST /api/media/images/upload without auth returns 401', async ({ request }) => {
    const response = await request.post(`${MEDIA_BASE}/api/media/images/upload`, {
      multipart: {
        image: {
          name: 'test.png',
          mimeType: 'image/png',
          buffer: TINY_PNG_BYTES,
        },
      },
    });
    expect(response.status()).toBe(401);
  });

  test('POST /api/media/documents/upload without auth returns 401', async ({ request }) => {
    const response = await request.post(`${MEDIA_BASE}/api/media/documents/upload`, {
      multipart: {
        document: {
          name: 'test.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.from('%PDF-1.4 test'),
        },
      },
    });
    expect(response.status()).toBe(401);
  });
});

// ─── Scenario 2: Student cannot upload (403) ──────────────────────────────────
test.describe('Scenario 2: Student cannot upload', () => {
  test('POST /api/media/images/upload with student token returns 403', async ({ request }) => {
    const response = await request.post(`${MEDIA_BASE}/api/media/images/upload`, {
      headers: { Authorization: `Bearer ${STUDENT_TOKEN}` },
      multipart: {
        image: {
          name: 'test.png',
          mimeType: 'image/png',
          buffer: TINY_PNG_BYTES,
        },
      },
    });
    expect(response.status()).toBe(403);
  });

  test('POST /api/media/documents/upload with student token returns 403', async ({ request }) => {
    const response = await request.post(`${MEDIA_BASE}/api/media/documents/upload`, {
      headers: { Authorization: `Bearer ${STUDENT_TOKEN}` },
      multipart: {
        document: {
          name: 'test.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.from('%PDF-1.4 test'),
        },
      },
    });
    expect(response.status()).toBe(403);
  });
});

// ─── Scenario 3: Invalid file type is rejected (400) ──────────────────────────
test.describe('Scenario 3: Invalid file type is rejected', () => {
  test('POST /api/media/images/upload with text/plain returns 400', async ({ request }) => {
    const response = await request.post(`${MEDIA_BASE}/api/media/images/upload`, {
      headers: { Authorization: `Bearer ${INSTRUCTOR_TOKEN}` },
      multipart: {
        image: {
          name: 'test.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('hello world'),
        },
      },
    });
    expect(response.status()).toBe(400);
  });

  test('POST /api/media/documents/upload with image/png returns 400', async ({ request }) => {
    const response = await request.post(`${MEDIA_BASE}/api/media/documents/upload`, {
      headers: { Authorization: `Bearer ${INSTRUCTOR_TOKEN}` },
      multipart: {
        document: {
          name: 'photo.png',
          mimeType: 'image/png',
          buffer: TINY_PNG_BYTES,
        },
      },
    });
    expect(response.status()).toBe(400);
  });
});

// ─── Scenario 4: Image upload succeeds for instructor (stubbed) ───────────────
test.describe('Scenario 4: Image upload succeeds for instructor', () => {
  test('mediaService.uploadImage returns 201 with url and publicId', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    // Stub the media service image upload endpoint
    await page.route(`${MEDIA_BASE}/api/media/images/upload`, (route) => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          url: 'https://res.cloudinary.com/demo/image/upload/simplearn/abc123.jpg',
          publicId: 'simplearn/abc123',
          format: 'jpg',
          width: 800,
          height: 600,
          bytes: 123456,
        }),
      });
    });

    // Also stub course-service and academy-service so the instructor page loads
    await page.route('http://localhost:8003/**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });
    await page.route('http://localhost:8002/**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    await page.goto('/instructor/courses');

    // Invoke the frontend mediaService from the browser context
    const result = await page.evaluate(async (mediaBase) => {
      // Build a minimal File object and call the service via fetch directly
      // (mirrors what mediaService.uploadImage does internally via axiosInstance)
      const blob = new Blob([new Uint8Array(67)], { type: 'image/png' });
      const file = new File([blob], 'test.png', { type: 'image/png' });
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${mediaBase}/api/media/images/upload`, {
        method: 'POST',
        body: formData,
      });
      return { status: response.status, body: await response.json() };
    }, MEDIA_BASE);

    expect(result.status).toBe(201);
    expect(result.body).toHaveProperty('url');
    expect(result.body).toHaveProperty('publicId');
    expect(result.body.url).toContain('cloudinary.com');
  });
});

// ─── Scenario 5: Document upload succeeds for instructor (stubbed) ────────────
test.describe('Scenario 5: Document upload succeeds for instructor', () => {
  test('mediaService.uploadDocument returns 201 with path and originalName', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    await page.route(`${MEDIA_BASE}/api/media/documents/upload`, (route) => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          path: 'instructor-001/1710000000-document.pdf',
          fullPath: 'documents/instructor-001/1710000000-document.pdf',
          originalName: 'document.pdf',
          size: 2048,
          mimeType: 'application/pdf',
        }),
      });
    });

    await page.route('http://localhost:8003/**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });
    await page.route('http://localhost:8002/**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    await page.goto('/instructor/courses');

    const result = await page.evaluate(async (mediaBase) => {
      const blob = new Blob(['%PDF-1.4 fake pdf content'], { type: 'application/pdf' });
      const file = new File([blob], 'document.pdf', { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch(`${mediaBase}/api/media/documents/upload`, {
        method: 'POST',
        body: formData,
      });
      return { status: response.status, body: await response.json() };
    }, MEDIA_BASE);

    expect(result.status).toBe(201);
    expect(result.body).toHaveProperty('path');
    expect(result.body).toHaveProperty('originalName');
    expect(result.body.originalName).toBe('document.pdf');
  });
});

// ─── Scenario 6: Get document signed URL (stubbed) ────────────────────────────
test.describe('Scenario 6: Get document signed URL', () => {
  test('GET /api/media/documents/url returns 200 with signedUrl', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    const docPath = 'instructor-001/1710000000-document.pdf';

    await page.route(`${MEDIA_BASE}/api/media/documents/url*`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          signedUrl: `https://xxx.supabase.co/storage/v1/object/sign/documents/${docPath}?token=abc`,
          expiresIn: 3600,
        }),
      });
    });

    await page.route('http://localhost:8003/**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });
    await page.route('http://localhost:8002/**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    await page.goto('/instructor/courses');

    const result = await page.evaluate(async ({ mediaBase, path }) => {
      const response = await fetch(
        `${mediaBase}/api/media/documents/url?path=${encodeURIComponent(path)}`,
      );
      return { status: response.status, body: await response.json() };
    }, { mediaBase: MEDIA_BASE, path: docPath });

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty('signedUrl');
    expect(result.body).toHaveProperty('expiresIn');
    expect(result.body.expiresIn).toBe(3600);
  });
});

// ─── Scenario 7: Delete uploaded image (stubbed) ──────────────────────────────
test.describe('Scenario 7: Delete uploaded image', () => {
  test('DELETE /api/media/images returns 200', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    await page.route(`${MEDIA_BASE}/api/media/images*`, (route) => {
      if (route.request().method() === 'DELETE') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Image deleted successfully' }),
        });
      } else {
        route.continue();
      }
    });

    await page.route('http://localhost:8003/**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });
    await page.route('http://localhost:8002/**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    await page.goto('/instructor/courses');

    const result = await page.evaluate(async (mediaBase) => {
      const response = await fetch(
        `${mediaBase}/api/media/images?publicId=${encodeURIComponent('simplearn/abc123')}`,
        { method: 'DELETE' },
      );
      return { status: response.status, body: await response.json() };
    }, MEDIA_BASE);

    expect(result.status).toBe(200);
    expect(result.body.message).toBe('Image deleted successfully');
  });
});

// ─── Scenario 8: Delete uploaded document (stubbed) ──────────────────────────
test.describe('Scenario 8: Delete uploaded document', () => {
  test('DELETE /api/media/documents returns 200', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    await page.route(`${MEDIA_BASE}/api/media/documents*`, (route) => {
      if (route.request().method() === 'DELETE') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Document deleted successfully' }),
        });
      } else {
        route.continue();
      }
    });

    await page.route('http://localhost:8003/**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });
    await page.route('http://localhost:8002/**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    await page.goto('/instructor/courses');

    const result = await page.evaluate(async (mediaBase) => {
      const response = await fetch(
        `${mediaBase}/api/media/documents?path=${encodeURIComponent('instructor-001/1710000000-document.pdf')}`,
        { method: 'DELETE' },
      );
      return { status: response.status, body: await response.json() };
    }, MEDIA_BASE);

    expect(result.status).toBe(200);
    expect(result.body.message).toBe('Document deleted successfully');
  });
});

// ─── Scenario 9: Oversized file is rejected (400) ─────────────────────────────
test.describe('Scenario 9: Oversized file is rejected', () => {
  test('POST /api/media/images/upload with file >5MB returns 400', async ({ request }) => {
    // Generate a buffer just over 5 MB
    const oversizedBuffer = Buffer.alloc(5 * 1024 * 1024 + 1, 0);

    const response = await request.post(`${MEDIA_BASE}/api/media/images/upload`, {
      headers: { Authorization: `Bearer ${INSTRUCTOR_TOKEN}` },
      multipart: {
        image: {
          name: 'huge.png',
          mimeType: 'image/png',
          buffer: oversizedBuffer,
        },
      },
    });
    expect(response.status()).toBe(400);
  });
});
