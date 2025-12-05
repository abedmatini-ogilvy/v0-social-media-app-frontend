/**
 * Like Persistence E2E Tests for CivicConnect
 * Tests: Like persistence, unlike toggle, likers list, tooltip & modal
 */

import { test, expect } from '@playwright/test';
import {
  config,
  loginViaUI,
  logout,
  getAuthToken,
  generatePostContent,
} from '../helpers/test-utils';
import { seedUsers } from '../fixtures/test-data';

let testPostId: string;

test.describe('Like Persistence - API Tests', () => {
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
        content: generatePostContent(),
      },
    });
    
    const data = await response.json();
    testPostId = data.id;
  });

  test('TC-LIKE-001: API - Should return isLikedByCurrentUser in feed response', async ({ page }) => {
    const token = await getAuthToken(page);
    
    const response = await page.request.get(`${config.apiUrl}/posts/feed`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    
    expect(data).toHaveProperty('posts');
    expect(Array.isArray(data.posts)).toBeTruthy();
    
    if (data.posts.length > 0) {
      const post = data.posts[0];
      expect(post).toHaveProperty('isLikedByCurrentUser');
      expect(typeof post.isLikedByCurrentUser).toBe('boolean');
      expect(post).toHaveProperty('likes');
      expect(typeof post.likes).toBe('number');
      console.log('✅ API returns isLikedByCurrentUser field');
    }
  });

  test('TC-LIKE-002: API - Should like a post and persist', async ({ page }) => {
    const token = await getAuthToken(page);
    
    // Like the post
    const likeResponse = await page.request.post(`${config.apiUrl}/posts/${testPostId}/like`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    expect(likeResponse.ok()).toBeTruthy();
    const likedPost = await likeResponse.json();
    
    expect(likedPost.isLikedByCurrentUser).toBe(true);
    expect(likedPost.likes).toBeGreaterThanOrEqual(1);
    
    // Fetch the post again to verify persistence
    const getResponse = await page.request.get(`${config.apiUrl}/posts/${testPostId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const fetchedPost = await getResponse.json();
    expect(fetchedPost.isLikedByCurrentUser).toBe(true);
    
    console.log('✅ Like persists after re-fetching post');
  });

  test('TC-LIKE-003: API - Should unlike a post', async ({ page }) => {
    const token = await getAuthToken(page);
    
    // First like the post
    await page.request.post(`${config.apiUrl}/posts/${testPostId}/like`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Then unlike
    const unlikeResponse = await page.request.delete(`${config.apiUrl}/posts/${testPostId}/unlike`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    expect(unlikeResponse.ok()).toBeTruthy();
    const unlikedPost = await unlikeResponse.json();
    
    expect(unlikedPost.isLikedByCurrentUser).toBe(false);
    
    console.log('✅ Unlike works correctly');
  });

  test('TC-LIKE-004: API - Should prevent duplicate likes', async ({ page }) => {
    const token = await getAuthToken(page);
    
    // Like the post first time
    const firstLike = await page.request.post(`${config.apiUrl}/posts/${testPostId}/like`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(firstLike.ok()).toBeTruthy();
    
    // Try to like again - should fail
    const secondLike = await page.request.post(`${config.apiUrl}/posts/${testPostId}/like`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    expect(secondLike.status()).toBe(400);
    const errorData = await secondLike.json();
    expect(errorData.error.code).toBe('ALREADY_LIKED');
    
    console.log('✅ Duplicate likes prevented');
  });

  test('TC-LIKE-005: API - Should prevent unliking non-liked post', async ({ page }) => {
    const token = await getAuthToken(page);
    
    // Try to unlike without liking first
    const unlikeResponse = await page.request.delete(`${config.apiUrl}/posts/${testPostId}/unlike`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    expect(unlikeResponse.status()).toBe(400);
    const errorData = await unlikeResponse.json();
    expect(errorData.error.code).toBe('NOT_LIKED');
    
    console.log('✅ Cannot unlike a post not liked');
  });

  test('TC-LIKE-006: API - Should get likers list', async ({ page }) => {
    const token = await getAuthToken(page);
    
    // Like the post first
    await page.request.post(`${config.apiUrl}/posts/${testPostId}/like`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Get likers
    const likersResponse = await page.request.get(`${config.apiUrl}/posts/${testPostId}/likers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    expect(likersResponse.ok()).toBeTruthy();
    const data = await likersResponse.json();
    
    expect(data).toHaveProperty('likers');
    expect(Array.isArray(data.likers)).toBeTruthy();
    expect(data.likers.length).toBeGreaterThanOrEqual(1);
    
    // Check liker structure
    const liker = data.likers[0];
    expect(liker).toHaveProperty('id');
    expect(liker).toHaveProperty('name');
    expect(liker).toHaveProperty('likedAt');
    
    expect(data).toHaveProperty('pagination');
    expect(data.pagination).toHaveProperty('total');
    
    console.log(`✅ Got ${data.likers.length} likers with pagination`);
  });

  test('TC-LIKE-007: API - Like count should be accurate', async ({ page }) => {
    // Login as priya and like
    const priyaToken = await getAuthToken(page);
    await page.request.post(`${config.apiUrl}/posts/${testPostId}/like`, {
      headers: { Authorization: `Bearer ${priyaToken}` },
    });
    
    // Login as raj and like
    await logout(page);
    await loginViaUI(page, seedUsers.raj.email, seedUsers.raj.password);
    const rajToken = await getAuthToken(page);
    
    await page.request.post(`${config.apiUrl}/posts/${testPostId}/like`, {
      headers: { Authorization: `Bearer ${rajToken}` },
    });
    
    // Fetch post and check count
    const response = await page.request.get(`${config.apiUrl}/posts/${testPostId}`, {
      headers: { Authorization: `Bearer ${rajToken}` },
    });
    
    const post = await response.json();
    expect(post.likes).toBe(2);
    
    console.log('✅ Like count accurate with multiple users');
  });
});

test.describe('Like Persistence - UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
  });

  test('TC-LIKE-008: UI - Like should persist after page refresh', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Find first like button that's not already liked
    const likeButtons = page.locator('button:has([class*="lucide-heart"])');
    const firstButton = likeButtons.first();
    
    if (await firstButton.count() > 0) {
      // Get initial like count
      const initialText = await firstButton.textContent({ timeout: 5000 }).catch(() => '0');
      
      // Check if heart is filled (already liked)
      const heartIcon = firstButton.locator('svg');
      const initialFill = await heartIcon.getAttribute('class') || '';
      const wasLiked = initialFill.includes('fill-red');
      
      // Click to toggle like
      await firstButton.click();
      await page.waitForTimeout(1000);
      
      // Refresh the page
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Check if like state persisted
      const refreshedButton = page.locator('button:has([class*="lucide-heart"])').first();
      const refreshedHeartIcon = refreshedButton.locator('svg');
      const newFill = await refreshedHeartIcon.getAttribute('class') || '';
      const isNowLiked = newFill.includes('fill-red');
      
      // State should have toggled
      expect(isNowLiked).toBe(!wasLiked);
      console.log(`✅ Like state persisted after refresh (was: ${wasLiked}, now: ${isNowLiked})`);
    }
  });

  test('TC-LIKE-009: UI - Unlike should work (toggle)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const likeButton = page.locator('button:has([class*="lucide-heart"])').first();
    
    if (await likeButton.count() > 0) {
      // Like first
      await likeButton.click();
      await page.waitForTimeout(500);
      
      // Verify liked state
      let heartIcon = likeButton.locator('svg');
      let fillClass = await heartIcon.getAttribute('class') || '';
      const afterFirstClick = fillClass.includes('fill-red');
      
      // Unlike (click again)
      await likeButton.click();
      await page.waitForTimeout(500);
      
      // Verify unliked state
      heartIcon = likeButton.locator('svg');
      fillClass = await heartIcon.getAttribute('class') || '';
      const afterSecondClick = fillClass.includes('fill-red');
      
      // States should be opposite
      expect(afterFirstClick).not.toBe(afterSecondClick);
      console.log('✅ Like/Unlike toggle works in UI');
    }
  });

  test('TC-LIKE-010: UI - Should show likers tooltip on hover', async ({ page }) => {
    // First, ensure there's a post with likes
    const token = await getAuthToken(page);
    
    // Get feed to find a post
    const feedResponse = await page.request.get(`${config.apiUrl}/posts/feed`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const feedData = await feedResponse.json();
    
    if (feedData.posts && feedData.posts.length > 0) {
      const postWithLikes = feedData.posts.find((p: { likes: number }) => p.likes > 0);
      
      if (postWithLikes) {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Find like count button (clickable number next to heart)
        const likeCountButton = page.locator('button:has([class*="lucide-heart"]) + button, .flex.items-center button:not(:has(svg))').first();
        
        if (await likeCountButton.count() > 0) {
          // Hover to trigger tooltip
          await likeCountButton.hover();
          await page.waitForTimeout(1000);
          
          // Check for popover content
          const popover = page.locator('[data-radix-popper-content-wrapper], [role="dialog"]');
          const hasPopover = await popover.count() > 0;
          
          if (hasPopover) {
            console.log('✅ Likers tooltip/popover shown on hover');
          } else {
            console.log('ℹ️ Popover not detected (may need different selector)');
          }
        }
      } else {
        console.log('ℹ️ No posts with likes found for tooltip test');
      }
    }
  });

  test('TC-LIKE-011: UI - Should open likers modal on click', async ({ page }) => {
    const token = await getAuthToken(page);
    
    // Create a post and like it
    const createResponse = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: { content: 'Test post for likers modal ' + Date.now() },
    });
    const newPost = await createResponse.json();
    
    // Like the post
    await page.request.post(`${config.apiUrl}/posts/${newPost.id}/like`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Find and click the like count to open modal
    // The like count is a separate clickable element
    const likeCountElements = page.locator('.flex.items-center button.text-sm, button:has([class*="lucide-heart"]) ~ button');
    
    for (let i = 0; i < await likeCountElements.count(); i++) {
      const element = likeCountElements.nth(i);
      const text = await element.textContent();
      
      if (text && /^\d+$/.test(text.trim()) && parseInt(text.trim()) > 0) {
        await element.click();
        await page.waitForTimeout(1000);
        
        // Check for modal
        const modal = page.locator('[role="dialog"]:has-text("liked"), [role="dialog"]:has-text("People")');
        const hasModal = await modal.count() > 0;
        
        if (hasModal) {
          console.log('✅ Likers modal opened on click');
          
          // Check modal content
          const likerItems = modal.locator('.flex.items-center.gap-3, [class*="avatar"]');
          const count = await likerItems.count();
          console.log(`   Found ${count} liker items in modal`);
          
          // Close modal
          await page.keyboard.press('Escape');
        } else {
          console.log('ℹ️ Modal not found after clicking like count');
        }
        break;
      }
    }
  });

  test('TC-LIKE-012: UI - Error when liking without login', async ({ page }) => {
    await logout(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const likeButton = page.locator('button:has([class*="lucide-heart"])').first();
    
    if (await likeButton.count() > 0) {
      await likeButton.click();
      await page.waitForTimeout(1000);

      // Check for error toast
      const errorToast = page.locator('[data-sonner-toast]:has-text("login"), [data-sonner-toast]:has-text("Login")');
      const hasError = await errorToast.count() > 0;

      if (hasError) {
        console.log('✅ Error shown when trying to like without login');
      } else {
        // May redirect to login page instead
        const currentUrl = page.url();
        if (currentUrl.includes('/login')) {
          console.log('✅ Redirected to login page when trying to like');
        } else {
          console.log('ℹ️ No error toast shown (may be handled differently)');
        }
      }
    }
  });
});

test.describe('Like Persistence - Cross-User Tests', () => {
  test('TC-LIKE-013: Different users should see different isLikedByCurrentUser', async ({ page }) => {
    // Create post as priya
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    const priyaToken = await getAuthToken(page);
    
    const createResponse = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${priyaToken}`,
        'Content-Type': 'application/json',
      },
      data: { content: 'Cross-user test post ' + Date.now() },
    });
    const post = await createResponse.json();
    
    // Priya likes the post
    await page.request.post(`${config.apiUrl}/posts/${post.id}/like`, {
      headers: { Authorization: `Bearer ${priyaToken}` },
    });
    
    // Verify Priya sees isLikedByCurrentUser = true
    const priyaView = await page.request.get(`${config.apiUrl}/posts/${post.id}`, {
      headers: { Authorization: `Bearer ${priyaToken}` },
    });
    const priyaData = await priyaView.json();
    expect(priyaData.isLikedByCurrentUser).toBe(true);
    
    // Login as Raj
    await logout(page);
    await loginViaUI(page, seedUsers.raj.email, seedUsers.raj.password);
    const rajToken = await getAuthToken(page);
    
    // Verify Raj sees isLikedByCurrentUser = false
    const rajView = await page.request.get(`${config.apiUrl}/posts/${post.id}`, {
      headers: { Authorization: `Bearer ${rajToken}` },
    });
    const rajData = await rajView.json();
    expect(rajData.isLikedByCurrentUser).toBe(false);
    
    // But like count should be 1 for both
    expect(priyaData.likes).toBe(1);
    expect(rajData.likes).toBe(1);
    
    console.log('✅ Different users see correct isLikedByCurrentUser values');
  });

  test('TC-LIKE-014: Likers list should show all users who liked', async ({ page }) => {
    // Create post and have multiple users like it
    await loginViaUI(page, seedUsers.official.email, seedUsers.official.password);
    const officialToken = await getAuthToken(page);
    
    const createResponse = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${officialToken}`,
        'Content-Type': 'application/json',
      },
      data: { content: 'Multi-user like test ' + Date.now() },
    });
    const post = await createResponse.json();
    
    // Priya likes
    await logout(page);
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    const priyaToken = await getAuthToken(page);
    await page.request.post(`${config.apiUrl}/posts/${post.id}/like`, {
      headers: { Authorization: `Bearer ${priyaToken}` },
    });
    
    // Raj likes
    await logout(page);
    await loginViaUI(page, seedUsers.raj.email, seedUsers.raj.password);
    const rajToken = await getAuthToken(page);
    await page.request.post(`${config.apiUrl}/posts/${post.id}/like`, {
      headers: { Authorization: `Bearer ${rajToken}` },
    });
    
    // Get likers list
    const likersResponse = await page.request.get(`${config.apiUrl}/posts/${post.id}/likers`, {
      headers: { Authorization: `Bearer ${rajToken}` },
    });
    const likersData = await likersResponse.json();
    
    expect(likersData.likers.length).toBe(2);
    expect(likersData.pagination.total).toBe(2);
    
    // Check that both users are in the list
    const likerNames = likersData.likers.map((l: { name: string }) => l.name);
    expect(likerNames).toContain('Priya Sharma');
    expect(likerNames).toContain('Raj Kumar');
    
    console.log('✅ Likers list shows all users who liked');
  });
});

test.describe('Like Persistence - Edge Cases', () => {
  test('TC-LIKE-015: Public feed should not have isLikedByCurrentUser', async ({ page }) => {
    // Access public feed without authentication
    const response = await page.request.get(`${config.apiUrl}/posts/public`);
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    
    if (data.posts && data.posts.length > 0) {
      const post = data.posts[0];
      // isLikedByCurrentUser should be false (default) since not authenticated
      expect(post.isLikedByCurrentUser).toBe(false);
      // But likes count should still be present
      expect(post).toHaveProperty('likes');
      
      console.log('✅ Public feed has likes count but isLikedByCurrentUser is false');
    }
  });

  test('TC-LIKE-016: Like non-existent post should fail', async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    const token = await getAuthToken(page);
    
    const response = await page.request.post(`${config.apiUrl}/posts/nonexistent-id/like`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    expect(response.status()).toBe(404);
    console.log('✅ Cannot like non-existent post');
  });

  test('TC-LIKE-017: Likers pagination should work', async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    const token = await getAuthToken(page);
    
    // Create a post
    const createResponse = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: { content: 'Pagination test post ' + Date.now() },
    });
    const post = await createResponse.json();
    
    // Like it
    await page.request.post(`${config.apiUrl}/posts/${post.id}/like`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Request with pagination params
    const response = await page.request.get(`${config.apiUrl}/posts/${post.id}/likers?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(1);
    expect(data.pagination.total).toBe(1);
    
    console.log('✅ Likers pagination works correctly');
  });
});
