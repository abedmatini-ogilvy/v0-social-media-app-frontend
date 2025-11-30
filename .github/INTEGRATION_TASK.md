# Complete Frontend-Backend Integration & Testing

## 🎯 Objective
Audit the entire codebase, identify all disconnected components, integrate the frontend with the existing backend API, and verify everything works end-to-end.

---

## 📋 Phase 1: Audit & Assessment

### 1.1 Backend Health Check
- [ ] Verify backend server runs on `http://localhost:3001`
- [ ] Test `/api/health` endpoint returns 200 OK
- [ ] Confirm database connection is working
- [ ] Check all routes are registered correctly
- [ ] Review CORS configuration for `http://localhost:3000`

### 1.2 Frontend Audit
- [ ] List all pages in `/app/**/page.tsx`
- [ ] Identify all components using hardcoded/mock data
- [ ] Check which forms have no submit handlers
- [ ] Verify `lib/api-service.ts` and `lib/auth-service.ts` usage
- [ ] Document all missing API integrations

### 1.3 Type Validation
- [ ] Compare TypeScript interfaces in frontend with Prisma schema
- [ ] Identify any field name mismatches (camelCase vs snake_case)
- [ ] Check for missing or extra fields in interfaces
- [ ] Verify enum types match between frontend and backend

### 1.4 Environment Check
- [ ] Check if `.env.local` exists in frontend root
- [ ] Verify `NEXT_PUBLIC_API_URL` is set correctly
- [ ] Check if backend `.env` exists with proper configuration
- [ ] Confirm database connection string is valid

---

## 🔧 Phase 2: Foundation Setup

### 2.1 Environment Configuration
- [ ] Create `.env.local` in frontend root:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:3001/api
  ```
- [ ] Create backend `.env` from `.env.example` if needed
- [ ] Verify environment variables are loaded correctly
- [ ] Test API base URL resolution

### 2.2 Authentication Context
- [ ] Create `contexts/AuthContext.tsx` with:
  - User state management
  - Login/logout functions
  - Token storage and retrieval
  - Token refresh logic
  - Protected route logic
- [ ] Create `components/auth/ProtectedRoute.tsx` wrapper
- [ ] Add authentication provider to `app/layout.tsx`

### 2.3 API Client Enhancement
- [ ] Update `lib/api-service.ts` to use environment variable
- [ ] Add automatic token refresh on 401 errors
- [ ] Implement request/response interceptors
- [ ] Add better error handling and typing

### 2.4 Toast Notification System
- [ ] Set up toast provider (using sonner or similar)
- [ ] Create utility functions for success/error/info toasts
- [ ] Add toast notifications throughout the app

---

## 🔐 Phase 3: Authentication Integration

### 3.1 Login Page (`/app/login/page.tsx`)
- [ ] Import and use `loginUser` from `lib/auth-service.ts`
- [ ] Add form state management (react-hook-form)
- [ ] Implement form submission handler
- [ ] Add client-side validation
- [ ] Handle API errors (invalid credentials, network errors)
- [ ] Show loading state during submission
- [ ] Redirect to home page on success
- [ ] Add toast notifications for success/error
- [ ] Test both citizen and official login flows

### 3.2 Signup Page (`/app/signup/page.tsx`)
- [ ] Import and use `registerUser` from `lib/auth-service.ts`
- [ ] Add form state management
- [ ] Implement form submission handler
- [ ] Add validation (name, email, password strength)
- [ ] Handle API errors (email exists, validation errors)
- [ ] Show loading state during submission
- [ ] Redirect to home page on success
- [ ] Add toast notifications
- [ ] Test both citizen and official registration

### 3.3 Logout Functionality
- [ ] Add logout handler to navigation components
- [ ] Call `logoutUser` from auth service
- [ ] Clear auth context state
- [ ] Redirect to login page
- [ ] Show confirmation toast

### 3.4 Protected Routes
- [ ] Wrap protected pages with auth check
- [ ] Redirect unauthenticated users to `/login`
- [ ] Preserve intended destination for redirect after login
- [ ] Test protection on all authenticated pages

### 3.5 Token Management
- [ ] Implement token refresh on 401 responses
- [ ] Handle refresh token expiry
- [ ] Test token expiry scenarios
- [ ] Verify token is included in all authenticated requests

---

## 📱 Phase 4: Social Feed Integration

### 4.1 Feed Display (`components/social-feed.tsx`)
- [ ] Remove hardcoded `posts` array
- [ ] Create `hooks/usePosts.ts` for data fetching
- [ ] Fetch posts from `/api/posts/feed` using authenticated request
- [ ] Display loading skeleton while fetching
- [ ] Handle empty state (no posts)
- [ ] Handle error state with retry option
- [ ] Implement infinite scroll or pagination
- [ ] Test feed loads correctly for authenticated users

### 4.2 Create Post
- [ ] Connect post creation form to `/api/posts` endpoint
- [ ] Add form validation
- [ ] Show loading state on submit button
- [ ] Handle success: clear form, refresh feed, show toast
- [ ] Handle errors: show error message
- [ ] Support optional image upload (if implemented)
- [ ] Test post creation flow

### 4.3 Like/Unlike Posts
- [ ] Connect like button to `/api/posts/:postId/like` endpoint
- [ ] Connect unlike to `/api/posts/:postId/unlike` endpoint
- [ ] Implement optimistic updates (instant UI feedback)
- [ ] Update like count locally
- [ ] Handle errors: revert optimistic update
- [ ] Test like/unlike functionality

### 4.4 Comments
- [ ] Fetch comments for each post from `/api/posts/:postId/comments`
- [ ] Display comments in expandable section
- [ ] Connect add comment form to `/api/posts/:postId/comments`
- [ ] Update comment count after successful submission
- [ ] Show loading state while submitting
- [ ] Handle errors gracefully
- [ ] Test comment functionality

### 4.5 Follow/Unfollow Users
- [ ] Connect follow button to `/api/users/connect/:userId`
- [ ] Connect unfollow to `/api/users/disconnect/:userId`
- [ ] Update following state in UI
- [ ] Handle errors
- [ ] Test follow/unfollow flow

---

## 👤 Phase 5: User Profile Integration

### 5.1 Profile Display (`/app/profile/page.tsx`)
- [ ] Fetch current user profile from `/api/users/profile`
- [ ] Display user information (name, email, avatar, role)
- [ ] Show loading skeleton while fetching
- [ ] Handle errors (show error message with retry)
- [ ] Display user's posts
- [ ] Display connections count
- [ ] Test profile page loads correctly

### 5.2 Profile Update
- [ ] Add edit profile form/modal
- [ ] Connect to `/api/users/profile` (PUT)
- [ ] Add validation for name and avatar fields
- [ ] Show loading state during submission
- [ ] Update profile data in UI on success
- [ ] Handle errors
- [ ] Test profile update flow

### 5.3 Change Password
- [ ] Add change password form
- [ ] Connect to `/api/users/change-password`
- [ ] Validate current password and new password
- [ ] Show loading state during submission
- [ ] Show success message
- [ ] Handle errors (wrong current password, etc.)
- [ ] Test password change flow

### 5.4 Connections
- [ ] Fetch user connections from `/api/users/connections`
- [ ] Display connections list
- [ ] Add disconnect functionality
- [ ] Fetch suggested connections from `/api/users/suggested-connections`
- [ ] Test connections functionality

---

## 🏛️ Phase 6: Schemes Integration

### 6.1 Schemes List (`/app/schemes/page.tsx`)
- [ ] Remove hardcoded schemes data
- [ ] Fetch schemes from `/api/schemes`
- [ ] Display loading skeleton while fetching
- [ ] Show all schemes with proper formatting
- [ ] Handle empty state
- [ ] Handle error state
- [ ] Add search/filter functionality if UI exists
- [ ] Test schemes list loads correctly

### 6.2 Scheme Details (`/app/schemes/[id]/page.tsx`)
- [ ] Fetch specific scheme from `/api/schemes/:schemeId`
- [ ] Display full scheme details
- [ ] Show loading state
- [ ] Handle not found error (404)
- [ ] Test scheme details page

### 6.3 Apply for Scheme
- [ ] Connect apply button to `/api/schemes/:schemeId/apply`
- [ ] Show loading state on button during submission
- [ ] Handle success: update UI, show success toast
- [ ] Handle errors: already applied, not eligible, etc.
- [ ] Disable apply button if already applied
- [ ] Test application flow

### 6.4 My Applications
- [ ] Fetch user's applications from `/api/schemes/my-applications`
- [ ] Display applications with status
- [ ] Show loading state
- [ ] Handle empty state
- [ ] Test my applications view

---

## 💼 Phase 7: Jobs Integration

### 7.1 Jobs List (`/app/jobs/page.tsx`)
- [ ] Remove hardcoded jobs data
- [ ] Fetch jobs from `/api/jobs`
- [ ] Display loading skeleton while fetching
- [ ] Show all jobs with proper formatting
- [ ] Handle empty state
- [ ] Handle error state
- [ ] Add search/filter functionality if UI exists
- [ ] Test jobs list loads correctly

### 7.2 Job Details
- [ ] Fetch specific job from `/api/jobs/:jobId` (if detail page exists)
- [ ] Display full job details
- [ ] Show loading state
- [ ] Handle not found error
- [ ] Test job details page

### 7.3 Apply for Job
- [ ] Connect apply button to `/api/jobs/:jobId/apply`
- [ ] Show loading state on button during submission
- [ ] Handle success: update UI, show success toast
- [ ] Handle errors: already applied, etc.
- [ ] Disable apply button if already applied
- [ ] Test application flow

### 7.4 My Job Applications
- [ ] Fetch user's applications from `/api/jobs/my-applications`
- [ ] Display applications with status
- [ ] Show loading state
- [ ] Handle empty state
- [ ] Test my applications view

---

## 🔔 Phase 8: Notifications Integration

### 8.1 Notifications List (`/app/notifications/page.tsx`)
- [ ] Remove hardcoded notifications data
- [ ] Fetch notifications from `/api/notifications`
- [ ] Display loading skeleton while fetching
- [ ] Show all notifications grouped by read/unread
- [ ] Handle empty state
- [ ] Handle error state
- [ ] Test notifications list loads correctly

### 8.2 Mark as Read
- [ ] Connect mark as read action to `/api/notifications/:notificationId/read`
- [ ] Update notification state in UI
- [ ] Handle errors
- [ ] Test mark as read functionality

### 8.3 Mark All as Read
- [ ] Connect mark all as read button to `/api/notifications/read-all`
- [ ] Update all notifications state in UI
- [ ] Show loading state during action
- [ ] Handle errors
- [ ] Test mark all as read

### 8.4 Notification Badge
- [ ] Display unread count in navigation
- [ ] Update count when notifications are read
- [ ] Test badge updates correctly

---

## 💬 Phase 9: Messages Integration

### 9.1 Conversations List (`/app/messages/page.tsx`)
- [ ] Remove hardcoded conversations data
- [ ] Fetch conversations from `/api/messages/conversations`
- [ ] Display loading skeleton while fetching
- [ ] Show all conversations with last message preview
- [ ] Handle empty state (no conversations)
- [ ] Handle error state
- [ ] Test conversations list loads correctly

### 9.2 Conversation View
- [ ] Fetch specific conversation messages from `/api/messages/conversations/:conversationId`
- [ ] Display all messages in conversation
- [ ] Show loading state
- [ ] Handle empty state (no messages yet)
- [ ] Auto-scroll to latest message
- [ ] Test conversation view

### 9.3 Send Message
- [ ] Connect send message form to `/api/messages`
- [ ] Add form validation
- [ ] Show loading state on send button
- [ ] Add message to conversation UI on success
- [ ] Clear input after sending
- [ ] Handle errors
- [ ] Test message sending

---

## 🔍 Phase 10: Search Integration

### 10.1 Search Functionality (`/app/search/page.tsx`)
- [ ] Connect search form to `/api/search` endpoint
- [ ] Add query parameter handling
- [ ] Display loading state during search
- [ ] Show search results (users, posts, schemes, jobs)
- [ ] Handle empty results state
- [ ] Handle error state
- [ ] Add result type filtering if UI exists
- [ ] Test search functionality

---

## 🚨 Phase 11: Emergency Alerts

### 11.1 Emergency Alerts Display
- [ ] Fetch active alerts from `/api/emergency-alerts`
- [ ] Display alerts in `components/emergency-alert.tsx`
- [ ] Show loading state
- [ ] Handle no active alerts state
- [ ] Auto-refresh alerts periodically
- [ ] Test alerts display correctly

---

## 🎨 Phase 12: UX Enhancements

### 12.1 Loading States
- [ ] Add loading skeletons for all data fetching
- [ ] Add loading spinners for button submissions
- [ ] Add progress indicators for long operations
- [ ] Ensure consistent loading UI across app

### 12.2 Error Handling
- [ ] Add error boundaries for component errors
- [ ] Display user-friendly error messages
- [ ] Add retry buttons for failed requests
- [ ] Log errors for debugging
- [ ] Test error scenarios

### 12.3 Success Feedback
- [ ] Add success toasts for all mutations
- [ ] Add success messages for form submissions
- [ ] Add confirmation messages for destructive actions
- [ ] Ensure consistent success feedback

### 12.4 Form Validation
- [ ] Add client-side validation for all forms
- [ ] Display field-level errors
- [ ] Match backend validation rules
- [ ] Show validation errors from API
- [ ] Test all form validations

### 12.5 Optimistic Updates
- [ ] Implement optimistic updates for like/unlike
- [ ] Implement optimistic updates for follow/unfollow
- [ ] Add optimistic updates for post creation
- [ ] Handle rollback on errors

---

## 🧪 Phase 13: End-to-End Testing

### 13.1 Authentication Flow
- [ ] Register new citizen account → verify success
- [ ] Login with new account → verify redirect to home
- [ ] Logout → verify redirect to login
- [ ] Try accessing protected route while logged out → verify redirect to login
- [ ] Login again → verify redirect to intended page
- [ ] Test token expiry → verify refresh works
- [ ] Test invalid credentials → verify error message

### 13.2 Social Feed Flow
- [ ] View feed as authenticated user → verify posts load
- [ ] Create new post → verify it appears in feed
- [ ] Like a post → verify count increases
- [ ] Unlike a post → verify count decreases
- [ ] Add comment to post → verify comment appears
- [ ] Follow a user → verify button state changes
- [ ] Unfollow a user → verify button state changes
- [ ] Test pagination/infinite scroll

### 13.3 Schemes Flow
- [ ] View schemes list → verify schemes load
- [ ] Click on scheme → verify details page loads
- [ ] Apply for scheme → verify success message
- [ ] Try applying again → verify "already applied" message
- [ ] View my applications → verify application appears with status

### 13.4 Jobs Flow
- [ ] View jobs list → verify jobs load
- [ ] Apply for job → verify success message
- [ ] Try applying again → verify "already applied" message
- [ ] View my applications → verify application appears with status

### 13.5 Profile Flow
- [ ] View profile → verify user data loads
- [ ] Edit profile → verify changes save
- [ ] Change password → verify success message
- [ ] View connections → verify connections load
- [ ] View suggested connections → verify suggestions load
- [ ] Connect with suggested user → verify success

### 13.6 Notifications Flow
- [ ] View notifications → verify notifications load
- [ ] Mark notification as read → verify UI updates
- [ ] Mark all as read → verify all marked as read
- [ ] Verify unread count badge updates

### 13.7 Messages Flow
- [ ] View conversations → verify conversations load
- [ ] Open conversation → verify messages load
- [ ] Send message → verify message appears
- [ ] Test with empty conversation

### 13.8 Search Flow
- [ ] Search for users → verify results
- [ ] Search for posts → verify results
- [ ] Search for schemes → verify results
- [ ] Search for jobs → verify results
- [ ] Test empty search query
- [ ] Test no results scenario

### 13.9 Emergency Alerts
- [ ] Verify active alerts display on pages
- [ ] Test alert dismissal (if implemented)
- [ ] Verify no alerts state works

---

## 📊 Phase 14: Final Validation

### 14.1 TypeScript Compilation
- [ ] Run `npm run build` → verify no TypeScript errors
- [ ] Fix any type errors
- [ ] Ensure all imports are correct

### 14.2 Console Cleanup
- [ ] Remove all `console.log` statements
- [ ] Fix any console warnings
- [ ] Add proper error logging where needed

### 14.3 Code Quality
- [ ] Run `npm run lint` → verify no linting errors
- [ ] Fix any linting issues
- [ ] Ensure code follows project conventions

### 14.4 Performance Check
- [ ] Check for unnecessary re-renders
- [ ] Verify API calls are not duplicated
- [ ] Check bundle size
- [ ] Optimize where necessary

### 14.5 Accessibility
- [ ] Test keyboard navigation
- [ ] Verify ARIA labels are present
- [ ] Test with screen reader (basic check)
- [ ] Ensure color contrast is sufficient

### 14.6 Responsive Design
- [ ] Test on mobile viewport (375px)
- [ ] Test on tablet viewport (768px)
- [ ] Test on desktop viewport (1024px+)
- [ ] Verify mobile-first design is preserved

---

## 📝 Phase 15: Documentation

### 15.1 Update README
- [ ] Document environment setup
- [ ] Add API integration details
- [ ] Update development instructions
- [ ] Add testing guidelines

### 15.2 Code Comments
- [ ] Add JSDoc comments for complex functions
- [ ] Add inline comments for complex logic
- [ ] Ensure TypeScript types are self-documenting

### 15.3 Create Integration Summary
- [ ] List all integrated endpoints
- [ ] Document any deviations from spec
- [ ] Note any known issues or limitations
- [ ] Add troubleshooting guide

---

## ✅ Success Criteria

The integration is complete when:

- [ ] **Authentication**: Users can register, login, logout, and access protected routes
- [ ] **Social Feed**: Posts load from API, users can create posts, like, comment, and follow others
- [ ] **Schemes**: Schemes list loads, users can view details and apply
- [ ] **Jobs**: Jobs list loads, users can apply for jobs
- [ ] **Profile**: User profile loads and can be updated
- [ ] **Notifications**: Notifications load and can be marked as read
- [ ] **Messages**: Conversations load, users can send messages
- [ ] **Search**: Global search works for all content types
- [ ] **Emergency Alerts**: Active alerts display correctly
- [ ] **Loading States**: All data fetching shows loading indicators
- [ ] **Error Handling**: All errors display user-friendly messages
- [ ] **Type Safety**: TypeScript compiles without errors
- [ ] **No Mock Data**: All hardcoded data is removed
- [ ] **Mobile Responsive**: All pages work correctly on mobile devices
- [ ] **Build Succeeds**: `npm run build` completes without errors

---

## 🚀 Execution Instructions

1. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Verify Backend**:
   - Navigate to `http://localhost:3001/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

3. **Start Frontend Server**:
   ```bash
   npm run dev
   ```

4. **Begin Integration**:
   - Follow phases sequentially
   - Test each phase before moving to the next
   - Mark checkboxes as tasks are completed

5. **Test Continuously**:
   - Test in browser after each integration
   - Check browser console for errors
   - Verify API calls in Network tab

---

## 📌 Notes

- **Backend Base URL**: `http://localhost:3001/api`
- **Frontend Base URL**: `http://localhost:3000`
- **Database**: PostgreSQL (ensure it's running)
- **Prisma Schema**: `/backend/prisma/schema.prisma` is source of truth
- **API Spec**: `/docs/backend-spec.md` for endpoint details

---

## 🆘 Troubleshooting

If you encounter issues:

1. **CORS Errors**: Check backend CORS config allows `http://localhost:3000`
2. **Database Errors**: Run `cd backend && npm run prisma:push`
3. **401 Errors**: Check token is being sent in Authorization header
4. **Type Errors**: Verify interfaces match Prisma schema
5. **Build Errors**: Check for circular dependencies and missing imports

---

**Assignee**: @github-pull-request_copilot-coding-agent  
**Priority**: High  
**Estimated Time**: Full integration task
