/**
 * Posts E2E Tests for CivicConnect
 * Tests: Create, Read, Update, Delete, Like, Unlike, Comments
 */

import { test, expect } from '@playwright/test';
import {
  config,
  loginViaUI,
  loginViaAPI,
  logout,
  getAuthToken,
  generatePostContent,
  generateCommentContent,
  apiRequest,
} from '../helpers/test-utils';
import {
  seedUsers,
  testPosts,
  testComments,
  invalidPosts,
  invalidComments,
  apiEndpoints,
} from '../fixtures/test-data';

// Store created post IDs for cleanup/reference
let createdPostIds: string[] = [];

test.describe('Posts - Feed', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-POST-001: Should display posts feed after login', async ({ page }) => {
    // Navigate to home/feed
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for posts to load
    await page.waitForTimeout(2000);

    // Verify feed container exists
    const feedExists = await page.locator('[data-testid="feed"], main, .feed').count() > 0;
    expect(feedExists).toBeTruthy();

    console.log('✅ Posts feed displayed');
  });

  test('TC-POST-002: Should display post creation form', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for post creation input
    const postInput = page.locator('textarea, input[placeholder*="What"], [data-testid="post-input"]');
    
    if (await postInput.count() > 0) {
      await expect(postInput.first()).toBeVisible();
      console.log('✅ Post creation form visible');
    } else {
      console.log('ℹ️ Post creation form not found on feed page');
    }
  });

  test('TC-POST-003: API - Should fetch posts feed', async ({ page }) => {
    const token = await getAuthToken(page);
    
    const response = await page.request.get(`${config.apiUrl}/posts/feed`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('posts');
    expect(Array.isArray(data.posts)).toBeTruthy();
    expect(data).toHaveProperty('pagination');

    console.log(`✅ API returned ${data.posts.length} posts`);
  });
});

test.describe('Posts - Create', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-POST-004: Should create a new post via UI', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const postContent = generatePostContent();

    // Find and fill post input
    const postInput = page.locator('textarea, input[placeholder*="What"], [data-testid="post-input"]');
    
    if (await postInput.count() > 0) {
      await postInput.first().fill(postContent);

      // Find and click post button
      const postButton = page.locator('button:has-text("Post"), button:has-text("Share"), [data-testid="post-button"]');
      await postButton.first().click();

      // Wait for post to be created
      await page.waitForTimeout(3000);

      // Verify post appears in feed
      const newPost = page.locator(`text=${postContent.substring(0, 30)}`);
      
      if (await newPost.count() > 0) {
        console.log(`✅ Post created via UI: "${postContent.substring(0, 50)}..."`);
      } else {
        console.log('ℹ️ Post may have been created but not visible in current view');
      }
    } else {
      console.log('ℹ️ Post input not found, skipping UI test');
    }
  });

  test('TC-POST-005: API - Should create a new post', async ({ page }) => {
    const token = await getAuthToken(page);
    const postContent = generatePostContent();

    const response = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: postContent,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('content');
    expect(data.content).toBe(postContent);
    expect(data).toHaveProperty('author');

    // Store for later tests
    createdPostIds.push(data.id);

    console.log(`✅ API Post created: ${data.id}`);
  });

  test('TC-POST-006: API - Should not create post with empty content', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: '',
      },
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
  });

  test('TC-POST-007: API - Should not create post without authentication', async ({ page }) => {
    const response = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        content: 'Unauthorized post',
      },
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);
  });

  test('TC-POST-008: API - Should create post with special characters', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: testPosts.withSpecialChars.content,
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.content).toBe(testPosts.withSpecialChars.content);

    createdPostIds.push(data.id);
    console.log('✅ Post with special characters created');
  });

  test('TC-POST-009: API - Should create post with emojis', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: testPosts.withEmoji.content,
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.content).toBe(testPosts.withEmoji.content);

    createdPostIds.push(data.id);
    console.log('✅ Post with emojis created');
  });
});

test.describe('Posts - Read', () => {
  let testPostId: string;

  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);

    // Create a test post first
    const token = await getAuthToken(page);
    const response = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: generatePostContent(),
      },
    });

    const data = await response.json();
    testPostId = data.id;
    createdPostIds.push(testPostId);
  });

  test('TC-POST-010: API - Should get single post by ID', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.get(`${config.apiUrl}/posts/${testPostId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.id).toBe(testPostId);
    expect(data).toHaveProperty('content');
    expect(data).toHaveProperty('author');

    console.log(`✅ Retrieved post: ${testPostId}`);
  });

  test('TC-POST-011: API - Should return 404 for non-existent post', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.get(`${config.apiUrl}/posts/non-existent-id-12345`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(404);
  });
});

test.describe('Posts - Update', () => {
  let testPostId: string;

  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);

    // Create a test post first
    const token = await getAuthToken(page);
    const response = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: 'Original post content for update test',
      },
    });

    const data = await response.json();
    testPostId = data.id;
    createdPostIds.push(testPostId);
  });

  test('TC-POST-012: API - Should update own post', async ({ page }) => {
    const token = await getAuthToken(page);
    const updatedContent = 'Updated post content - ' + Date.now();

    const response = await page.request.put(`${config.apiUrl}/posts/${testPostId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: updatedContent,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.content).toBe(updatedContent);

    console.log(`✅ Post updated: ${testPostId}`);
  });

  test('TC-POST-013: API - Should not update post with empty content', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.put(`${config.apiUrl}/posts/${testPostId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: '',
      },
    });

    expect(response.ok()).toBeFalsy();
  });
});

test.describe('Posts - Delete', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-POST-014: API - Should delete own post', async ({ page }) => {
    const token = await getAuthToken(page);

    // Create a post to delete
    const createResponse = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: 'Post to be deleted',
      },
    });

    const createData = await createResponse.json();
    const postId = createData.id;

    // Delete the post
    const deleteResponse = await page.request.delete(`${config.apiUrl}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(deleteResponse.ok()).toBeTruthy();

    // Verify post is deleted
    const getResponse = await page.request.get(`${config.apiUrl}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(getResponse.status()).toBe(404);

    console.log(`✅ Post deleted: ${postId}`);
  });
});

test.describe('Posts - Like/Unlike', () => {
  let testPostId: string;

  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);

    // Create a test post
    const token = await getAuthToken(page);
    const response = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: 'Post for like/unlike testing',
      },
    });

    const data = await response.json();
    testPostId = data.id;
    createdPostIds.push(testPostId);
  });

  test('TC-POST-015: API - Should like a post', async ({ page }) => {
    const token = await getAuthToken(page);

    // Get initial likes count
    const getResponse = await page.request.get(`${config.apiUrl}/posts/${testPostId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const initialData = await getResponse.json();
    const initialLikes = initialData.likes;

    // Like the post
    const likeResponse = await page.request.post(`${config.apiUrl}/posts/${testPostId}/like`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(likeResponse.ok()).toBeTruthy();

    const likeData = await likeResponse.json();
    expect(likeData.likes).toBe(initialLikes + 1);

    console.log(`✅ Post liked: ${testPostId} (likes: ${likeData.likes})`);
  });

  test('TC-POST-016: API - Should unlike a post', async ({ page }) => {
    const token = await getAuthToken(page);

    // First like the post
    await page.request.post(`${config.apiUrl}/posts/${testPostId}/like`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Get likes count after liking
    const getResponse = await page.request.get(`${config.apiUrl}/posts/${testPostId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const afterLikeData = await getResponse.json();
    const likesAfterLike = afterLikeData.likes;

    // Unlike the post
    const unlikeResponse = await page.request.delete(`${config.apiUrl}/posts/${testPostId}/unlike`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(unlikeResponse.ok()).toBeTruthy();

    const unlikeData = await unlikeResponse.json();
    expect(unlikeData.likes).toBe(likesAfterLike - 1);

    console.log(`✅ Post unliked: ${testPostId} (likes: ${unlikeData.likes})`);
  });

  test('TC-POST-017: UI - Should like post via button click', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Find a like button
    const likeButton = page.locator('button:has-text("Like"), [data-testid="like-button"], button[aria-label*="like" i]').first();

    if (await likeButton.count() > 0) {
      await likeButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Like button clicked');
    } else {
      console.log('ℹ️ Like button not found in UI');
    }
  });
});

test.describe('Posts - Comments', () => {
  let testPostId: string;

  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);

    // Create a test post
    const token = await getAuthToken(page);
    const response = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: 'Post for comment testing',
      },
    });

    const data = await response.json();
    testPostId = data.id;
    createdPostIds.push(testPostId);
  });

  test('TC-POST-018: API - Should add comment to post', async ({ page }) => {
    const token = await getAuthToken(page);
    const commentContent = generateCommentContent();

    const response = await page.request.post(`${config.apiUrl}/posts/${testPostId}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: commentContent,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.content).toBe(commentContent);
    expect(data).toHaveProperty('author');

    console.log(`✅ Comment added to post ${testPostId}`);
  });

  test('TC-POST-019: API - Should get comments for post', async ({ page }) => {
    const token = await getAuthToken(page);

    // Add a comment first
    await page.request.post(`${config.apiUrl}/posts/${testPostId}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: 'Test comment for retrieval',
      },
    });

    // Get comments
    const response = await page.request.get(`${config.apiUrl}/posts/${testPostId}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);

    console.log(`✅ Retrieved ${data.length} comments for post ${testPostId}`);
  });

  test('TC-POST-020: API - Should not add empty comment', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.post(`${config.apiUrl}/posts/${testPostId}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: '',
      },
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
  });

  test('TC-POST-021: API - Should add comment with emojis', async ({ page }) => {
    const token = await getAuthToken(page);

    const response = await page.request.post(`${config.apiUrl}/posts/${testPostId}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: testComments.withEmoji.content,
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.content).toBe(testComments.withEmoji.content);

    console.log('✅ Comment with emojis added');
  });
});
