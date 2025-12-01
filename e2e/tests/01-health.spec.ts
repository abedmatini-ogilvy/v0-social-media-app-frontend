/**
 * Group 1: Health Check & Basic Connectivity
 * Run first to verify backend is accessible
 */

import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://127.0.0.1:3001/api';

test.describe('Group 1: Health Check', () => {
  test('TC-HEALTH-001: API health endpoint should be accessible', async ({ request }) => {
    const response = await request.get(`${API_URL}/health`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('ok');

    console.log('✅ API health check passed');
  });

  test('TC-HEALTH-002: Frontend should be accessible', async ({ page }) => {
    const response = await page.goto('/');
    
    expect(response?.ok()).toBeTruthy();
    console.log('✅ Frontend is accessible');
  });
});
