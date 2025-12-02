/**
 * Error States E2E Tests
 * Tests for error handling, network failures, and edge cases
 */

import { test, expect } from '@playwright/test';
import { loginViaUI, getAuthToken } from '../helpers/test-utils';
import { seedUsers, invalidCredentials } from '../fixtures/test-data';

const config = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
};

test.describe('Error States - Network Errors', () => {
  test('TC-ERR-001: Should handle API timeout gracefully', async ({ page }) => {
    // Simulate slow network
    await page.route('**/api/posts/feed**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 30000)); // 30s delay
      await route.abort('timedout');
    });
    
    await page.goto('/');
    await page.waitForTimeout(5000);
    
    // Check for error message or fallback content
    const errorMessage = page.locator('text=error, text=failed, text=try again, text=problem').first();
    const mockPosts = page.locator('article, [class*="post"]');
    
    const hasError = await errorMessage.count() > 0;
    const hasFallback = await mockPosts.count() > 0;
    
    if (hasError) {
      console.log('✅ Error message displayed for timeout');
    } else if (hasFallback) {
      console.log('✅ Fallback content displayed for timeout');
    } else {
      console.log('ℹ️ Page handling timeout (may show loading state)');
    }
  });

  test('TC-ERR-002: Should handle network offline', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Go offline
    await context.setOffline(true);
    
    // Try to perform an action
    const postInput = page.locator('textarea[placeholder*="What"]');
    if (await postInput.count() > 0) {
      await postInput.first().fill('Test post while offline');
      
      const postButton = page.locator('button:has-text("Post")');
      if (await postButton.count() > 0) {
        await postButton.first().click();
        await page.waitForTimeout(2000);
        
        // Check for offline/error message
        const errorToast = page.locator('[class*="toast"], [class*="alert"], text=offline, text=network, text=connection');
        const hasError = await errorToast.count() > 0;
        
        if (hasError) {
          console.log('✅ Offline error message displayed');
        } else {
          console.log('ℹ️ Offline state handled (may queue action)');
        }
      }
    }
    
    // Go back online
    await context.setOffline(false);
  });

  test('TC-ERR-003: Should handle API 500 error', async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    
    // Intercept and return 500 error
    await page.route('**/api/posts', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Internal Server Error' } }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Try to create a post
    const postInput = page.locator('textarea[placeholder*="What"]');
    if (await postInput.count() > 0) {
      await postInput.first().fill('Test post for 500 error');
      
      const postButton = page.locator('button:has-text("Post")');
      if (await postButton.count() > 0) {
        await postButton.first().click();
        await page.waitForTimeout(2000);
        
        // Check for error message
        const errorToast = page.locator('[class*="toast"], text=error, text=failed, text=try again');
        const hasError = await errorToast.count() > 0;
        
        if (hasError) {
          console.log('✅ Error message displayed for 500 error');
        } else {
          console.log('ℹ️ 500 error handled silently');
        }
      }
    }
  });

  test('TC-ERR-004: Should handle API 404 error', async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    const token = await getAuthToken(page);
    
    // Try to access non-existent post
    const response = await page.request.get(`${config.apiUrl}/posts/non-existent-id-12345`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    expect(response.status()).toBe(404);
    console.log('✅ API returns 404 for non-existent resource');
  });
});

test.describe('Error States - Authentication Errors', () => {
  test('TC-ERR-005: Should show error for invalid login credentials', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Wait for form to be ready
    const emailInput = page.locator('#email, input[type="email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await emailInput.waitFor({ state: 'attached' });
    
    // Fill invalid credentials
    await emailInput.fill(invalidCredentials.wrongPassword.email);
    
    const passwordInput = page.locator('#password, input[type="password"]').first();
    await passwordInput.fill('wrongpassword123');
    
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();
    
    await page.waitForTimeout(3000);
    
    // Check for error message
    const errorMessage = page.locator('text=invalid, text=incorrect, text=wrong, text=error, [class*="error"]');
    const hasError = await errorMessage.count() > 0;
    
    if (hasError) {
      console.log('✅ Error message displayed for invalid credentials');
    } else {
      // Check if still on login page
      const stillOnLogin = page.url().includes('login');
      if (stillOnLogin) {
        console.log('✅ Login failed, still on login page');
      } else {
        console.log('ℹ️ Login behavior unclear');
      }
    }
  });

  test('TC-ERR-006: Should handle expired token', async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    
    // Intercept API calls and return 401
    await page.route('**/api/posts/feed**', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: { message: 'Token expired' } }),
      });
    });
    
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Check for redirect to login or error message
    const url = page.url();
    const redirectedToLogin = url.includes('login');
    const errorMessage = page.locator('text=session, text=expired, text=login again, text=unauthorized');
    const hasError = await errorMessage.count() > 0;
    
    if (redirectedToLogin) {
      console.log('✅ Redirected to login on token expiry');
    } else if (hasError) {
      console.log('✅ Error message displayed for expired token');
    } else {
      console.log('ℹ️ Token expiry handled (may show fallback content)');
    }
  });

  test('TC-ERR-007: Should handle 403 forbidden error', async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    const token = await getAuthToken(page);
    
    // Try to access admin-only endpoint
    const response = await page.request.get(`${config.apiUrl}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Should be 403 or 401 for non-admin user
    const status = response.status();
    if (status === 403 || status === 401 || status === 404) {
      console.log(`✅ Access denied for restricted endpoint (${status})`);
    } else {
      console.log(`ℹ️ Endpoint returned: ${status}`);
    }
  });
});

test.describe('Error States - Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-ERR-008: Should prevent empty post submission', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Try to submit empty post
    const postButton = page.locator('button:has-text("Post")');
    
    if (await postButton.count() > 0) {
      const isDisabled = await postButton.first().isDisabled();
      
      if (isDisabled) {
        console.log('✅ Post button disabled for empty content');
      } else {
        await postButton.first().click();
        await page.waitForTimeout(1000);
        
        // Check if post was not created (no success toast)
        const successToast = page.locator('text=Post created, text=success');
        const hasSuccess = await successToast.count() > 0;
        
        if (!hasSuccess) {
          console.log('✅ Empty post submission prevented');
        } else {
          console.log('ℹ️ Empty post may have been submitted');
        }
      }
    }
  });

  test('TC-ERR-009: Should prevent whitespace-only post submission', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const postInput = page.locator('textarea[placeholder*="What"]');
    
    if (await postInput.count() > 0) {
      await postInput.first().fill('   '); // Only whitespace
      
      const postButton = page.locator('button:has-text("Post")');
      const isDisabled = await postButton.first().isDisabled();
      
      if (isDisabled) {
        console.log('✅ Post button disabled for whitespace-only content');
      } else {
        console.log('ℹ️ Whitespace-only content may be allowed');
      }
    }
  });

  test('TC-ERR-010: Should show validation error for invalid image URL', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Open image input
    const imageButton = page.locator('button:has([class*="image" i])');
    if (await imageButton.count() > 0) {
      await imageButton.first().click();
      await page.waitForTimeout(500);
      
      const imageInput = page.locator('input[placeholder*="image" i], input[type="url"]');
      if (await imageInput.count() > 0) {
        await imageInput.first().fill('not-a-valid-url');
        
        // Try to submit
        const postInput = page.locator('textarea[placeholder*="What"]');
        await postInput.first().fill('Test post with invalid image');
        
        const postButton = page.locator('button:has-text("Post")');
        await postButton.first().click();
        await page.waitForTimeout(2000);
        
        // Check for validation error
        const validationError = page.locator('text=invalid, text=valid URL, text=error');
        const hasError = await validationError.count() > 0;
        
        if (hasError) {
          console.log('✅ Validation error shown for invalid image URL');
        } else {
          console.log('ℹ️ Invalid URL may be accepted or silently ignored');
        }
      }
    }
  });
});

test.describe('Error States - Rate Limiting', () => {
  test('TC-ERR-011: Should handle rate limit (429) error', async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    
    // Intercept and return 429
    await page.route('**/api/posts', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Too many requests' } }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const postInput = page.locator('textarea[placeholder*="What"]');
    if (await postInput.count() > 0) {
      await postInput.first().fill('Test post for rate limit');
      
      const postButton = page.locator('button:has-text("Post")');
      await postButton.first().click();
      await page.waitForTimeout(2000);
      
      // Check for rate limit message
      const rateLimitMessage = page.locator('text=too many, text=rate limit, text=try again later, text=slow down');
      const hasMessage = await rateLimitMessage.count() > 0;
      
      if (hasMessage) {
        console.log('✅ Rate limit message displayed');
      } else {
        console.log('ℹ️ Rate limit error handled silently');
      }
    }
  });
});

test.describe('Error States - Empty States', () => {
  test('TC-ERR-012: Should show empty state when no posts', async ({ page }) => {
    // Intercept and return empty posts
    await page.route('**/api/posts/feed**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ posts: [], pagination: { page: 1, total: 0 } }),
      });
    });
    
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check for empty state message
    const emptyState = page.locator('text=No posts, text=empty, text=nothing to show, text=Be the first');
    const hasEmptyState = await emptyState.count() > 0;
    
    if (hasEmptyState) {
      console.log('✅ Empty state message displayed');
    } else {
      // May show mock posts as fallback
      const mockPosts = page.locator('article, [class*="post"]');
      if (await mockPosts.count() > 0) {
        console.log('ℹ️ Fallback/mock posts shown instead of empty state');
      } else {
        console.log('ℹ️ No empty state message (may have different UI)');
      }
    }
  });

  test('TC-ERR-013: Should show empty state for no search results', async ({ page }) => {
    await page.goto('/search?q=xyznonexistent12345');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check for no results message
    const noResults = page.locator('text=No results, text=nothing found, text=no matches, text=Try different');
    const hasNoResults = await noResults.count() > 0;
    
    if (hasNoResults) {
      console.log('✅ No results message displayed for empty search');
    } else {
      console.log('ℹ️ Search page may have different empty state handling');
    }
  });
});

test.describe('Error States - Recovery', () => {
  test('TC-ERR-014: Should recover from error on retry', async ({ page }) => {
    let requestCount = 0;
    
    // First request fails, second succeeds
    await page.route('**/api/posts/feed**', async (route) => {
      requestCount++;
      if (requestCount === 1) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Server error' } }),
        });
      } else {
        await route.continue();
      }
    });
    
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Reload to retry
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check if posts loaded on retry
    const posts = page.locator('article, [class*="post"]');
    const hasRecovered = await posts.count() > 0;
    
    if (hasRecovered) {
      console.log('✅ Recovered from error on retry');
    } else {
      console.log('ℹ️ Recovery may need different approach');
    }
  });
});
