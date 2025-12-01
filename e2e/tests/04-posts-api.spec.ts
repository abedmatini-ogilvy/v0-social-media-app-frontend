/**
 * Group 4: Posts API Tests
 * Tests posts CRUD, likes, comments via API
 */

import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://127.0.0.1:3001/api';

const existingUser = {
  email: 'priya@example.com',
  password: 'password123',
};

let authToken: string;
let createdPostId: string;

test.describe('Group 4: Posts API', () => {
  
  // Get auth token before all tests
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/login`, {
      data: {
        email: existingUser.email,
        password: existingUser.password,
      },
    });
    const data = await response.json();
    authToken = data.token;
  });

  test('TC-POST-API-001: Get posts feed', async ({ request }) => {
    const response = await request.get(`${API_URL}/posts/feed`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('posts');
    expect(Array.isArray(data.posts)).toBeTruthy();

    console.log(`✅ Feed API works - ${data.posts.length} posts`);
  });

  test('TC-POST-API-002: Create a new post', async ({ request }) => {
    const content = `Test post ${Date.now()}`;

    const response = await request.post(`${API_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { content },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.content).toBe(content);

    createdPostId = data.id;
    console.log(`✅ Create post works - ID: ${createdPostId}`);
  });

  test('TC-POST-API-003: Get single post', async ({ request }) => {
    // Skip if no post was created
    if (!createdPostId) {
      test.skip();
      return;
    }

    const response = await request.get(`${API_URL}/posts/${createdPostId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.id).toBe(createdPostId);

    console.log('✅ Get single post works');
  });

  test('TC-POST-API-004: Update post', async ({ request }) => {
    if (!createdPostId) {
      test.skip();
      return;
    }

    const updatedContent = `Updated post ${Date.now()}`;

    const response = await request.put(`${API_URL}/posts/${createdPostId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { content: updatedContent },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.content).toBe(updatedContent);

    console.log('✅ Update post works');
  });

  test('TC-POST-API-005: Like post', async ({ request }) => {
    if (!createdPostId) {
      test.skip();
      return;
    }

    const response = await request.post(`${API_URL}/posts/${createdPostId}/like`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.likes).toBeGreaterThan(0);

    console.log(`✅ Like post works - likes: ${data.likes}`);
  });

  test('TC-POST-API-006: Unlike post', async ({ request }) => {
    if (!createdPostId) {
      test.skip();
      return;
    }

    const response = await request.delete(`${API_URL}/posts/${createdPostId}/unlike`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.ok()).toBeTruthy();

    console.log('✅ Unlike post works');
  });

  test('TC-POST-API-007: Add comment to post', async ({ request }) => {
    if (!createdPostId) {
      test.skip();
      return;
    }

    const commentContent = `Test comment ${Date.now()}`;

    const response = await request.post(`${API_URL}/posts/${createdPostId}/comments`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { content: commentContent },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data.content).toBe(commentContent);

    console.log('✅ Add comment works');
  });

  test('TC-POST-API-008: Get comments for post', async ({ request }) => {
    if (!createdPostId) {
      test.skip();
      return;
    }

    const response = await request.get(`${API_URL}/posts/${createdPostId}/comments`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    console.log(`✅ Get comments works - ${data.length} comments`);
  });

  test('TC-POST-API-009: Delete post', async ({ request }) => {
    if (!createdPostId) {
      test.skip();
      return;
    }

    const response = await request.delete(`${API_URL}/posts/${createdPostId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.ok()).toBeTruthy();

    // Verify deleted
    const getResponse = await request.get(`${API_URL}/posts/${createdPostId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(getResponse.status()).toBe(404);

    console.log('✅ Delete post works');
  });

  test('TC-POST-API-010: Cannot create post without auth', async ({ request }) => {
    const response = await request.post(`${API_URL}/posts`, {
      headers: { 'Content-Type': 'application/json' },
      data: { content: 'Unauthorized post' },
    });

    expect(response.status()).toBe(401);

    console.log('✅ Post creation requires auth');
  });
});
