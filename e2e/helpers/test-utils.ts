/**
 * Test Utilities for CivicConnect E2E Tests
 * Contains helper functions for common test operations
 */

import { Page, expect } from '@playwright/test';

// Environment variables
export const config = {
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:3001/api',
  testUserEmail: process.env.TEST_USER_EMAIL || 'priya@example.com',
  testUserPassword: process.env.TEST_USER_PASSWORD || 'password123',
  testNewUserPrefix: process.env.TEST_NEW_USER_PREFIX || 'test_user_',
};

/**
 * Generate a unique test email
 */
export function generateTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${config.testNewUserPrefix}${timestamp}_${random}@test.com`;
}

/**
 * Generate a unique test username
 */
export function generateTestUsername(): string {
  const timestamp = Date.now();
  return `Test User ${timestamp}`;
}

/**
 * Wait for API response
 */
export async function waitForApiResponse(page: Page, urlPattern: string | RegExp): Promise<void> {
  await page.waitForResponse(
    (response) => {
      const url = response.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    },
    { timeout: 30000 }
  );
}

/**
 * Login helper - performs login via UI
 */
export async function loginViaUI(
  page: Page,
  email: string = config.testUserEmail,
  password: string = config.testUserPassword
): Promise<void> {
  // Clear any existing session first
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.removeItem('civicconnect_token');
    localStorage.removeItem('civicconnect_refresh_token');
    localStorage.removeItem('civicconnect_user');
  });
  
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  
  // Wait for page to be fully loaded and inputs enabled
  await page.waitForTimeout(1000);

  // Fill login form - wait for inputs to be visible AND enabled (citizen tab is default)
  const emailInput = page.locator('#email');
  await emailInput.waitFor({ state: 'visible', timeout: 15000 });
  
  // Wait until input is enabled (not disabled)
  await page.waitForFunction(
    () => {
      const input = document.querySelector('#email') as HTMLInputElement;
      return input && !input.disabled;
    },
    { timeout: 15000 }
  );
  
  await emailInput.fill(email);
  await page.locator('#password').fill(password);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for redirect to home page or successful login
  try {
    await page.waitForURL('/', { timeout: 30000 });
  } catch {
    // If redirect didn't happen, check if we're logged in via token
    const token = await page.evaluate(() => localStorage.getItem('civicconnect_token'));
    if (token) {
      await page.goto('/');
    } else {
      throw new Error('Login failed - no redirect and no token');
    }
  }
}

/**
 * Login helper - performs login via API (faster)
 */
export async function loginViaAPI(page: Page, email: string, password: string): Promise<string> {
  const response = await page.request.post(`${config.apiUrl}/auth/login`, {
    data: { email, password },
  });

  expect(response.ok()).toBeTruthy();
  const data = await response.json();

  // Store token in localStorage
  await page.evaluate((token) => {
    localStorage.setItem('civicconnect_token', token);
  }, data.token);

  return data.token;
}

/**
 * Logout helper
 */
export async function logout(page: Page): Promise<void> {
  // Navigate to home first to ensure we have a valid page context
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  
  // Clear localStorage
  await page.evaluate(() => {
    localStorage.removeItem('civicconnect_token');
    localStorage.removeItem('civicconnect_refresh_token');
    localStorage.removeItem('civicconnect_user');
  });
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  const token = await page.evaluate(() => {
    return localStorage.getItem('civicconnect_token');
  });
  return !!token;
}

/**
 * Get stored auth token
 */
export async function getAuthToken(page: Page): Promise<string | null> {
  return await page.evaluate(() => {
    return localStorage.getItem('civicconnect_token');
  });
}

/**
 * Wait for toast notification
 */
export async function waitForToast(page: Page, text?: string): Promise<void> {
  const toastSelector = '[data-sonner-toast]';
  await page.waitForSelector(toastSelector, { timeout: 10000 });

  if (text) {
    await expect(page.locator(toastSelector)).toContainText(text);
  }
}

/**
 * Dismiss all toasts
 */
export async function dismissToasts(page: Page): Promise<void> {
  const toasts = page.locator('[data-sonner-toast]');
  const count = await toasts.count();

  for (let i = 0; i < count; i++) {
    await toasts.nth(0).click();
    await page.waitForTimeout(300);
  }
}

/**
 * Take a screenshot with a descriptive name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `playwright-report/screenshots/${name}-${timestamp}.png`,
    fullPage: true,
  });
}

/**
 * API request helper with authentication
 */
export async function apiRequest(
  page: Page,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: object,
  token?: string
): Promise<{ status: number; data: unknown }> {
  const authToken = token || (await getAuthToken(page));
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await page.request.fetch(`${config.apiUrl}${endpoint}`, {
    method,
    headers,
    data: data ? JSON.stringify(data) : undefined,
  });

  let responseData;
  try {
    responseData = await response.json();
  } catch {
    responseData = null;
  }

  return {
    status: response.status(),
    data: responseData,
  };
}

/**
 * Wait for element to be visible and stable
 */
export async function waitForElement(page: Page, selector: string): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible' });
  await page.locator(selector).waitFor({ state: 'visible' });
}

/**
 * Scroll element into view
 */
export async function scrollIntoView(page: Page, selector: string): Promise<void> {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * Generate random post content
 */
export function generatePostContent(): string {
  const timestamp = Date.now();
  return `Test post created at ${new Date(timestamp).toISOString()} - Random: ${Math.random().toString(36).substring(7)}`;
}

/**
 * Generate random comment content
 */
export function generateCommentContent(): string {
  const timestamp = Date.now();
  return `Test comment at ${new Date(timestamp).toISOString()}`;
}
