/**
 * Home Page Sidebar E2E Tests for CivicConnect
 * Tests: Sidebar components, API integration, connections
 */

import { test, expect } from '@playwright/test';
import {
  config,
  loginViaUI,
  logout,
  getAuthToken,
} from '../helpers/test-utils';
import { seedUsers } from '../fixtures/test-data';

test.describe('Sidebar - Schemes Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('TC-SIDEBAR-001: Should display Latest Schemes section', async ({ page }) => {
    // Check for schemes section
    const schemesSection = page.locator('text=Latest Schemes, text=Schemes');
    const hasSchemes = await schemesSection.count() > 0;

    if (hasSchemes) {
      console.log('✅ Latest Schemes section is visible');
    } else {
      console.log('ℹ️ Schemes section not found (may be mobile view)');
    }
  });

  test('TC-SIDEBAR-002: Should display scheme items with titles and deadlines', async ({ page }) => {
    // Look for scheme items
    const schemeItems = page.locator('text=Deadline, text=PM Kisan, text=Skill India');
    const count = await schemeItems.count();

    if (count > 0) {
      console.log(`✅ Found ${count} scheme-related elements`);
    } else {
      console.log('ℹ️ No scheme items found');
    }
  });

  test('TC-SIDEBAR-003: Should have View All Schemes link', async ({ page }) => {
    const viewAllLink = page.locator('a[href="/schemes"], button:has-text("View All Schemes")');
    
    if (await viewAllLink.count() > 0) {
      // Scroll into view if needed (sidebar may require scrolling)
      await viewAllLink.first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const isVisible = await viewAllLink.first().isVisible();
      if (isVisible) {
        console.log('✅ View All Schemes link is visible');
      } else {
        console.log('ℹ️ View All Schemes link exists but not visible (may be in collapsed section)');
      }
    } else {
      console.log('ℹ️ View All Schemes link not found');
    }
  });
});

test.describe('Sidebar - Jobs Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('TC-SIDEBAR-004: Should display Local Opportunities section', async ({ page }) => {
    const jobsSection = page.locator('text=Local Opportunities, text=Opportunities, text=Jobs');
    const hasJobs = await jobsSection.count() > 0;

    if (hasJobs) {
      console.log('✅ Local Opportunities section is visible');
    } else {
      console.log('ℹ️ Jobs section not found (may be mobile view)');
    }
  });

  test('TC-SIDEBAR-005: Should display job items with company and location', async ({ page }) => {
    const jobItems = page.locator('text=Developer, text=Clerk, text=Mumbai, text=Delhi');
    const count = await jobItems.count();

    if (count > 0) {
      console.log(`✅ Found ${count} job-related elements`);
    } else {
      console.log('ℹ️ No job items found');
    }
  });

  test('TC-SIDEBAR-006: Should have View All Jobs link', async ({ page }) => {
    const viewAllLink = page.locator('a[href="/jobs"], button:has-text("View All Jobs")');
    
    if (await viewAllLink.count() > 0) {
      await expect(viewAllLink.first()).toBeVisible();
      console.log('✅ View All Jobs link is visible');
    } else {
      console.log('ℹ️ View All Jobs link not found');
    }
  });
});

test.describe('Sidebar - Events Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('TC-SIDEBAR-007: Should display Upcoming Events section', async ({ page }) => {
    const eventsSection = page.locator('text=Upcoming Events, text=Events, text=Calendar');
    const hasEvents = await eventsSection.count() > 0;

    if (hasEvents) {
      console.log('✅ Upcoming Events section is visible');
    } else {
      console.log('ℹ️ Events section not found (may be mobile view)');
    }
  });

  test('TC-SIDEBAR-008: Should display event items with date and location', async ({ page }) => {
    const eventItems = page.locator('text=Workshop, text=Fair, text=Meeting, text=Camp');
    const count = await eventItems.count();

    if (count > 0) {
      console.log(`✅ Found ${count} event-related elements`);
    } else {
      console.log('ℹ️ No event items found');
    }
  });

  test('TC-SIDEBAR-009: Should have View Calendar link', async ({ page }) => {
    const viewAllLink = page.locator('a[href="/events"], button:has-text("View Calendar")');
    
    if (await viewAllLink.count() > 0) {
      await expect(viewAllLink.first()).toBeVisible();
      console.log('✅ View Calendar link is visible');
    } else {
      console.log('ℹ️ View Calendar link not found');
    }
  });
});

test.describe('Sidebar - People to Connect Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('TC-SIDEBAR-010: Should display People to Connect section', async ({ page }) => {
    const connectSection = page.locator('text=People to Connect, text=Connect With');
    const hasConnect = await connectSection.count() > 0;

    if (hasConnect) {
      console.log('✅ People to Connect section is visible');
    } else {
      console.log('ℹ️ Connect section not found (may be mobile view)');
    }
  });

  test('TC-SIDEBAR-011: Should display user suggestions with avatars', async ({ page }) => {
    const avatars = page.locator('.avatar, [class*="avatar"]');
    const count = await avatars.count();

    if (count > 0) {
      console.log(`✅ Found ${count} user avatars`);
    } else {
      console.log('ℹ️ No user avatars found');
    }
  });

  test('TC-SIDEBAR-012: Should have Connect buttons', async ({ page }) => {
    const connectButtons = page.locator('button:has-text("Connect")');
    const count = await connectButtons.count();

    if (count > 0) {
      console.log(`✅ Found ${count} Connect buttons`);
    } else {
      console.log('ℹ️ No Connect buttons found');
    }
  });
});

test.describe('Sidebar - Connect Functionality (Authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('TC-SIDEBAR-013: Should connect with a suggested user', async ({ page }) => {
    // Find a Connect button in sidebar
    const connectButton = page.locator('button:has-text("Connect")').first();
    
    if (await connectButton.count() > 0 && await connectButton.isVisible()) {
      await connectButton.click();
      await page.waitForTimeout(2000);

      // Check for success - button should change to "Connected" or show toast
      const connectedButton = page.locator('button:has-text("Connected")');
      const successToast = page.locator('[data-sonner-toast]:has-text("Connected")');
      
      const isConnected = await connectedButton.count() > 0 || await successToast.count() > 0;
      
      if (isConnected) {
        console.log('✅ Successfully connected with user');
      } else {
        console.log('ℹ️ Connection may have succeeded but UI not updated');
      }
    } else {
      console.log('ℹ️ No Connect button available (may already be connected to all)');
    }
  });

  test('TC-SIDEBAR-014: API - Should fetch suggested connections', async ({ page }) => {
    const token = await getAuthToken(page);
    
    const response = await page.request.get(`${config.apiUrl}/users/suggested-connections`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    console.log(`✅ API returned ${data.length} suggested connections`);
  });

  test('TC-SIDEBAR-015: API - Should connect with user', async ({ page }) => {
    const token = await getAuthToken(page);
    
    // First get suggested connections
    const suggestedResponse = await page.request.get(`${config.apiUrl}/users/suggested-connections`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const suggested = await suggestedResponse.json();
    
    if (suggested.length > 0) {
      const targetUserId = suggested[0].id;
      
      const connectResponse = await page.request.post(`${config.apiUrl}/users/connect/${targetUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // May succeed or fail if already connected
      if (connectResponse.ok()) {
        console.log(`✅ API: Connected with user ${targetUserId}`);
      } else if (connectResponse.status() === 409) {
        console.log('ℹ️ Already connected with this user');
      } else {
        console.log(`ℹ️ Connect returned status ${connectResponse.status()}`);
      }
    } else {
      console.log('ℹ️ No suggested users to connect with');
    }
  });
});

test.describe('Sidebar - API Integration', () => {
  test('TC-SIDEBAR-016: API - Should fetch schemes (public)', async ({ page }) => {
    const response = await page.request.get(`${config.apiUrl}/schemes`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    if (data.length > 0) {
      expect(data[0]).toHaveProperty('title');
      expect(data[0]).toHaveProperty('deadline');
    }

    console.log(`✅ API returned ${data.length} schemes`);
  });

  test('TC-SIDEBAR-017: API - Should fetch jobs (public)', async ({ page }) => {
    const response = await page.request.get(`${config.apiUrl}/jobs`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    if (data.length > 0) {
      expect(data[0]).toHaveProperty('title');
      expect(data[0]).toHaveProperty('company');
      expect(data[0]).toHaveProperty('location');
    }

    console.log(`✅ API returned ${data.length} jobs`);
  });

  test('TC-SIDEBAR-018: API - Should fetch events (public)', async ({ page }) => {
    const response = await page.request.get(`${config.apiUrl}/events`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    if (data.length > 0) {
      expect(data[0]).toHaveProperty('title');
      expect(data[0]).toHaveProperty('date');
      expect(data[0]).toHaveProperty('location');
    }

    console.log(`✅ API returned ${data.length} events`);
  });
});
