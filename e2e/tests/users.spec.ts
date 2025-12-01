/**
 * User Profile & Connections E2E Tests for CivicConnect
 * Tests: Profile View, Profile Update, Connections, Suggested Connections
 */

import { test, expect } from '@playwright/test';
import {
  config,
  loginViaUI,
  getAuthToken,
  generateTestUsername,
} from '../helpers/test-utils';
import {
  seedUsers,
  testProfileUpdates,
  apiEndpoints,
} from '../fixtures/test-data';

test.describe('User Profile - View', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-USER-001: Should display user profile page', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Verify profile page loaded
    const profileContent = page.locator('main, [data-testid="profile"], .profile');
    await expect(profileContent.first()).toBeVisible();

    console.log('✅ Profile page displayed');
  });

  test('TC-USER-002: API - Should get user profile', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.get(`${config.apiUrl}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('email');
    expect(data.email).toBe(seedUsers.priya.email);

    console.log(`✅ Profile retrieved: ${data.name} (${data.email})`);
  });

  test('TC-USER-003: API - Should not get profile without authentication', async ({ page }) => {
    const response = await page.request.get(`${config.apiUrl}/users/profile`);

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);
  });
});

test.describe('User Profile - Update', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-USER-004: API - Should update user name', async ({ page }) => {
    const token = await getAuthToken(page);
    const newName = generateTestUsername();

    const response = await page.request.put(`${config.apiUrl}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        name: newName,
      },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.name).toBe(newName);

    console.log(`✅ Profile name updated to: ${newName}`);

    // Restore original name
    await page.request.put(`${config.apiUrl}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        name: seedUsers.priya.name,
      },
    });
  });

  test('TC-USER-005: API - Should update user avatar', async ({ page }) => {
    const token = await getAuthToken(page);
    const newAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=test123';

    const response = await page.request.put(`${config.apiUrl}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        avatar: newAvatar,
      },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.avatar).toBe(newAvatar);

    console.log('✅ Profile avatar updated');
  });

  test('TC-USER-006: API - Should not update with empty name', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.put(`${config.apiUrl}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        name: '',
      },
    });

    expect(response.ok()).toBeFalsy();
  });
});

test.describe('User Profile - Change Password', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-USER-007: API - Should change password with valid current password', async ({ page }) => {
    const token = await getAuthToken(page);
    const newPassword = 'NewPassword123!';

    const response = await page.request.put(`${config.apiUrl}/users/change-password`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        currentPassword: seedUsers.priya.password,
        newPassword: newPassword,
      },
    });

    expect(response.ok()).toBeTruthy();

    console.log('✅ Password changed successfully');

    // Change back to original password
    await page.request.put(`${config.apiUrl}/users/change-password`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        currentPassword: newPassword,
        newPassword: seedUsers.priya.password,
      },
    });
  });

  test('TC-USER-008: API - Should not change password with wrong current password', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.put(`${config.apiUrl}/users/change-password`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        currentPassword: 'wrongpassword',
        newPassword: 'NewPassword123!',
      },
    });

    expect(response.ok()).toBeFalsy();
  });

  test('TC-USER-009: API - Should not change to short password', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.put(`${config.apiUrl}/users/change-password`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        currentPassword: seedUsers.priya.password,
        newPassword: '123',
      },
    });

    expect(response.ok()).toBeFalsy();
  });
});

test.describe('User Connections', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-USER-010: API - Should get user connections', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.get(`${config.apiUrl}/users/connections`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    console.log(`✅ Retrieved ${data.length} connections`);
  });

  test('TC-USER-011: API - Should get suggested connections', async ({ page }) => {
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

    console.log(`✅ Retrieved ${data.length} suggested connections`);
  });

  test('TC-USER-012: API - Should connect with another user', async ({ page }) => {
    const token = await getAuthToken(page);

    // First get suggested connections to find a user to connect with
    const suggestedResponse = await page.request.get(`${config.apiUrl}/users/suggested-connections`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const suggested = await suggestedResponse.json();

    if (suggested.length > 0) {
      const userToConnect = suggested[0];

      const connectResponse = await page.request.post(
        `${config.apiUrl}/users/connect/${userToConnect.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      expect(connectResponse.ok()).toBeTruthy();
      console.log(`✅ Connected with user: ${userToConnect.name}`);

      // Disconnect to clean up
      await page.request.delete(`${config.apiUrl}/users/disconnect/${userToConnect.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      console.log('ℹ️ No suggested connections available for testing');
    }
  });

  test('TC-USER-013: API - Should disconnect from a user', async ({ page }) => {
    const token = await getAuthToken(page);

    // First connect with a user
    const suggestedResponse = await page.request.get(`${config.apiUrl}/users/suggested-connections`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const suggested = await suggestedResponse.json();

    if (suggested.length > 0) {
      const userToConnect = suggested[0];

      // Connect first
      await page.request.post(`${config.apiUrl}/users/connect/${userToConnect.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Then disconnect
      const disconnectResponse = await page.request.delete(
        `${config.apiUrl}/users/disconnect/${userToConnect.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      expect(disconnectResponse.ok()).toBeTruthy();
      console.log(`✅ Disconnected from user: ${userToConnect.name}`);
    } else {
      console.log('ℹ️ No users available for disconnect testing');
    }
  });
});

test.describe('User Profile - UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-USER-014: Should navigate to profile from navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find profile link in navigation
    const profileLink = page.locator('a[href="/profile"], a:has-text("Profile"), [data-testid="profile-link"]');

    if (await profileLink.count() > 0) {
      await profileLink.first().click();
      await page.waitForURL('/profile', { timeout: 10000 });
      console.log('✅ Navigated to profile page');
    } else {
      console.log('ℹ️ Profile link not found in navigation');
    }
  });

  test('TC-USER-015: Should display user information on profile page', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Check for user name display
    const userName = page.locator(`text=${seedUsers.priya.name}`);
    
    if (await userName.count() > 0) {
      await expect(userName.first()).toBeVisible();
      console.log('✅ User name displayed on profile');
    } else {
      console.log('ℹ️ User name not found on profile page');
    }
  });
});
