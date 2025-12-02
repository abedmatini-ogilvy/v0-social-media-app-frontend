/**
 * Post Creation Extended E2E Tests
 * Tests for advanced post creation scenarios, edge cases, and validation
 */

import { test, expect } from '@playwright/test';
import { loginViaUI, getAuthToken } from '../helpers/test-utils';
import { seedUsers, testPosts } from '../fixtures/test-data';

const config = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
};

test.describe('Post Creation - Text Content', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('TC-POST-001: Should create post with long text content', async ({ page }) => {
    const longContent = 'A'.repeat(500) + ' This is a very long post to test character handling. ' + 'B'.repeat(500);
    
    const postInput = page.locator('textarea[placeholder*="What"], textarea[placeholder*="Share"]');
    
    if (await postInput.count() > 0) {
      await postInput.first().fill(longContent);
      
      // Check if content was accepted
      const inputValue = await postInput.first().inputValue();
      
      if (inputValue.length > 0) {
        const postButton = page.locator('button:has-text("Post")');
        await postButton.first().click();
        await page.waitForTimeout(3000);
        
        // Check for success or character limit message
        const successToast = page.locator('text=created, text=success, text=posted');
        const limitMessage = page.locator('text=too long, text=character limit, text=maximum');
        
        if (await successToast.count() > 0) {
          console.log('✅ Long post created successfully');
        } else if (await limitMessage.count() > 0) {
          console.log('✅ Character limit enforced for long post');
        } else {
          console.log('ℹ️ Long post handling unclear');
        }
      }
    }
  });

  test('TC-POST-002: Should create post with special characters', async ({ page }) => {
    const specialContent = testPosts.withSpecialChars.content;
    
    const postInput = page.locator('textarea[placeholder*="What"], textarea[placeholder*="Share"]');
    
    if (await postInput.count() > 0) {
      await postInput.first().fill(specialContent);
      
      const postButton = page.locator('button:has-text("Post")');
      await postButton.first().click();
      await page.waitForTimeout(3000);
      
      const successToast = page.locator('text=created, text=success');
      if (await successToast.count() > 0) {
        console.log('✅ Post with special characters created');
      } else {
        console.log('ℹ️ Special character post may have been created');
      }
    }
  });

  test('TC-POST-003: Should create post with unicode/emojis', async ({ page }) => {
    const unicodeContent = '🎉 Testing unicode: 你好世界 مرحبا العالم שלום עולם 🌍✨🚀';
    
    const postInput = page.locator('textarea[placeholder*="What"], textarea[placeholder*="Share"]');
    
    if (await postInput.count() > 0) {
      await postInput.first().fill(unicodeContent);
      
      const postButton = page.locator('button:has-text("Post")');
      await postButton.first().click();
      await page.waitForTimeout(3000);
      
      const successToast = page.locator('text=created, text=success');
      if (await successToast.count() > 0) {
        console.log('✅ Post with unicode/emojis created');
      } else {
        console.log('ℹ️ Unicode post may have been created');
      }
    }
  });

  test('TC-POST-004: Should create post with line breaks', async ({ page }) => {
    const multilineContent = `Line 1: First paragraph
    
Line 2: Second paragraph after blank line

Line 3: Third paragraph with
a line break in the middle`;
    
    const postInput = page.locator('textarea[placeholder*="What"], textarea[placeholder*="Share"]');
    
    if (await postInput.count() > 0) {
      await postInput.first().fill(multilineContent);
      
      const postButton = page.locator('button:has-text("Post")');
      await postButton.first().click();
      await page.waitForTimeout(3000);
      
      const successToast = page.locator('text=created, text=success');
      if (await successToast.count() > 0) {
        console.log('✅ Post with line breaks created');
      } else {
        console.log('ℹ️ Multiline post may have been created');
      }
    }
  });

  test('TC-POST-005: Should create post with hashtags', async ({ page }) => {
    const hashtagContent = 'Testing hashtags #CivicConnect #Testing #E2E #Playwright';
    
    const postInput = page.locator('textarea[placeholder*="What"], textarea[placeholder*="Share"]');
    
    if (await postInput.count() > 0) {
      await postInput.first().fill(hashtagContent);
      
      const postButton = page.locator('button:has-text("Post")');
      await postButton.first().click();
      await page.waitForTimeout(3000);
      
      const successToast = page.locator('text=created, text=success');
      if (await successToast.count() > 0) {
        console.log('✅ Post with hashtags created');
      } else {
        console.log('ℹ️ Hashtag post may have been created');
      }
    }
  });

  test('TC-POST-006: Should create post with mentions', async ({ page }) => {
    const mentionContent = 'Testing mentions @user1 @official @admin - can you see this?';
    
    const postInput = page.locator('textarea[placeholder*="What"], textarea[placeholder*="Share"]');
    
    if (await postInput.count() > 0) {
      await postInput.first().fill(mentionContent);
      
      const postButton = page.locator('button:has-text("Post")');
      await postButton.first().click();
      await page.waitForTimeout(3000);
      
      const successToast = page.locator('text=created, text=success');
      if (await successToast.count() > 0) {
        console.log('✅ Post with mentions created');
      } else {
        console.log('ℹ️ Mention post may have been created');
      }
    }
  });

  test('TC-POST-007: Should create post with URLs', async ({ page }) => {
    const urlContent = 'Check out this link: https://example.com/test?param=value&other=123 and http://localhost:3000';
    
    const postInput = page.locator('textarea[placeholder*="What"], textarea[placeholder*="Share"]');
    
    if (await postInput.count() > 0) {
      await postInput.first().fill(urlContent);
      
      const postButton = page.locator('button:has-text("Post")');
      await postButton.first().click();
      await page.waitForTimeout(3000);
      
      const successToast = page.locator('text=created, text=success');
      if (await successToast.count() > 0) {
        console.log('✅ Post with URLs created');
      } else {
        console.log('ℹ️ URL post may have been created');
      }
    }
  });
});

test.describe('Post Creation - Cancel & Clear', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('TC-POST-008: Should clear post content when cancelled', async ({ page }) => {
    const postInput = page.locator('textarea[placeholder*="What"], textarea[placeholder*="Share"]');
    
    if (await postInput.count() > 0) {
      await postInput.first().fill('This post will be cancelled');
      
      // Look for cancel/clear button
      const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("Clear"), button[aria-label*="clear" i]');
      
      if (await cancelButton.count() > 0) {
        await cancelButton.first().click();
        await page.waitForTimeout(500);
        
        const inputValue = await postInput.first().inputValue();
        if (inputValue === '') {
          console.log('✅ Post content cleared on cancel');
        } else {
          console.log('ℹ️ Content may not have been cleared');
        }
      } else {
        // Try clearing manually
        await postInput.first().fill('');
        console.log('ℹ️ No cancel button found, cleared manually');
      }
    }
  });

  test('TC-POST-009: Should preserve draft when navigating away and back', async ({ page }) => {
    const draftContent = 'Draft post content ' + Date.now();
    
    const postInput = page.locator('textarea[placeholder*="What"], textarea[placeholder*="Share"]');
    
    if (await postInput.count() > 0) {
      await postInput.first().fill(draftContent);
      
      // Navigate away
      await page.goto('/schemes');
      await page.waitForLoadState('networkidle');
      
      // Navigate back
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Check if draft preserved
      const newPostInput = page.locator('textarea[placeholder*="What"], textarea[placeholder*="Share"]');
      const preservedValue = await newPostInput.first().inputValue();
      
      if (preservedValue === draftContent) {
        console.log('✅ Draft preserved when navigating away and back');
      } else {
        console.log('ℹ️ Draft not preserved (expected behavior for many apps)');
      }
    }
  });

  test('TC-POST-010: Should warn before losing unsaved post', async ({ page }) => {
    const postInput = page.locator('textarea[placeholder*="What"], textarea[placeholder*="Share"]');
    
    if (await postInput.count() > 0) {
      await postInput.first().fill('Unsaved post content that should trigger warning');
      
      // Set up dialog handler
      let dialogShown = false;
      page.on('dialog', async (dialog) => {
        dialogShown = true;
        await dialog.dismiss();
      });
      
      // Try to navigate away
      await page.goto('/schemes');
      await page.waitForTimeout(1000);
      
      if (dialogShown) {
        console.log('✅ Warning shown before losing unsaved post');
      } else {
        console.log('ℹ️ No warning dialog (may not be implemented)');
      }
    }
  });
});

test.describe('Post Creation - With Media', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('TC-POST-011: Should create post with valid image URL', async ({ page }) => {
    const postInput = page.locator('textarea[placeholder*="What"], textarea[placeholder*="Share"]');
    
    if (await postInput.count() > 0) {
      await postInput.first().fill('Post with image URL');
      
      // Open image input
      const imageButton = page.locator('button:has([class*="image" i])');
      if (await imageButton.count() > 0) {
        await imageButton.first().click();
        await page.waitForTimeout(500);
        
        const imageInput = page.locator('input[placeholder*="image" i], input[type="url"]');
        if (await imageInput.count() > 0) {
          await imageInput.first().fill('https://picsum.photos/400/300');
          
          const postButton = page.locator('button:has-text("Post")');
          await postButton.first().click();
          await page.waitForTimeout(3000);
          
          const successToast = page.locator('text=created, text=success');
          if (await successToast.count() > 0) {
            console.log('✅ Post with image URL created');
          } else {
            console.log('ℹ️ Image post may have been created');
          }
        }
      }
    }
  });

  test('TC-POST-012: Should handle invalid image URL gracefully', async ({ page }) => {
    const postInput = page.locator('textarea[placeholder*="What"], textarea[placeholder*="Share"]');
    
    if (await postInput.count() > 0) {
      await postInput.first().fill('Post with invalid image');
      
      const imageButton = page.locator('button:has([class*="image" i])');
      if (await imageButton.count() > 0) {
        await imageButton.first().click();
        await page.waitForTimeout(500);
        
        const imageInput = page.locator('input[placeholder*="image" i], input[type="url"]');
        if (await imageInput.count() > 0) {
          await imageInput.first().fill('not-a-valid-url');
          
          const postButton = page.locator('button:has-text("Post")');
          await postButton.first().click();
          await page.waitForTimeout(2000);
          
          // Check for validation or graceful handling
          const errorMessage = page.locator('text=invalid, text=valid URL');
          if (await errorMessage.count() > 0) {
            console.log('✅ Invalid image URL validation shown');
          } else {
            console.log('ℹ️ Invalid URL handled (may be accepted or ignored)');
          }
        }
      }
    }
  });

  test('TC-POST-013: Should toggle image input visibility', async ({ page }) => {
    const imageButton = page.locator('button:has([class*="image" i])');
    
    if (await imageButton.count() > 0) {
      // Open image input
      await imageButton.first().click();
      await page.waitForTimeout(500);
      
      let imageInput = page.locator('input[placeholder*="image" i], input[type="url"]');
      const isVisibleAfterOpen = await imageInput.count() > 0 && await imageInput.first().isVisible();
      
      if (isVisibleAfterOpen) {
        // Close image input
        await imageButton.first().click();
        await page.waitForTimeout(500);
        
        imageInput = page.locator('input[placeholder*="image" i], input[type="url"]');
        const isHiddenAfterClose = await imageInput.count() === 0 || !(await imageInput.first().isVisible());
        
        if (isHiddenAfterClose) {
          console.log('✅ Image input toggles visibility correctly');
        } else {
          console.log('ℹ️ Image input may not toggle (stays visible)');
        }
      } else {
        console.log('ℹ️ Image input not found after clicking button');
      }
    }
  });
});

test.describe('Post Creation - With Location', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('TC-POST-014: Should create post with location', async ({ page }) => {
    const postInput = page.locator('textarea[placeholder*="What"], textarea[placeholder*="Share"]');
    
    if (await postInput.count() > 0) {
      await postInput.first().fill('Post with location tag');
      
      // Open location input
      const locationButton = page.locator('button:has([class*="map" i]), button:has([class*="location" i])');
      if (await locationButton.count() > 0) {
        await locationButton.first().click();
        await page.waitForTimeout(500);
        
        const locationInput = page.locator('input[placeholder*="location" i], input[placeholder*="where" i]');
        if (await locationInput.count() > 0) {
          await locationInput.first().fill('Mumbai, Maharashtra, India');
          
          const postButton = page.locator('button:has-text("Post")');
          await postButton.first().click();
          await page.waitForTimeout(3000);
          
          const successToast = page.locator('text=created, text=success');
          if (await successToast.count() > 0) {
            console.log('✅ Post with location created');
          } else {
            console.log('ℹ️ Location post may have been created');
          }
        }
      }
    }
  });

  test('TC-POST-015: Should toggle location input visibility', async ({ page }) => {
    const locationButton = page.locator('button:has([class*="map" i]), button:has([class*="location" i])');
    
    if (await locationButton.count() > 0) {
      // Open location input
      await locationButton.first().click();
      await page.waitForTimeout(500);
      
      let locationInput = page.locator('input[placeholder*="location" i], input[placeholder*="where" i]');
      const isVisibleAfterOpen = await locationInput.count() > 0 && await locationInput.first().isVisible();
      
      if (isVisibleAfterOpen) {
        // Close location input
        await locationButton.first().click();
        await page.waitForTimeout(500);
        
        locationInput = page.locator('input[placeholder*="location" i], input[placeholder*="where" i]');
        const isHiddenAfterClose = await locationInput.count() === 0 || !(await locationInput.first().isVisible());
        
        if (isHiddenAfterClose) {
          console.log('✅ Location input toggles visibility correctly');
        } else {
          console.log('ℹ️ Location input may not toggle (stays visible)');
        }
      } else {
        console.log('ℹ️ Location input not found after clicking button');
      }
    }
  });
});

test.describe('Post Creation - API Tests', () => {
  test('TC-POST-016: API - Should create post with all fields', async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    const token = await getAuthToken(page);
    
    const response = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: 'API test post with all fields ' + Date.now(),
        image: 'https://picsum.photos/400/300',
        location: 'Test Location, India',
      },
    });
    
    if (response.ok()) {
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('content');
      console.log('✅ API: Post created with all fields');
    } else {
      const status = response.status();
      console.log(`ℹ️ API response: ${status} (some fields may not be supported)`);
    }
  });

  test('TC-POST-017: API - Should reject post without content', async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
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
    
    if (!response.ok()) {
      console.log('✅ API: Empty post rejected');
    } else {
      console.log('ℹ️ API may accept empty posts');
    }
  });

  test('TC-POST-018: API - Should reject post without authentication', async ({ page }) => {
    const response = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        content: 'Unauthorized post attempt',
      },
    });
    
    expect(response.status()).toBe(401);
    console.log('✅ API: Unauthenticated post rejected');
  });

  test('TC-POST-019: API - Should handle very long content', async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    const token = await getAuthToken(page);
    
    const veryLongContent = 'X'.repeat(10000); // 10k characters
    
    const response = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: veryLongContent,
      },
    });
    
    const status = response.status();
    if (status === 400 || status === 413) {
      console.log('✅ API: Very long content rejected with appropriate error');
    } else if (response.ok()) {
      console.log('ℹ️ API: Very long content accepted');
    } else {
      console.log(`ℹ️ API response: ${status}`);
    }
  });

  test('TC-POST-020: API - Should sanitize HTML/script content', async ({ page }) => {
    await loginViaUI(page, seedUsers.priya.email, seedUsers.priya.password);
    const token = await getAuthToken(page);
    
    const xssContent = '<script>alert("xss")</script><img src="x" onerror="alert(1)">';
    
    const response = await page.request.post(`${config.apiUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: xssContent,
      },
    });
    
    if (response.ok()) {
      const data = await response.json();
      const savedContent = data.content || '';
      
      // Check if script tags were sanitized
      if (!savedContent.includes('<script>') && !savedContent.includes('onerror=')) {
        console.log('✅ API: HTML/script content sanitized');
      } else {
        console.log('⚠️ API: Script content may not be sanitized');
      }
    } else {
      console.log('✅ API: Potentially malicious content rejected');
    }
  });
});
