/**
 * Schemes, Jobs, and Events E2E Tests for CivicConnect
 * Tests: List, View, Apply, My Applications
 */

import { test, expect } from '@playwright/test';
import {
  config,
  loginViaUI,
  getAuthToken,
} from '../helpers/test-utils';
import { seedUsers, apiEndpoints } from '../fixtures/test-data';

// ==================== SCHEMES TESTS ====================

test.describe('Schemes - List & View', () => {
  test('TC-SCHEME-001: API - Should list all schemes (public)', async ({ page }) => {
    const response = await page.request.get(`${config.apiUrl}/schemes`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    console.log(`✅ Retrieved ${data.length} schemes`);
  });

  test('TC-SCHEME-002: API - Should get single scheme by ID', async ({ page }) => {
    // First get list to find a scheme ID
    const listResponse = await page.request.get(`${config.apiUrl}/schemes`);
    const schemes = await listResponse.json();

    if (schemes.length > 0) {
      const schemeId = schemes[0].id;

      const response = await page.request.get(`${config.apiUrl}/schemes/${schemeId}`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.id).toBe(schemeId);
      expect(data).toHaveProperty('title');
      expect(data).toHaveProperty('description');

      console.log(`✅ Retrieved scheme: ${data.title}`);
    } else {
      console.log('ℹ️ No schemes available for testing');
    }
  });

  test('TC-SCHEME-003: UI - Should display schemes page', async ({ page }) => {
    await page.goto('/schemes');
    await page.waitForLoadState('networkidle');

    // Verify schemes page loaded
    const content = page.locator('main, [data-testid="schemes"], .schemes');
    await expect(content.first()).toBeVisible();

    console.log('✅ Schemes page displayed');
  });
});

test.describe('Schemes - Applications', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-SCHEME-004: API - Should apply for a scheme', async ({ page }) => {
    const token = await getAuthToken(page);

    // Get available schemes
    const listResponse = await page.request.get(`${config.apiUrl}/schemes`);
    const schemes = await listResponse.json();

    if (schemes.length > 0) {
      const schemeId = schemes[0].id;

      const response = await page.request.post(`${config.apiUrl}/schemes/${schemeId}/apply`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Either success (201) or already applied (409)
      expect([201, 409]).toContain(response.status());

      if (response.status() === 201) {
        const data = await response.json();
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('status');
        console.log(`✅ Applied for scheme: ${schemes[0].title}`);
      } else {
        console.log('ℹ️ Already applied for this scheme');
      }
    } else {
      console.log('ℹ️ No schemes available for application testing');
    }
  });

  test('TC-SCHEME-005: API - Should get my scheme applications', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.get(`${config.apiUrl}/schemes/my-applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    console.log(`✅ Retrieved ${data.length} scheme applications`);
  });

  test('TC-SCHEME-006: API - Should not apply without authentication', async ({ page }) => {
    const listResponse = await page.request.get(`${config.apiUrl}/schemes`);
    const schemes = await listResponse.json();

    if (schemes.length > 0) {
      const response = await page.request.post(`${config.apiUrl}/schemes/${schemes[0].id}/apply`);
      expect(response.status()).toBe(401);
    }
  });
});

// ==================== JOBS TESTS ====================

test.describe('Jobs - List & View', () => {
  test('TC-JOB-001: API - Should list all jobs (public)', async ({ page }) => {
    const response = await page.request.get(`${config.apiUrl}/jobs`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    console.log(`✅ Retrieved ${data.length} jobs`);
  });

  test('TC-JOB-002: API - Should get single job by ID', async ({ page }) => {
    const listResponse = await page.request.get(`${config.apiUrl}/jobs`);
    const jobs = await listResponse.json();

    if (jobs.length > 0) {
      const jobId = jobs[0].id;

      const response = await page.request.get(`${config.apiUrl}/jobs/${jobId}`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.id).toBe(jobId);
      expect(data).toHaveProperty('title');
      expect(data).toHaveProperty('company');

      console.log(`✅ Retrieved job: ${data.title} at ${data.company}`);
    } else {
      console.log('ℹ️ No jobs available for testing');
    }
  });

  test('TC-JOB-003: UI - Should display jobs page', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');

    const content = page.locator('main, [data-testid="jobs"], .jobs');
    await expect(content.first()).toBeVisible();

    console.log('✅ Jobs page displayed');
  });
});

test.describe('Jobs - Applications', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-JOB-004: API - Should apply for a job', async ({ page }) => {
    const token = await getAuthToken(page);

    const listResponse = await page.request.get(`${config.apiUrl}/jobs`);
    const jobs = await listResponse.json();

    if (jobs.length > 0) {
      const jobId = jobs[0].id;

      const response = await page.request.post(`${config.apiUrl}/jobs/${jobId}/apply`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect([201, 409]).toContain(response.status());

      if (response.status() === 201) {
        const data = await response.json();
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('status');
        console.log(`✅ Applied for job: ${jobs[0].title}`);
      } else {
        console.log('ℹ️ Already applied for this job');
      }
    } else {
      console.log('ℹ️ No jobs available for application testing');
    }
  });

  test('TC-JOB-005: API - Should get my job applications', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.get(`${config.apiUrl}/jobs/my-applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    console.log(`✅ Retrieved ${data.length} job applications`);
  });

  test('TC-JOB-006: API - Should not apply without authentication', async ({ page }) => {
    const listResponse = await page.request.get(`${config.apiUrl}/jobs`);
    const jobs = await listResponse.json();

    if (jobs.length > 0) {
      const response = await page.request.post(`${config.apiUrl}/jobs/${jobs[0].id}/apply`);
      expect(response.status()).toBe(401);
    }
  });
});

// ==================== EVENTS TESTS ====================

test.describe('Events - List & View', () => {
  test('TC-EVENT-001: API - Should list all events (public)', async ({ page }) => {
    const response = await page.request.get(`${config.apiUrl}/events`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    console.log(`✅ Retrieved ${data.length} events`);
  });

  test('TC-EVENT-002: API - Should get single event by ID', async ({ page }) => {
    const listResponse = await page.request.get(`${config.apiUrl}/events`);
    const events = await listResponse.json();

    if (events.length > 0) {
      const eventId = events[0].id;

      const response = await page.request.get(`${config.apiUrl}/events/${eventId}`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.id).toBe(eventId);
      expect(data).toHaveProperty('title');
      expect(data).toHaveProperty('date');
      expect(data).toHaveProperty('location');

      console.log(`✅ Retrieved event: ${data.title}`);
    } else {
      console.log('ℹ️ No events available for testing');
    }
  });

  test('TC-EVENT-003: UI - Should display events page', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    const content = page.locator('main, [data-testid="events"], .events');
    await expect(content.first()).toBeVisible();

    console.log('✅ Events page displayed');
  });
});

test.describe('Events - Attendance', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-EVENT-004: API - Should attend an event', async ({ page }) => {
    const token = await getAuthToken(page);

    const listResponse = await page.request.get(`${config.apiUrl}/events`);
    const events = await listResponse.json();

    if (events.length > 0) {
      const eventId = events[0].id;

      const response = await page.request.post(`${config.apiUrl}/events/${eventId}/attend`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect([200, 201, 409]).toContain(response.status());

      if (response.status() === 200 || response.status() === 201) {
        console.log(`✅ Registered for event: ${events[0].title}`);
      } else {
        console.log('ℹ️ Already registered for this event');
      }
    } else {
      console.log('ℹ️ No events available for attendance testing');
    }
  });

  test('TC-EVENT-005: API - Should get my events', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.get(`${config.apiUrl}/events/my-events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    console.log(`✅ Retrieved ${data.length} registered events`);
  });

  test('TC-EVENT-006: API - Should not attend without authentication', async ({ page }) => {
    const listResponse = await page.request.get(`${config.apiUrl}/events`);
    const events = await listResponse.json();

    if (events.length > 0) {
      const response = await page.request.post(`${config.apiUrl}/events/${events[0].id}/attend`);
      expect(response.status()).toBe(401);
    }
  });
});

// ==================== EMERGENCY ALERTS TESTS ====================

test.describe('Emergency Alerts', () => {
  test('TC-ALERT-001: API - Should list emergency alerts (public)', async ({ page }) => {
    const response = await page.request.get(`${config.apiUrl}/emergency-alerts`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    console.log(`✅ Retrieved ${data.length} emergency alerts`);
  });

  test('TC-ALERT-002: API - Should get single alert by ID', async ({ page }) => {
    const listResponse = await page.request.get(`${config.apiUrl}/emergency-alerts`);
    const alerts = await listResponse.json();

    if (alerts.length > 0) {
      const alertId = alerts[0].id;

      const response = await page.request.get(`${config.apiUrl}/emergency-alerts/${alertId}`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.id).toBe(alertId);
      expect(data).toHaveProperty('title');
      expect(data).toHaveProperty('message');

      console.log(`✅ Retrieved alert: ${data.title}`);
    } else {
      console.log('ℹ️ No emergency alerts available for testing');
    }
  });
});
