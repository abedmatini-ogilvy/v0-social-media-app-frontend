/**
 * Group 2: Authentication API Tests
 * Tests backend auth endpoints directly (no UI)
 */

import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://127.0.0.1:3001/api';

// Test data
const existingUser = {
  email: 'priya@example.com',
  password: 'password123',
};

function generateTestEmail(): string {
  return `test_${Date.now()}_${Math.random().toString(36).substring(7)}@test.com`;
}

test.describe('Group 2: Auth API', () => {
  
  test('TC-AUTH-API-001: Login with valid credentials', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/login`, {
      data: {
        email: existingUser.email,
        password: existingUser.password,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('refreshToken');
    expect(data).toHaveProperty('user');
    expect(data.user.email).toBe(existingUser.email);

    console.log('✅ Login API works');
  });

  test('TC-AUTH-API-002: Login with wrong password should fail', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/login`, {
      data: {
        email: existingUser.email,
        password: 'wrongpassword',
      },
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);

    console.log('✅ Login rejects wrong password');
  });

  test('TC-AUTH-API-003: Login with non-existent email should fail', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/login`, {
      data: {
        email: 'nonexistent@example.com',
        password: 'password123',
      },
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);

    console.log('✅ Login rejects non-existent email');
  });

  test('TC-AUTH-API-004: Register new user', async ({ request }) => {
    const testEmail = generateTestEmail();

    const response = await request.post(`${API_URL}/auth/register`, {
      data: {
        name: 'Test User',
        email: testEmail,
        password: 'TestPass123',
        role: 'citizen',
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('user');
    expect(data.user.email).toBe(testEmail);

    console.log(`✅ Register API works - created: ${testEmail}`);
  });

  test('TC-AUTH-API-005: Register with duplicate email should fail', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/register`, {
      data: {
        name: 'Duplicate User',
        email: existingUser.email,
        password: 'password123',
        role: 'citizen',
      },
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(409);

    console.log('✅ Register rejects duplicate email');
  });

  test('TC-AUTH-API-006: Refresh token', async ({ request }) => {
    // First login to get tokens
    const loginResponse = await request.post(`${API_URL}/auth/login`, {
      data: {
        email: existingUser.email,
        password: existingUser.password,
      },
    });

    const loginData = await loginResponse.json();

    // Use refresh token
    const refreshResponse = await request.post(`${API_URL}/auth/refresh-token`, {
      data: {
        refreshToken: loginData.refreshToken,
      },
    });

    expect(refreshResponse.ok()).toBeTruthy();

    const refreshData = await refreshResponse.json();
    expect(refreshData).toHaveProperty('token');
    expect(refreshData).toHaveProperty('refreshToken');

    console.log('✅ Token refresh works');
  });
});
