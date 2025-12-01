/**
 * Group 7: Protected API Tests
 * Tests authenticated endpoints (applications, messages, notifications)
 */

import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://127.0.0.1:3001/api';

const existingUser = {
  email: 'priya@example.com',
  password: 'password123',
};

let authToken: string;

test.describe('Group 7: Protected APIs', () => {
  
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/login`, {
      data: {
        email: existingUser.email,
        password: existingUser.password,
      },
    });
    const data = await response.json();
    authToken = data.token;
  });

  test.describe('Scheme Applications', () => {
    test('TC-PROT-001: Get my scheme applications', async ({ request }) => {
      const response = await request.get(`${API_URL}/schemes/my-applications`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();

      console.log(`✅ My scheme applications - ${data.length}`);
    });

    test('TC-PROT-002: Apply for scheme', async ({ request }) => {
      const schemesResponse = await request.get(`${API_URL}/schemes`);
      const schemes = await schemesResponse.json();

      if (schemes.length > 0) {
        const response = await request.post(`${API_URL}/schemes/${schemes[0].id}/apply`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        // 201 = new application, 409 = already applied
        expect([201, 409]).toContain(response.status());

        console.log(`✅ Apply for scheme - status: ${response.status()}`);
      } else {
        console.log('ℹ️ No schemes to apply');
      }
    });
  });

  test.describe('Job Applications', () => {
    test('TC-PROT-003: Get my job applications', async ({ request }) => {
      const response = await request.get(`${API_URL}/jobs/my-applications`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();

      console.log(`✅ My job applications - ${data.length}`);
    });

    test('TC-PROT-004: Apply for job', async ({ request }) => {
      const jobsResponse = await request.get(`${API_URL}/jobs`);
      const jobs = await jobsResponse.json();

      if (jobs.length > 0) {
        const response = await request.post(`${API_URL}/jobs/${jobs[0].id}/apply`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        expect([201, 409]).toContain(response.status());

        console.log(`✅ Apply for job - status: ${response.status()}`);
      } else {
        console.log('ℹ️ No jobs to apply');
      }
    });
  });

  test.describe('Event Attendance', () => {
    test('TC-PROT-005: Get my events', async ({ request }) => {
      const response = await request.get(`${API_URL}/events/my-events`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();

      console.log(`✅ My events - ${data.length}`);
    });

    test('TC-PROT-006: Attend event', async ({ request }) => {
      const eventsResponse = await request.get(`${API_URL}/events`);
      const events = await eventsResponse.json();

      if (events.length > 0) {
        const response = await request.post(`${API_URL}/events/${events[0].id}/attend`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        expect([200, 201, 409]).toContain(response.status());

        console.log(`✅ Attend event - status: ${response.status()}`);
      } else {
        console.log('ℹ️ No events to attend');
      }
    });
  });

  test.describe('Notifications', () => {
    test('TC-PROT-007: Get notifications', async ({ request }) => {
      const response = await request.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();

      console.log(`✅ Get notifications - ${data.length}`);
    });

    test('TC-PROT-008: Mark all notifications as read', async ({ request }) => {
      const response = await request.put(`${API_URL}/notifications/read-all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.ok()).toBeTruthy();

      console.log('✅ Mark all read works');
    });
  });

  test.describe('Messages', () => {
    test('TC-PROT-009: Get conversations', async ({ request }) => {
      const response = await request.get(`${API_URL}/messages/conversations`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();

      console.log(`✅ Get conversations - ${data.length}`);
    });
  });

  test.describe('Search', () => {
    test('TC-PROT-010: Search with query', async ({ request }) => {
      const response = await request.get(`${API_URL}/search?q=test`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data).toHaveProperty('users');
      expect(data).toHaveProperty('posts');

      console.log(`✅ Search works - ${data.users?.length || 0} users, ${data.posts?.length || 0} posts`);
    });
  });
});
