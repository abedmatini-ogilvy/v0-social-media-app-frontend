# CivicConnect E2E Test Plan

## Overview

This document outlines the comprehensive End-to-End (E2E) test plan for the CivicConnect application, covering both frontend UI interactions and backend API integrations.

**Test Framework:** Playwright  
**Browser:** Chromium  
**Database:** Supabase PostgreSQL (Live)  
**Test Data:** Persistent (not cleaned after tests)

---

## Table of Contents

1. [Test Environment Setup](#test-environment-setup)
2. [Test Execution](#test-execution)
3. [Test Suites](#test-suites)
   - [Authentication Tests](#authentication-tests)
   - [Posts Tests](#posts-tests)
   - [User Profile Tests](#user-profile-tests)
   - [Schemes Tests](#schemes-tests)
   - [Jobs Tests](#jobs-tests)
   - [Events Tests](#events-tests)
   - [Messages Tests](#messages-tests)
   - [Notifications Tests](#notifications-tests)
   - [Search Tests](#search-tests)
4. [Test Case Matrix](#test-case-matrix)
5. [CI/CD Integration](#cicd-integration)
6. [Troubleshooting](#troubleshooting)

---

## Test Environment Setup

### Prerequisites

- Node.js 18+
- npm or pnpm
- Backend server running on `http://localhost:3001`
- Frontend server running on `http://localhost:3000`
- Supabase database connected

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Environment Variables

Create `.env.test` file in the project root:

```env
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:3001/api
TEST_USER_EMAIL=priya@example.com
TEST_USER_PASSWORD=password123
TEST_NEW_USER_PREFIX=test_user_
```

### Test Data

The tests use seeded data from `backend/prisma/seed.ts`:

| User | Email | Password | Role |
|------|-------|----------|------|
| Priya Sharma | priya@example.com | password123 | citizen |
| Raj Kumar | raj@example.com | password123 | citizen |

---

## Test Execution

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test Suite

```bash
# Authentication tests
npx playwright test e2e/tests/auth.spec.ts

# Posts tests
npx playwright test e2e/tests/posts.spec.ts

# User tests
npx playwright test e2e/tests/users.spec.ts

# Schemes, Jobs, Events tests
npx playwright test e2e/tests/schemes-jobs-events.spec.ts

# Messages and Notifications tests
npx playwright test e2e/tests/messages-notifications.spec.ts
```

### Run Tests with UI

```bash
npx playwright test --ui
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### View Test Report

```bash
npx playwright show-report
```

---

## Test Suites

### Authentication Tests

**File:** `e2e/tests/auth.spec.ts`

| Test ID | Test Name | Type | Description | Expected Result |
|---------|-----------|------|-------------|-----------------|
| TC-AUTH-001 | Display registration form | UI | Verify registration form displays all fields | Form visible with name, email, password fields |
| TC-AUTH-002 | Register new citizen | UI | Register a new citizen user | User created, redirected to home, token stored |
| TC-AUTH-003 | Duplicate email error | UI | Register with existing email | Error displayed, stays on signup page |
| TC-AUTH-004 | Email validation | UI | Register with invalid email format | Validation error, form not submitted |
| TC-AUTH-005 | Password length validation | UI | Register with short password (<6 chars) | Validation error, form not submitted |
| TC-AUTH-006 | Login link navigation | UI | Click login link from signup | Navigates to /login |
| TC-AUTH-007 | Display login form | UI | Verify login form displays all fields | Form visible with email, password fields |
| TC-AUTH-008 | Login with valid credentials | UI | Login with seed user credentials | User logged in, redirected to home |
| TC-AUTH-009 | Invalid email login | UI | Login with non-existent email | Error displayed, stays on login page |
| TC-AUTH-010 | Wrong password login | UI | Login with wrong password | Error displayed, stays on login page |
| TC-AUTH-011 | Empty fields submission | UI | Submit login form with empty fields | Form not submitted |
| TC-AUTH-012 | Signup link navigation | UI | Click signup link from login | Navigates to /signup |
| TC-AUTH-013 | Logout functionality | UI | Logout from authenticated session | User logged out, tokens cleared |
| TC-AUTH-014 | Clear tokens on logout | UI | Verify localStorage cleared on logout | All auth tokens removed |
| TC-AUTH-015 | API Login response | API | POST /auth/login | Returns token, refreshToken, user |
| TC-AUTH-016 | API Register response | API | POST /auth/register | Returns 201, token, user data |
| TC-AUTH-017 | API Login wrong credentials | API | POST /auth/login with wrong password | Returns 401 Unauthorized |
| TC-AUTH-018 | API Register duplicate | API | POST /auth/register with existing email | Returns 409 Conflict |
| TC-AUTH-019 | API Refresh token | API | POST /auth/refresh-token | Returns new tokens |
| TC-AUTH-020 | Session persistence | UI | Refresh page after login | Session maintained |
| TC-AUTH-021 | Protected route redirect | UI | Access /profile without auth | Redirects to login |

---

### Posts Tests

**File:** `e2e/tests/posts.spec.ts`

| Test ID | Test Name | Type | Description | Expected Result |
|---------|-----------|------|-------------|-----------------|
| TC-POST-001 | Display posts feed | UI | View feed after login | Feed container visible |
| TC-POST-002 | Display post creation form | UI | Verify post input visible | Textarea/input visible |
| TC-POST-003 | API Get feed | API | GET /posts/feed | Returns posts array with pagination |
| TC-POST-004 | Create post via UI | UI | Submit new post | Post appears in feed |
| TC-POST-005 | API Create post | API | POST /posts | Returns 201, post data |
| TC-POST-006 | API Empty post validation | API | POST /posts with empty content | Returns 400 Bad Request |
| TC-POST-007 | API Unauthorized post | API | POST /posts without token | Returns 401 Unauthorized |
| TC-POST-008 | API Post with special chars | API | POST /posts with special characters | Post created successfully |
| TC-POST-009 | API Post with emojis | API | POST /posts with emojis | Post created with emojis preserved |
| TC-POST-010 | API Get single post | API | GET /posts/:id | Returns post data |
| TC-POST-011 | API Get non-existent post | API | GET /posts/invalid-id | Returns 404 Not Found |
| TC-POST-012 | API Update post | API | PUT /posts/:id | Returns updated post |
| TC-POST-013 | API Update empty content | API | PUT /posts/:id with empty content | Returns 400 Bad Request |
| TC-POST-014 | API Delete post | API | DELETE /posts/:id | Post deleted, returns 404 on re-fetch |
| TC-POST-015 | API Like post | API | POST /posts/:id/like | Likes count incremented |
| TC-POST-016 | API Unlike post | API | DELETE /posts/:id/unlike | Likes count decremented |
| TC-POST-017 | Like post via UI | UI | Click like button | Like registered |
| TC-POST-018 | API Add comment | API | POST /posts/:id/comments | Returns 201, comment data |
| TC-POST-019 | API Get comments | API | GET /posts/:id/comments | Returns comments array |
| TC-POST-020 | API Empty comment validation | API | POST /posts/:id/comments empty | Returns 400 Bad Request |
| TC-POST-021 | API Comment with emojis | API | POST /posts/:id/comments with emojis | Comment created with emojis |

---

### User Profile Tests

**File:** `e2e/tests/users.spec.ts`

| Test ID | Test Name | Type | Description | Expected Result |
|---------|-----------|------|-------------|-----------------|
| TC-USER-001 | Display profile page | UI | Navigate to /profile | Profile page visible |
| TC-USER-002 | API Get profile | API | GET /users/profile | Returns user data |
| TC-USER-003 | API Profile without auth | API | GET /users/profile without token | Returns 401 |
| TC-USER-004 | API Update name | API | PUT /users/profile with new name | Name updated |
| TC-USER-005 | API Update avatar | API | PUT /users/profile with avatar URL | Avatar updated |
| TC-USER-006 | API Update empty name | API | PUT /users/profile with empty name | Returns 400 |
| TC-USER-007 | API Change password | API | PUT /users/change-password | Password changed |
| TC-USER-008 | API Wrong current password | API | PUT /users/change-password wrong current | Returns error |
| TC-USER-009 | API Short new password | API | PUT /users/change-password short new | Returns 400 |
| TC-USER-010 | API Get connections | API | GET /users/connections | Returns connections array |
| TC-USER-011 | API Get suggested | API | GET /users/suggested-connections | Returns suggestions array |
| TC-USER-012 | API Connect with user | API | POST /users/connect/:id | Connection created |
| TC-USER-013 | API Disconnect user | API | DELETE /users/disconnect/:id | Connection removed |
| TC-USER-014 | Navigate to profile | UI | Click profile link | Navigates to /profile |
| TC-USER-015 | Display user info | UI | View profile page | User name displayed |

---

### Schemes Tests

**File:** `e2e/tests/schemes-jobs-events.spec.ts`

| Test ID | Test Name | Type | Description | Expected Result |
|---------|-----------|------|-------------|-----------------|
| TC-SCHEME-001 | API List schemes | API | GET /schemes (public) | Returns schemes array |
| TC-SCHEME-002 | API Get scheme | API | GET /schemes/:id | Returns scheme details |
| TC-SCHEME-003 | Display schemes page | UI | Navigate to /schemes | Page visible |
| TC-SCHEME-004 | API Apply for scheme | API | POST /schemes/:id/apply | Application created (201) or exists (409) |
| TC-SCHEME-005 | API My applications | API | GET /schemes/my-applications | Returns applications array |
| TC-SCHEME-006 | API Apply without auth | API | POST /schemes/:id/apply without token | Returns 401 |

---

### Jobs Tests

**File:** `e2e/tests/schemes-jobs-events.spec.ts`

| Test ID | Test Name | Type | Description | Expected Result |
|---------|-----------|------|-------------|-----------------|
| TC-JOB-001 | API List jobs | API | GET /jobs (public) | Returns jobs array |
| TC-JOB-002 | API Get job | API | GET /jobs/:id | Returns job details |
| TC-JOB-003 | Display jobs page | UI | Navigate to /jobs | Page visible |
| TC-JOB-004 | API Apply for job | API | POST /jobs/:id/apply | Application created (201) or exists (409) |
| TC-JOB-005 | API My job applications | API | GET /jobs/my-applications | Returns applications array |
| TC-JOB-006 | API Apply without auth | API | POST /jobs/:id/apply without token | Returns 401 |

---

### Events Tests

**File:** `e2e/tests/schemes-jobs-events.spec.ts`

| Test ID | Test Name | Type | Description | Expected Result |
|---------|-----------|------|-------------|-----------------|
| TC-EVENT-001 | API List events | API | GET /events (public) | Returns events array |
| TC-EVENT-002 | API Get event | API | GET /events/:id | Returns event details |
| TC-EVENT-003 | Display events page | UI | Navigate to /events | Page visible |
| TC-EVENT-004 | API Attend event | API | POST /events/:id/attend | Attendance registered |
| TC-EVENT-005 | API My events | API | GET /events/my-events | Returns registered events |
| TC-EVENT-006 | API Attend without auth | API | POST /events/:id/attend without token | Returns 401 |

---

### Messages Tests

**File:** `e2e/tests/messages-notifications.spec.ts`

| Test ID | Test Name | Type | Description | Expected Result |
|---------|-----------|------|-------------|-----------------|
| TC-MSG-001 | API Get conversations | API | GET /messages/conversations | Returns conversations array |
| TC-MSG-002 | API Conversations without auth | API | GET /messages/conversations without token | Returns 401 |
| TC-MSG-003 | Display messages page | UI | Navigate to /messages | Page visible |
| TC-MSG-004 | API Send message | API | POST /messages | Message sent (201) |
| TC-MSG-005 | API Message with emojis | API | POST /messages with emojis | Message sent with emojis |
| TC-MSG-006 | API Empty message | API | POST /messages empty content | Returns 400 |
| TC-MSG-007 | API Message without receiver | API | POST /messages without receiverId | Returns 400 |
| TC-MSG-008 | API Get conversation messages | API | GET /messages/conversations/:id | Returns messages array |

---

### Notifications Tests

**File:** `e2e/tests/messages-notifications.spec.ts`

| Test ID | Test Name | Type | Description | Expected Result |
|---------|-----------|------|-------------|-----------------|
| TC-NOTIF-001 | API Get notifications | API | GET /notifications | Returns notifications array |
| TC-NOTIF-002 | API Notifications without auth | API | GET /notifications without token | Returns 401 |
| TC-NOTIF-003 | Display notifications page | UI | Navigate to /notifications | Page visible |
| TC-NOTIF-004 | API Mark as read | API | PUT /notifications/:id/read | Notification marked read |
| TC-NOTIF-005 | API Mark all read | API | PUT /notifications/read-all | All notifications marked read |

---

### Search Tests

**File:** `e2e/tests/messages-notifications.spec.ts`

| Test ID | Test Name | Type | Description | Expected Result |
|---------|-----------|------|-------------|-----------------|
| TC-SEARCH-001 | API Search with query | API | GET /search?q=test | Returns users and posts |
| TC-SEARCH-002 | API Empty search | API | GET /search?q= | Returns empty or 400 |
| TC-SEARCH-003 | API Search without auth | API | GET /search without token | Returns 401 |

---

### Emergency Alerts Tests

**File:** `e2e/tests/schemes-jobs-events.spec.ts`

| Test ID | Test Name | Type | Description | Expected Result |
|---------|-----------|------|-------------|-----------------|
| TC-ALERT-001 | API List alerts | API | GET /emergency-alerts (public) | Returns alerts array |
| TC-ALERT-002 | API Get alert | API | GET /emergency-alerts/:id | Returns alert details |

---

### Health Check Tests

**File:** `e2e/tests/messages-notifications.spec.ts`

| Test ID | Test Name | Type | Description | Expected Result |
|---------|-----------|------|-------------|-----------------|
| TC-HEALTH-001 | API Health check | API | GET /api/health | Returns { status: 'ok' } |

---

## Test Case Matrix

### Summary by Module

| Module | Total Tests | UI Tests | API Tests |
|--------|-------------|----------|-----------|
| Authentication | 21 | 14 | 7 |
| Posts | 21 | 4 | 17 |
| User Profile | 15 | 3 | 12 |
| Schemes | 6 | 1 | 5 |
| Jobs | 6 | 1 | 5 |
| Events | 6 | 1 | 5 |
| Messages | 8 | 1 | 7 |
| Notifications | 5 | 1 | 4 |
| Search | 3 | 0 | 3 |
| Emergency Alerts | 2 | 0 | 2 |
| Health | 1 | 0 | 1 |
| **Total** | **94** | **26** | **68** |

### Priority Matrix

| Priority | Test IDs | Description |
|----------|----------|-------------|
| P0 (Critical) | TC-AUTH-008, TC-AUTH-015, TC-POST-005, TC-HEALTH-001 | Core auth and post functionality |
| P1 (High) | TC-AUTH-002, TC-AUTH-013, TC-POST-015, TC-USER-002 | Key user flows |
| P2 (Medium) | All other tests | Supporting functionality |

---

## CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright
        run: npx playwright install chromium
        
      - name: Start backend
        run: |
          cd backend
          npm ci
          npm run dev &
          sleep 10
          
      - name: Start frontend
        run: |
          npm run dev &
          sleep 10
          
      - name: Run E2E tests
        run: npx playwright test
        env:
          FRONTEND_URL: http://localhost:3000
          API_URL: http://localhost:3001/api
          
      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**
   - Ensure backend is running on port 3001
   - Check CORS configuration

2. **Authentication failures**
   - Verify seed data exists in database
   - Check password matches seed data

3. **Timeout errors**
   - Increase timeout in `playwright.config.ts`
   - Check network connectivity

4. **Element not found**
   - UI may have changed, update selectors
   - Check if element requires scroll

### Debug Commands

```bash
# Run with headed browser
npx playwright test --headed

# Run single test
npx playwright test -g "TC-AUTH-008"

# Generate trace
npx playwright test --trace on
```

---

## Appendix

### File Structure

```
e2e/
├── fixtures/
│   └── test-data.ts       # Test data and constants
├── helpers/
│   └── test-utils.ts      # Helper functions
└── tests/
    ├── auth.spec.ts       # Authentication tests
    ├── posts.spec.ts      # Posts tests
    ├── users.spec.ts      # User profile tests
    ├── schemes-jobs-events.spec.ts
    └── messages-notifications.spec.ts
```

### Configuration Files

- `playwright.config.ts` - Playwright configuration
- `.env.test` - Test environment variables

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Author:** CivicConnect QA Team
