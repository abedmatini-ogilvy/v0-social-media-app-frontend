/**
 * E2E Tests for @Mention Notifications (Phase 3)
 * Tests that notifications are created when someone @mentions a user
 */
import { test, expect } from '@playwright/test';

// Test user credentials (from seed data with known handles)
const USER_PRIYA = {
  email: 'priya@example.com',
  password: 'password123',
  handle: 'priya_sharma',
};

const USER_RAJ = {
  email: 'raj@example.com',
  password: 'password123',
  handle: 'raj_kumar',
};

const USER_OFFICIAL = {
  email: 'official@gov.in',
  password: 'password123',
  handle: 'municipal_official',
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper to login and get token
async function getAuthToken(email: string, password: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return data.token;
}

// Helper to create a post
async function createPost(token: string, content: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  const data = await response.json();
  return data.id;
}

// Helper to create a comment
async function createComment(
  token: string,
  postId: string,
  content: string,
  parentId?: string
): Promise<{ id: string }> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, parentId }),
  });
  return response.json();
}

// Helper to get notifications
async function getNotifications(token: string): Promise<Array<{
  id: string;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  actionUrl: string | null;
  createdAt: string;
}>> {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

test.describe('@Mention Notification API Tests', () => {
  let priyaToken: string;
  let rajToken: string;
  let officialToken: string;

  test.beforeAll(async () => {
    priyaToken = await getAuthToken(USER_PRIYA.email, USER_PRIYA.password);
    rajToken = await getAuthToken(USER_RAJ.email, USER_RAJ.password);
    officialToken = await getAuthToken(USER_OFFICIAL.email, USER_OFFICIAL.password);
  });

  test('TC-MENTION-001: Should create notification when mentioned in a post', async () => {
    // Get Raj's notifications before
    const notificationsBefore = await getNotifications(rajToken);
    const countBefore = notificationsBefore.length;

    // Priya creates a post mentioning Raj
    await createPost(priyaToken, `Hey @${USER_RAJ.handle}, check out this update! ${Date.now()}`);

    // Get Raj's notifications after
    const notificationsAfter = await getNotifications(rajToken);

    // Should have one more notification
    expect(notificationsAfter.length).toBeGreaterThan(countBefore);

    // Find the mention notification
    const mentionNotification = notificationsAfter.find(
      (n) => n.title === 'You were mentioned' && 
             n.content.includes('mentioned you in a post')
    );

    expect(mentionNotification).toBeTruthy();
  });

  test('TC-MENTION-002: Should create notification when mentioned in a comment', async () => {
    // Create a post first
    const postId = await createPost(priyaToken, `Test post for comment mentions - ${Date.now()}`);

    // Get Raj's notifications before
    const notificationsBefore = await getNotifications(rajToken);
    const countBefore = notificationsBefore.length;

    // Official comments and mentions Raj
    await createComment(officialToken, postId, `@${USER_RAJ.handle} please look into this matter`);

    // Get Raj's notifications after
    const notificationsAfter = await getNotifications(rajToken);

    // Should have one more notification
    expect(notificationsAfter.length).toBeGreaterThan(countBefore);

    // Find the mention notification
    const mentionNotification = notificationsAfter.find(
      (n) => n.title === 'You were mentioned' && 
             n.content.includes('mentioned you in a comment')
    );

    expect(mentionNotification).toBeTruthy();
  });

  test('TC-MENTION-003: Should NOT create notification when mentioning yourself', async () => {
    // Get Priya's notifications before
    const notificationsBefore = await getNotifications(priyaToken);
    const mentionCountBefore = notificationsBefore.filter(
      n => n.title === 'You were mentioned'
    ).length;

    // Priya creates a post mentioning herself
    await createPost(priyaToken, `Note to self @${USER_PRIYA.handle}: remember to follow up - ${Date.now()}`);

    // Get Priya's notifications after
    const notificationsAfter = await getNotifications(priyaToken);
    const mentionCountAfter = notificationsAfter.filter(
      n => n.title === 'You were mentioned'
    ).length;

    // Should NOT have a new "You were mentioned" notification
    expect(mentionCountAfter).toBe(mentionCountBefore);
  });

  test('TC-MENTION-004: Should create notifications for multiple mentions', async () => {
    // Get both Raj and Official's notifications before
    const rajBefore = await getNotifications(rajToken);
    const officialBefore = await getNotifications(officialToken);

    // Priya creates a post mentioning both
    await createPost(
      priyaToken, 
      `Calling @${USER_RAJ.handle} and @${USER_OFFICIAL.handle} to discuss this - ${Date.now()}`
    );

    // Get notifications after
    const rajAfter = await getNotifications(rajToken);
    const officialAfter = await getNotifications(officialToken);

    // Both should have received notifications
    expect(rajAfter.length).toBeGreaterThan(rajBefore.length);
    expect(officialAfter.length).toBeGreaterThan(officialBefore.length);
  });

  test('TC-MENTION-005: Should handle case-insensitive mentions', async () => {
    // Get Raj's notifications before
    const notificationsBefore = await getNotifications(rajToken);
    const countBefore = notificationsBefore.length;

    // Priya creates a post with uppercase mention
    await createPost(priyaToken, `Hey @RAJ_KUMAR, testing case sensitivity - ${Date.now()}`);

    // Get Raj's notifications after
    const notificationsAfter = await getNotifications(rajToken);

    // Should still receive notification (case-insensitive)
    expect(notificationsAfter.length).toBeGreaterThan(countBefore);
  });

  test('TC-MENTION-006: Should ignore mentions of non-existent handles', async () => {
    // This should not throw an error
    const postId = await createPost(
      priyaToken, 
      `Testing @nonexistent_user_12345 mention - ${Date.now()}`
    );

    // Post should be created successfully
    expect(postId).toBeTruthy();
  });

  test('TC-MENTION-007: Should not duplicate notifications for same handle mentioned multiple times', async () => {
    // Get Raj's notifications before
    const notificationsBefore = await getNotifications(rajToken);
    const countBefore = notificationsBefore.length;

    // Priya creates a post mentioning Raj multiple times
    await createPost(
      priyaToken, 
      `@${USER_RAJ.handle} please check this @${USER_RAJ.handle} urgently @${USER_RAJ.handle} - ${Date.now()}`
    );

    // Get Raj's notifications after
    const notificationsAfter = await getNotifications(rajToken);

    // Should only have ONE new notification (not 3)
    expect(notificationsAfter.length).toBe(countBefore + 1);
  });

  test('TC-MENTION-008: Mention notification should have correct actionUrl', async () => {
    // Priya creates a post mentioning Raj
    const postId = await createPost(
      priyaToken, 
      `@${USER_RAJ.handle} actionUrl test - ${Date.now()}`
    );

    // Get Raj's notifications
    const notifications = await getNotifications(rajToken);

    // Find the mention notification with this post
    const notification = notifications.find(
      (n) => n.title === 'You were mentioned' && n.actionUrl?.includes(postId)
    );

    expect(notification).toBeTruthy();
    expect(notification?.actionUrl).toBe(`/?post=${postId}`);
  });

  test('TC-MENTION-009: Mention in reply should notify mentioned user', async () => {
    // Priya creates a post
    const postId = await createPost(priyaToken, `Original post - ${Date.now()}`);

    // Official comments
    const comment = await createComment(officialToken, postId, 'First comment');

    // Get Raj's notifications before
    const notificationsBefore = await getNotifications(rajToken);
    const countBefore = notificationsBefore.length;

    // Priya replies to Official's comment and mentions Raj
    await createComment(
      priyaToken, 
      postId, 
      `@${USER_RAJ.handle} you should see this reply`, 
      comment.id
    );

    // Get Raj's notifications after
    const notificationsAfter = await getNotifications(rajToken);

    // Raj should have received a mention notification
    expect(notificationsAfter.length).toBeGreaterThan(countBefore);

    const mentionNotification = notificationsAfter.find(
      (n) => n.title === 'You were mentioned' && 
             n.content.includes('mentioned you in a comment')
    );

    expect(mentionNotification).toBeTruthy();
  });
});
