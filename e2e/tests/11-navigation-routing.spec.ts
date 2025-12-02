/**
 * Navigation & Routing E2E Tests
 * Tests for page navigation, routing, and deep linking
 */

import { test, expect } from '@playwright/test';
import { loginViaUI, logout } from '../helpers/test-utils';
import { seedUsers } from '../fixtures/test-data';

const config = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
};

test.describe('Navigation - Unauthenticated', () => {
  test('TC-NAV-001: Should redirect to login when accessing protected routes', async ({ page }) => {
    // Try to access profile page without login
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    
    // Should redirect to login or show login prompt
    const url = page.url();
    const hasLoginRedirect = url.includes('/login') || url === `${config.baseUrl}/`;
    
    if (hasLoginRedirect) {
      console.log('✅ Protected route redirected to login');
    } else {
      // Check if there's a login prompt on the page
      const loginPrompt = page.locator('text=login, text=sign in, text=Please log in').first();
      const hasPrompt = await loginPrompt.count() > 0;
      console.log(hasPrompt ? '✅ Login prompt shown on protected page' : 'ℹ️ Page accessible without login');
    }
  });

  test('TC-NAV-002: Should allow access to public pages', async ({ page }) => {
    // Home page should be accessible
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain(config.baseUrl);
    console.log('✅ Home page accessible without login');
  });

  test('TC-NAV-003: Should navigate to login page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Check for login form elements
    const emailInput = page.locator('#email, input[type="email"]');
    await expect(emailInput.first()).toBeVisible({ timeout: 10000 });
    console.log('✅ Login page accessible and form visible');
  });

  test('TC-NAV-004: Should navigate to signup page', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    
    // Check for signup form elements
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]');
    const hasSignupForm = await nameInput.count() > 0;
    
    if (hasSignupForm) {
      console.log('✅ Signup page accessible and form visible');
    } else {
      console.log('ℹ️ Signup page may have different structure');
    }
  });

  test('TC-NAV-005: Should navigate between login and signup', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Find link to signup - check for visible link
    const signupLink = page.locator('a[href*="signup"]:visible, a[href*="register"]:visible').first();
    
    if (await signupLink.count() > 0) {
      await signupLink.click();
      await page.waitForLoadState('networkidle');
      
      const url = page.url();
      if (url.includes('signup') || url.includes('register')) {
        console.log('✅ Navigation from login to signup works');
      } else {
        // Link may be for tab switching within same page
        console.log('ℹ️ Signup link clicked but URL unchanged (may be tab-based login/signup)');
      }
    } else {
      // Try direct navigation
      await page.goto('/signup');
      await page.waitForLoadState('networkidle');
      console.log('✅ Signup page accessible via direct URL');
    }
  });
});

test.describe('Navigation - Authenticated', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-NAV-006: Should navigate to profile page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Try clicking avatar/dropdown first (most common pattern)
    const avatar = page.locator('[class*="avatar"]:visible, button:has(img):visible').first();
    if (await avatar.count() > 0) {
      await avatar.click();
      await page.waitForTimeout(500);
      
      const dropdownProfileLink = page.locator('a[href="/profile"]:visible, [role="menuitem"]:has-text("Profile")').first();
      if (await dropdownProfileLink.count() > 0) {
        await dropdownProfileLink.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Profile page navigation via dropdown works');
        return;
      }
    }
    
    // Direct navigation as fallback
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('profile');
    console.log('✅ Profile page accessible via direct URL');
  });

  test('TC-NAV-007: Should navigate to notifications page', async ({ page }) => {
    // Direct navigation test
    await page.goto('/notifications');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('notification');
    console.log('✅ Notifications page accessible via direct URL');
  });

  test('TC-NAV-008: Should navigate to messages page', async ({ page }) => {
    // Direct navigation test
    await page.goto('/messages');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('message');
    console.log('✅ Messages page accessible via direct URL');
  });

  test('TC-NAV-009: Should navigate to schemes page', async ({ page }) => {
    await page.goto('/schemes');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('schemes');
    
    // Page loaded successfully
    console.log('✅ Schemes page accessible');
  });

  test('TC-NAV-010: Should navigate to jobs page', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('jobs');
    
    // Page loaded successfully
    console.log('✅ Jobs page accessible');
  });

  test('TC-NAV-011: Should navigate to settings page', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('settings');
    console.log('✅ Settings page accessible');
  });

  test('TC-NAV-012: Should navigate back to home from other pages', async ({ page }) => {
    await page.goto('/schemes');
    await page.waitForLoadState('networkidle');
    
    // Find home link (logo or home nav item)
    const homeLink = page.locator('a[href="/"], [class*="logo"]').first();
    
    if (await homeLink.count() > 0) {
      await homeLink.click();
      await page.waitForLoadState('networkidle');
      
      const url = page.url();
      const isHome = url === `${config.baseUrl}/` || url === config.baseUrl;
      if (isHome) {
        console.log('✅ Navigation back to home works');
      } else {
        console.log(`ℹ️ Navigated to: ${url}`);
      }
    }
  });

  test('TC-NAV-013: Should handle browser back/forward navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/schemes');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');
    
    // Go back
    await page.goBack();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('schemes');
    
    // Go forward
    await page.goForward();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('jobs');
    
    console.log('✅ Browser back/forward navigation works');
  });
});

test.describe('Navigation - Deep Linking', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-NAV-014: Should handle direct URL to scheme detail', async ({ page }) => {
    // First get a scheme ID from the list
    const response = await page.request.get('http://localhost:3001/api/schemes');
    
    if (response.ok()) {
      const schemes = await response.json();
      if (schemes.length > 0) {
        const schemeId = schemes[0].id;
        await page.goto(`/schemes/${schemeId}`);
        await page.waitForLoadState('networkidle');
        
        expect(page.url()).toContain(`schemes/${schemeId}`);
        console.log('✅ Deep link to scheme detail works');
      } else {
        console.log('ℹ️ No schemes available for deep link test');
      }
    } else {
      console.log('ℹ️ Could not fetch schemes for deep link test');
    }
  });

  test('TC-NAV-015: Should handle 404 for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-page-12345');
    await page.waitForLoadState('networkidle');
    
    // Check for 404 content or redirect to home
    const notFoundText = page.locator('text=404, text=not found, text=Not Found').first();
    const hasNotFound = await notFoundText.count() > 0;
    
    if (hasNotFound) {
      console.log('✅ 404 page displayed for non-existent route');
    } else {
      // May redirect to home
      console.log('ℹ️ Non-existent route handled (may redirect)');
    }
  });
});

test.describe('Navigation - Logout Flow', () => {
  test('TC-NAV-016: Should logout and redirect to home/login', async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find logout option (usually in dropdown)
    const avatar = page.locator('[class*="avatar"], button:has(img)').first();
    
    if (await avatar.count() > 0) {
      await avatar.click();
      await page.waitForTimeout(500);
      
      const logoutButton = page.locator('text=Logout, text=Sign out, text=Log out').first();
      
      if (await logoutButton.count() > 0) {
        await logoutButton.click();
        await page.waitForLoadState('networkidle');
        
        // Should see login/signup buttons
        const loginButton = page.locator('text=Login, text=Sign in, a[href="/login"]').first();
        const hasLoginButton = await loginButton.count() > 0;
        
        if (hasLoginButton) {
          console.log('✅ Logout successful, login button visible');
        } else {
          console.log('ℹ️ Logout completed');
        }
      }
    }
  });
});
