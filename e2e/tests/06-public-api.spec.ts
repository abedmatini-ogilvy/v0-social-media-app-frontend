/**
 * Group 6: Public API Tests
 * Tests public endpoints (schemes, jobs, events, alerts)
 */

import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://127.0.0.1:3001/api';

test.describe('Group 6: Public APIs', () => {
  
  test.describe('Schemes', () => {
    test('TC-PUBLIC-001: List schemes (no auth required)', async ({ request }) => {
      const response = await request.get(`${API_URL}/schemes`);

      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();

      console.log(`✅ List schemes works - ${data.length} schemes`);
    });

    test('TC-PUBLIC-002: Get single scheme', async ({ request }) => {
      const listResponse = await request.get(`${API_URL}/schemes`);
      const schemes = await listResponse.json();

      if (schemes.length > 0) {
        const response = await request.get(`${API_URL}/schemes/${schemes[0].id}`);
        expect(response.ok()).toBeTruthy();

        const data = await response.json();
        expect(data).toHaveProperty('title');

        console.log(`✅ Get scheme works - ${data.title}`);
      } else {
        console.log('ℹ️ No schemes to test');
      }
    });
  });

  test.describe('Jobs', () => {
    test('TC-PUBLIC-003: List jobs (no auth required)', async ({ request }) => {
      const response = await request.get(`${API_URL}/jobs`);

      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();

      console.log(`✅ List jobs works - ${data.length} jobs`);
    });

    test('TC-PUBLIC-004: Get single job', async ({ request }) => {
      const listResponse = await request.get(`${API_URL}/jobs`);
      const jobs = await listResponse.json();

      if (jobs.length > 0) {
        const response = await request.get(`${API_URL}/jobs/${jobs[0].id}`);
        expect(response.ok()).toBeTruthy();

        const data = await response.json();
        expect(data).toHaveProperty('title');
        expect(data).toHaveProperty('company');

        console.log(`✅ Get job works - ${data.title}`);
      } else {
        console.log('ℹ️ No jobs to test');
      }
    });
  });

  test.describe('Events', () => {
    test('TC-PUBLIC-005: List events (no auth required)', async ({ request }) => {
      const response = await request.get(`${API_URL}/events`);

      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();

      console.log(`✅ List events works - ${data.length} events`);
    });

    test('TC-PUBLIC-006: Get single event', async ({ request }) => {
      const listResponse = await request.get(`${API_URL}/events`);
      const events = await listResponse.json();

      if (events.length > 0) {
        const response = await request.get(`${API_URL}/events/${events[0].id}`);
        expect(response.ok()).toBeTruthy();

        const data = await response.json();
        expect(data).toHaveProperty('title');
        expect(data).toHaveProperty('location');

        console.log(`✅ Get event works - ${data.title}`);
      } else {
        console.log('ℹ️ No events to test');
      }
    });
  });

  test.describe('Emergency Alerts', () => {
    test('TC-PUBLIC-007: List emergency alerts (no auth required)', async ({ request }) => {
      const response = await request.get(`${API_URL}/emergency-alerts`);

      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();

      console.log(`✅ List alerts works - ${data.length} alerts`);
    });
  });
});
