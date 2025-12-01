/**
 * Authentication E2E Tests for CivicConnect
 * Tests: Register, Login, Logout, Token Refresh
 */

import { test, expect } from '@playwright/test';
import {
  config,
  generateTestEmail,
  generateTestUsername,
  loginViaUI,
  logout,
  isLoggedIn,
  getAuthToken,
  waitForToast,
  apiRequest,
} from '../helpers/test-utils';
import {
  seedUsers,
  testUserTemplates,
  invalidCredentials,
  uiElements,
  apiEndpoints,
} from '../fixtures/test-data';

test.describe('Authentication - Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
  });

  test('TC-AUTH-001: Should display registration form with all required fields', async ({ page }) => {
    // Verify form elements are visible
    await expect(page.locator('input[name="name"], input[placeholder*="name" i]')).toBeVisible();
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('TC-AUTH-002: Should successfully register a new citizen user', async ({ page }) => {
    const testEmail = generateTestEmail();
    const testName = generateTestUsername();

    // Fill registration form
    await page.fill('input[name="name"], input[placeholder*="name" i]', testName);
    await page.fill('input[type="email"], input[name="email"]', testEmail);
    await page.fill('input[type="password"], input[name="password"]', testUserTemplates.citizen.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for successful registration and redirect
    await page.waitForURL('/', { timeout: 30000 });

    // Verify user is logged in
    const loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBeTruthy();

    // Verify token is stored
    const token = await getAuthToken(page);
    expect(token).toBeTruthy();

    console.log(`✅ Successfully registered user: ${testEmail}`);
  });

  test('TC-AUTH-003: Should show error for duplicate email registration', async ({ page }) => {
    // Try to register with existing email
    await page.fill('input[name="name"], input[placeholder*="name" i]', 'Duplicate User');
    await page.fill('input[type="email"], input[name="email"]', seedUsers.priya.email);
    await page.fill('input[type="password"], input[name="password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Should show error message
    await page.waitForTimeout(2000);

    // Verify still on signup page (not redirected)
    expect(page.url()).toContain('/signup');
  });

  test('TC-AUTH-004: Should validate email format', async ({ page }) => {
    await page.fill('input[name="name"], input[placeholder*="name" i]', 'Test User');
    await page.fill('input[type="email"], input[name="email"]', invalidCredentials.invalidEmail.email);
    await page.fill('input[type="password"], input[name="password"]', 'password123');

    await page.click('button[type="submit"]');

    // Should show validation error or stay on page
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/signup');
  });

  test('TC-AUTH-005: Should validate minimum password length', async ({ page }) => {
    await page.fill('input[name="name"], input[placeholder*="name" i]', 'Test User');
    await page.fill('input[type="email"], input[name="email"]', generateTestEmail());
    await page.fill('input[type="password"], input[name="password"]', invalidCredentials.shortPassword.password);

    await page.click('button[type="submit"]');

    // Should show validation error or stay on page
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/signup');
  });

  test('TC-AUTH-006: Should have link to login page', async ({ page }) => {
    const loginLink = page.locator('a[href="/login"], a:has-text("Login"), a:has-text("Sign in")');
    await expect(loginLink.first()).toBeVisible();

    await loginLink.first().click();
    await page.waitForURL('/login');
  });
});

test.describe('Authentication - Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('TC-AUTH-007: Should display login form with all required fields', async ({ page }) => {
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('TC-AUTH-008: Should successfully login with valid credentials', async ({ page }) => {
    // Fill login form
    await page.fill('input[type="email"], input[name="email"]', seedUsers.priya.email);
    await page.fill('input[type="password"], input[name="password"]', seedUsers.priya.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to home page
    await page.waitForURL('/', { timeout: 30000 });

    // Verify user is logged in
    const loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBeTruthy();

    // Verify token is stored
    const token = await getAuthToken(page);
    expect(token).toBeTruthy();

    console.log(`✅ Successfully logged in as: ${seedUsers.priya.email}`);
  });

  test('TC-AUTH-009: Should show error for invalid email', async ({ page }) => {
    await page.fill('input[type="email"], input[name="email"]', invalidCredentials.wrongEmail.email);
    await page.fill('input[type="password"], input[name="password"]', invalidCredentials.wrongEmail.password);

    await page.click('button[type="submit"]');

    // Should show error and stay on login page
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');

    // Verify not logged in
    const loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBeFalsy();
  });

  test('TC-AUTH-010: Should show error for wrong password', async ({ page }) => {
    await page.fill('input[type="email"], input[name="email"]', invalidCredentials.wrongPassword.email);
    await page.fill('input[type="password"], input[name="password"]', invalidCredentials.wrongPassword.password);

    await page.click('button[type="submit"]');

    // Should show error and stay on login page
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');

    // Verify not logged in
    const loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBeFalsy();
  });

  test('TC-AUTH-011: Should not submit with empty fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should stay on login page
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');
  });

  test('TC-AUTH-012: Should have link to registration page', async ({ page }) => {
    const signupLink = page.locator('a[href="/signup"], a:has-text("Sign up"), a:has-text("Register")');
    await expect(signupLink.first()).toBeVisible();

    await signupLink.first().click();
    await page.waitForURL('/signup');
  });
});

test.describe('Authentication - Logout', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-AUTH-013: Should successfully logout', async ({ page }) => {
    // Verify logged in
    let loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBeTruthy();

    // Find and click logout button/link
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign out"), [data-testid="logout"]');
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
    } else {
      // Try dropdown menu
      const userMenu = page.locator('[data-testid="user-menu"], button:has([data-testid="avatar"])');
      if (await userMenu.count() > 0) {
        await userMenu.first().click();
        await page.click('text=Logout');
      } else {
        // Manual logout
        await logout(page);
      }
    }

    // Wait for redirect to login
    await page.waitForTimeout(2000);

    // Verify logged out
    loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBeFalsy();

    console.log('✅ Successfully logged out');
  });

  test('TC-AUTH-014: Should clear auth tokens on logout', async ({ page }) => {
    // Logout
    await logout(page);

    // Verify tokens are cleared
    const token = await getAuthToken(page);
    expect(token).toBeFalsy();

    const refreshToken = await page.evaluate(() => {
      return localStorage.getItem('civicconnect_refresh_token');
    });
    expect(refreshToken).toBeFalsy();

    const user = await page.evaluate(() => {
      return localStorage.getItem('civicconnect_user');
    });
    expect(user).toBeFalsy();
  });
});

test.describe('Authentication - API Tests', () => {
  test('TC-AUTH-015: API - Login should return token and user data', async ({ page }) => {
    const response = await page.request.post(`${config.apiUrl}/auth/login`, {
      data: {
        email: seedUsers.priya.email,
        password: seedUsers.priya.password,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('refreshToken');
    expect(data).toHaveProperty('user');
    expect(data.user.email).toBe(seedUsers.priya.email);

    console.log('✅ API Login successful');
  });

  test('TC-AUTH-016: API - Register should create new user', async ({ page }) => {
    const testEmail = generateTestEmail();
    const testName = generateTestUsername();

    const response = await page.request.post(`${config.apiUrl}/auth/register`, {
      data: {
        name: testName,
        email: testEmail,
        password: testUserTemplates.citizen.password,
        role: 'citizen',
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('user');
    expect(data.user.email).toBe(testEmail);
    expect(data.user.name).toBe(testName);

    console.log(`✅ API Register successful: ${testEmail}`);
  });

  test('TC-AUTH-017: API - Login should fail with wrong credentials', async ({ page }) => {
    const response = await page.request.post(`${config.apiUrl}/auth/login`, {
      data: {
        email: invalidCredentials.wrongPassword.email,
        password: invalidCredentials.wrongPassword.password,
      },
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);
  });

  test('TC-AUTH-018: API - Register should fail with duplicate email', async ({ page }) => {
    const response = await page.request.post(`${config.apiUrl}/auth/register`, {
      data: {
        name: 'Duplicate User',
        email: seedUsers.priya.email,
        password: 'password123',
        role: 'citizen',
      },
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(409);
  });

  test('TC-AUTH-019: API - Refresh token should return new tokens', async ({ page }) => {
    // First login to get tokens
    const loginResponse = await page.request.post(`${config.apiUrl}/auth/login`, {
      data: {
        email: seedUsers.priya.email,
        password: seedUsers.priya.password,
      },
    });

    const loginData = await loginResponse.json();

    // Use refresh token
    const refreshResponse = await page.request.post(`${config.apiUrl}/auth/refresh-token`, {
      data: {
        refreshToken: loginData.refreshToken,
      },
    });

    expect(refreshResponse.ok()).toBeTruthy();

    const refreshData = await refreshResponse.json();
    expect(refreshData).toHaveProperty('token');
    expect(refreshData).toHaveProperty('refreshToken');

    console.log('✅ API Token refresh successful');
  });
});

test.describe('Authentication - Session Persistence', () => {
  test('TC-AUTH-020: Should maintain session after page refresh', async ({ page }) => {
    // Login
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);

    // Verify logged in
    let loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBeTruthy();

    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify still logged in
    loggedIn = await isLoggedIn(page);
    expect(loggedIn).toBeTruthy();

    console.log('✅ Session persisted after refresh');
  });

  test('TC-AUTH-021: Should redirect to login when accessing protected route without auth', async ({ page }) => {
    // Clear any existing auth
    await logout(page);

    // Try to access protected route
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Should redirect to login or show login prompt
    await page.waitForTimeout(2000);
    const url = page.url();
    
    // Either redirected to login or still on profile with login modal
    const isOnLoginOrHasLoginPrompt = 
      url.includes('/login') || 
      await page.locator('input[type="email"]').isVisible();

    expect(isOnLoginOrHasLoginPrompt).toBeTruthy();
  });
});
