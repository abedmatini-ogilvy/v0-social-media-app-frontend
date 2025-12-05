/**
 * E2E Tests for Reply Notifications (Phase 2)
 * Tests that notifications are created when someone replies to a comment
 */
import { test, expect } from '@playwright/test';

// Test user credentials
const USER_1 = {
  email: 'priya@example.com',
  password: 'password123',
};

const USER_2 = {
  email: 'raj@example.com',
  password: 'password123',
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

// Helper to create a test post
async function createTestPost(token: string, content: string): Promise<string> {
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
): Promise<{ id: string; content: string; parentId: string | null }> {
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
}>> {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

test.describe('Reply Notification API Tests', () => {
  let user1Token: string;
  let user2Token: string;

  test.beforeAll(async () => {
    user1Token = await getAuthToken(USER_1.email, USER_1.password);
    user2Token = await getAuthToken(USER_2.email, USER_2.password);
  });

  test('TC-NOTIFY-001: Should create notification when someone comments on your post', async () => {
    // User 1 creates a post
    const postId = await createTestPost(user1Token, `Test post for notification - ${Date.now()}`);

    // Get User 1's notifications before
    const notificationsBefore = await getNotifications(user1Token);
    const countBefore = notificationsBefore.length;

    // User 2 comments on User 1's post
    await createComment(user2Token, postId, 'Great post! This is a test comment.');

    // Get User 1's notifications after
    const notificationsAfter = await getNotifications(user1Token);
    
    // Should have one more notification
    expect(notificationsAfter.length).toBeGreaterThan(countBefore);

    // Find the new notification
    const newNotification = notificationsAfter.find(
      (n) => n.title === 'New Comment' && n.actionUrl?.includes(postId)
    );

    expect(newNotification).toBeTruthy();
    expect(newNotification?.content).toContain('commented on your post');
    expect(newNotification?.type).toBe('message');
  });

  test('TC-NOTIFY-002: Should create notification when someone replies to your comment', async () => {
    // User 1 creates a post
    const postId = await createTestPost(user1Token, `Test post for reply notification - ${Date.now()}`);

    // User 2 comments on the post
    const comment = await createComment(user2Token, postId, 'This is my comment');

    // Get User 2's notifications before
    const notificationsBefore = await getNotifications(user2Token);
    const countBefore = notificationsBefore.length;

    // User 1 replies to User 2's comment
    await createComment(user1Token, postId, 'This is a reply to your comment', comment.id);

    // Get User 2's notifications after
    const notificationsAfter = await getNotifications(user2Token);

    // Should have one more notification
    expect(notificationsAfter.length).toBeGreaterThan(countBefore);

    // Find the new notification
    const newNotification = notificationsAfter.find(
      (n) => n.title === 'New Reply' && n.actionUrl?.includes(postId)
    );

    expect(newNotification).toBeTruthy();
    expect(newNotification?.content).toContain('replied to your comment');
    expect(newNotification?.type).toBe('message');
  });

  test('TC-NOTIFY-003: Should NOT create notification when commenting on own post', async () => {
    // User 1 creates a post
    const postId = await createTestPost(user1Token, `My own post - ${Date.now()}`);

    // Get User 1's notifications before
    const notificationsBefore = await getNotifications(user1Token);
    const countBefore = notificationsBefore.length;

    // User 1 comments on their own post
    await createComment(user1Token, postId, 'Commenting on my own post');

    // Get User 1's notifications after
    const notificationsAfter = await getNotifications(user1Token);

    // Should NOT have a new "New Comment" notification for own post
    const selfCommentNotification = notificationsAfter.find(
      (n) => n.title === 'New Comment' && 
             n.actionUrl?.includes(postId) &&
             notificationsAfter.indexOf(n) >= countBefore
    );

    expect(selfCommentNotification).toBeUndefined();
  });

  test('TC-NOTIFY-004: Should NOT create notification when replying to own comment', async () => {
    // User 1 creates a post
    const postId = await createTestPost(user1Token, `Post for self-reply test - ${Date.now()}`);

    // User 1 comments on the post
    const comment = await createComment(user1Token, postId, 'My comment');

    // Get User 1's notifications before
    const notificationsBefore = await getNotifications(user1Token);
    const countBefore = notificationsBefore.length;

    // User 1 replies to their own comment
    await createComment(user1Token, postId, 'Replying to myself', comment.id);

    // Get User 1's notifications after
    const notificationsAfter = await getNotifications(user1Token);

    // Should NOT have a new "New Reply" notification for self-reply
    const newReplyNotifications = notificationsAfter.filter(
      (n) => n.title === 'New Reply' && 
             notificationsAfter.indexOf(n) >= countBefore
    );

    // Count should be same (no new reply notifications)
    expect(newReplyNotifications.length).toBe(0);
  });

  test('TC-NOTIFY-005: Notification should include @handle in content', async () => {
    // User 1 creates a post
    const postId = await createTestPost(user1Token, `Handle notification test - ${Date.now()}`);

    // User 2 comments (User 2 should have handle raj_kumar from seed)
    await createComment(user2Token, postId, 'Comment from raj');

    // Get User 1's latest notifications
    const notifications = await getNotifications(user1Token);
    
    // Find the notification
    const notification = notifications.find(
      (n) => n.title === 'New Comment' && n.actionUrl?.includes(postId)
    );

    // Should contain @handle
    expect(notification?.content).toMatch(/@raj_kumar|Raj Kumar/);
  });

  test('TC-NOTIFY-006: Notification should have correct actionUrl', async () => {
    // User 1 creates a post
    const postId = await createTestPost(user1Token, `ActionUrl test - ${Date.now()}`);

    // User 2 comments
    await createComment(user2Token, postId, 'Testing actionUrl');

    // Get User 1's notifications
    const notifications = await getNotifications(user1Token);
    
    // Find the notification
    const notification = notifications.find(
      (n) => n.title === 'New Comment' && n.actionUrl?.includes(postId)
    );

    expect(notification?.actionUrl).toBe(`/?post=${postId}`);
  });

  test('TC-NOTIFY-007: Nested reply should notify the correct parent comment author', async () => {
    // User 1 creates a post
    const postId = await createTestPost(user1Token, `Nested reply notification test - ${Date.now()}`);

    // User 1 creates a comment
    const parentComment = await createComment(user1Token, postId, 'Parent comment');

    // User 2 replies to User 1's comment
    const reply = await createComment(user2Token, postId, 'First level reply', parentComment.id);

    // Get User 2's notifications before
    const notificationsBefore = await getNotifications(user2Token);
    const countBefore = notificationsBefore.length;

    // User 1 replies to User 2's reply (nested reply)
    await createComment(user1Token, postId, 'Nested reply', reply.id);

    // Get User 2's notifications after
    const notificationsAfter = await getNotifications(user2Token);

    // User 2 should get a notification about the reply to their comment
    expect(notificationsAfter.length).toBeGreaterThan(countBefore);

    const newNotification = notificationsAfter.find(
      (n) => n.title === 'New Reply' && 
             !notificationsBefore.some(nb => nb.id === n.id)
    );

    expect(newNotification).toBeTruthy();
    expect(newNotification?.content).toContain('replied to your comment');
  });
});
