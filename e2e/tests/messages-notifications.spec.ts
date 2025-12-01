/**
 * Messages and Notifications E2E Tests for CivicConnect
 * Tests: Conversations, Send Messages, Notifications
 */

import { test, expect } from '@playwright/test';
import {
  config,
  loginViaUI,
  getAuthToken,
} from '../helpers/test-utils';
import { seedUsers, testMessages, apiEndpoints } from '../fixtures/test-data';

// ==================== MESSAGES TESTS ====================

test.describe('Messages - Conversations', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-MSG-001: API - Should get conversations list', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.get(`${config.apiUrl}/messages/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    console.log(`✅ Retrieved ${data.length} conversations`);
  });

  test('TC-MSG-002: API - Should not get conversations without auth', async ({ page }) => {
    const response = await page.request.get(`${config.apiUrl}/messages/conversations`);

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);
  });

  test('TC-MSG-003: UI - Should display messages page', async ({ page }) => {
    await page.goto('/messages');
    await page.waitForLoadState('networkidle');

    const content = page.locator('main, [data-testid="messages"], .messages');
    await expect(content.first()).toBeVisible();

    console.log('✅ Messages page displayed');
  });
});

test.describe('Messages - Send', () => {
  let receiverId: string;

  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);

    // Get another user to send message to
    const token = await getAuthToken(page);
    const suggestedResponse = await page.request.get(`${config.apiUrl}/users/suggested-connections`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const suggested = await suggestedResponse.json();

    if (suggested.length > 0) {
      receiverId = suggested[0].id;
    }
  });

  test('TC-MSG-004: API - Should send a message', async ({ page }) => {
    if (!receiverId) {
      console.log('ℹ️ No receiver available for message testing');
      return;
    }

    const token = await getAuthToken(page);

    const response = await page.request.post(`${config.apiUrl}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        receiverId: receiverId,
        content: testMessages.simple.content,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('content');
    expect(data.content).toBe(testMessages.simple.content);

    console.log(`✅ Message sent to user ${receiverId}`);
  });

  test('TC-MSG-005: API - Should send message with emojis', async ({ page }) => {
    if (!receiverId) {
      console.log('ℹ️ No receiver available for message testing');
      return;
    }

    const token = await getAuthToken(page);

    const response = await page.request.post(`${config.apiUrl}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        receiverId: receiverId,
        content: testMessages.withEmoji.content,
      },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.content).toBe(testMessages.withEmoji.content);

    console.log('✅ Message with emojis sent');
  });

  test('TC-MSG-006: API - Should not send empty message', async ({ page }) => {
    if (!receiverId) {
      console.log('ℹ️ No receiver available for message testing');
      return;
    }

    const token = await getAuthToken(page);

    const response = await page.request.post(`${config.apiUrl}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        receiverId: receiverId,
        content: '',
      },
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
  });

  test('TC-MSG-007: API - Should not send message without receiver', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.post(`${config.apiUrl}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: 'Test message',
      },
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
  });
});

test.describe('Messages - Conversation Detail', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-MSG-008: API - Should get conversation messages', async ({ page }) => {
    const token = await getAuthToken(page);

    // First get conversations
    const conversationsResponse = await page.request.get(`${config.apiUrl}/messages/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const conversations = await conversationsResponse.json();

    if (conversations.length > 0) {
      const conversationId = conversations[0].id;

      const response = await page.request.get(
        `${config.apiUrl}/messages/conversations/${conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();

      console.log(`✅ Retrieved ${data.length} messages from conversation`);
    } else {
      console.log('ℹ️ No conversations available for testing');
    }
  });
});

// ==================== NOTIFICATIONS TESTS ====================

test.describe('Notifications - List', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-NOTIF-001: API - Should get notifications list', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.get(`${config.apiUrl}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    console.log(`✅ Retrieved ${data.length} notifications`);
  });

  test('TC-NOTIF-002: API - Should not get notifications without auth', async ({ page }) => {
    const response = await page.request.get(`${config.apiUrl}/notifications`);

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);
  });

  test('TC-NOTIF-003: UI - Should display notifications page', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForLoadState('networkidle');

    const content = page.locator('main, [data-testid="notifications"], .notifications');
    await expect(content.first()).toBeVisible();

    console.log('✅ Notifications page displayed');
  });
});

test.describe('Notifications - Mark as Read', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-NOTIF-004: API - Should mark notification as read', async ({ page }) => {
    const token = await getAuthToken(page);

    // Get notifications first
    const listResponse = await page.request.get(`${config.apiUrl}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const notifications = await listResponse.json();

    if (notifications.length > 0) {
      const notificationId = notifications[0].id;

      const response = await page.request.put(
        `${config.apiUrl}/notifications/${notificationId}/read`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      expect(response.ok()).toBeTruthy();
      console.log(`✅ Notification ${notificationId} marked as read`);
    } else {
      console.log('ℹ️ No notifications available for testing');
    }
  });

  test('TC-NOTIF-005: API - Should mark all notifications as read', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.put(`${config.apiUrl}/notifications/read-all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    console.log('✅ All notifications marked as read');
  });
});

// ==================== SEARCH TESTS ====================

test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-SEARCH-001: API - Should search with query', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.get(`${config.apiUrl}/search?q=test`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('users');
    expect(data).toHaveProperty('posts');

    console.log(`✅ Search returned ${data.users?.length || 0} users and ${data.posts?.length || 0} posts`);
  });

  test('TC-SEARCH-002: API - Should handle empty search query', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.get(`${config.apiUrl}/search?q=`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Should either return empty results or error
    expect([200, 400]).toContain(response.status());
  });

  test('TC-SEARCH-003: API - Should not search without authentication', async ({ page }) => {
    const response = await page.request.get(`${config.apiUrl}/search?q=test`);

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);
  });
});

// ==================== HEALTH CHECK TESTS ====================

test.describe('API Health', () => {
  test('TC-HEALTH-001: API - Health endpoint should be accessible', async ({ page }) => {
    const response = await page.request.get(`${config.apiUrl}/health`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('ok');

    console.log('✅ API health check passed');
  });
});
