/**
 * Group 5: Users API Tests
 * Tests profile, connections via API
 */

import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://127.0.0.1:3001/api';

const existingUser = {
  email: 'priya@example.com',
  password: 'password123',
  name: 'Priya Sharma',
};

let authToken: string;

test.describe('Group 5: Users API', () => {
  
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

  test('TC-USER-API-001: Get user profile', async ({ request }) => {
    const response = await request.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('email');
    expect(data.email).toBe(existingUser.email);

    console.log(`✅ Get profile works - ${data.name}`);
  });

  test('TC-USER-API-002: Update user profile', async ({ request }) => {
    const newName = `Test Name ${Date.now()}`;

    const response = await request.put(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { name: newName },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.name).toBe(newName);

    console.log('✅ Update profile works');

    // Restore original name
    await request.put(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { name: existingUser.name },
    });
  });

  test('TC-USER-API-003: Get connections', async ({ request }) => {
    const response = await request.get(`${API_URL}/users/connections`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    console.log(`✅ Get connections works - ${data.length} connections`);
  });

  test('TC-USER-API-004: Get suggested connections', async ({ request }) => {
    const response = await request.get(`${API_URL}/users/suggested-connections`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    console.log(`✅ Get suggested connections works - ${data.length} suggestions`);
  });

  test('TC-USER-API-005: Profile requires authentication', async ({ request }) => {
    const response = await request.get(`${API_URL}/users/profile`);

    expect(response.status()).toBe(401);

    console.log('✅ Profile requires auth');
  });

  test('TC-USER-API-006: Change password', async ({ request }) => {
    const newPassword = 'NewTestPass123';

    const response = await request.put(`${API_URL}/users/change-password`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        currentPassword: existingUser.password,
        newPassword: newPassword,
      },
    });

    expect(response.ok()).toBeTruthy();

    console.log('✅ Change password works');

    // Change back to original
    await request.put(`${API_URL}/users/change-password`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        currentPassword: newPassword,
        newPassword: existingUser.password,
      },
    });
  });
});
