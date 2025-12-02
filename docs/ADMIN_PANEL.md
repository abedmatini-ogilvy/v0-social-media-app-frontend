# Admin Panel Implementation

## Overview
Full admin panel with user management, content moderation, announcements, and analytics.

---

## Phase 1: Database Schema Updates

### New Enum: UserRole
```prisma
enum UserRole {
  citizen
  official
  admin
}
```

### Updated User Model
```prisma
model User {
  // ... existing fields
  isBanned      Boolean   @default(false)
  banReason     String?
  bannedAt      DateTime?
  bannedBy      String?   // Admin who banned
  suspendedUntil DateTime? // For temporary suspensions
}
```

### New Model: Report
```prisma
model Report {
  id          String    @id @default(cuid())
  postId      String?
  post        Post?     @relation(fields: [postId], references: [id], onDelete: Cascade)
  commentId   String?
  comment     Comment?  @relation(fields: [commentId], references: [id], onDelete: Cascade)
  reporterId  String
  reporter    User      @relation("ReportsMade", fields: [reporterId], references: [id])
  reason      ReportReason
  description String?
  status      ReportStatus @default(pending)
  reviewedBy  String?
  reviewer    User?     @relation("ReportsReviewed", fields: [reviewedBy], references: [id])
  reviewedAt  DateTime?
  action      ReportAction?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum ReportReason {
  misinformation
  harassment
  spam
  scam
  inappropriate
  other
}

enum ReportStatus {
  pending
  reviewed
  dismissed
  action_taken
}

enum ReportAction {
  warning
  post_removed
  user_suspended
  user_banned
}
```

### New Model: Announcement
```prisma
model Announcement {
  id            String   @id @default(cuid())
  title         String
  content       String
  department    String?
  priority      AnnouncementPriority @default(medium)
  status        AnnouncementStatus @default(draft)
  audience      String?  // Location filter or "all"
  scheduledFor  DateTime?
  publishedAt   DateTime?
  createdBy     String
  creator       User     @relation(fields: [createdBy], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum AnnouncementPriority {
  low
  medium
  high
  urgent
}

enum AnnouncementStatus {
  draft
  scheduled
  published
  archived
}
```

---

## Phase 2: API Endpoints

### Admin Authentication Middleware
- Check if user is authenticated
- Check if user role is `admin`
- Return 403 if not admin

### Admin Endpoints

#### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users (paginated, searchable) |
| GET | `/api/admin/users/:id` | Get user details |
| PUT | `/api/admin/users/:id` | Update user (role, verified status) |
| POST | `/api/admin/users/:id/ban` | Ban user |
| POST | `/api/admin/users/:id/unban` | Unban user |
| POST | `/api/admin/users/:id/suspend` | Suspend user temporarily |
| DELETE | `/api/admin/users/:id` | Delete user |
| POST | `/api/admin/users/:id/reset-password` | Reset user password |

#### Content Moderation (Reports)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/reports` | Get all reports (filterable by status) |
| GET | `/api/admin/reports/:id` | Get report details |
| PUT | `/api/admin/reports/:id` | Review report (update status, action) |
| DELETE | `/api/admin/reports/:id` | Delete report |

#### Announcements
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/announcements` | Get all announcements |
| POST | `/api/admin/announcements` | Create announcement |
| PUT | `/api/admin/announcements/:id` | Update announcement |
| DELETE | `/api/admin/announcements/:id` | Delete announcement |
| POST | `/api/admin/announcements/:id/publish` | Publish announcement |

#### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/analytics/overview` | Get dashboard stats |
| GET | `/api/admin/analytics/users` | Get user analytics |
| GET | `/api/admin/analytics/posts` | Get post analytics |
| GET | `/api/admin/analytics/reports` | Get report analytics |

### Public Endpoints (for users)

#### Reporting
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reports` | Create a report |
| GET | `/api/reports/my-reports` | Get user's submitted reports |

#### Announcements (public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/announcements` | Get published announcements |

---

## Phase 3: Test Cases

### Admin Authentication Tests
- [ ] TC-001: Admin can access /admin page
- [ ] TC-002: Non-admin user redirected from /admin
- [ ] TC-003: Unauthenticated user redirected to login from /admin
- [ ] TC-004: Admin API returns 403 for non-admin users

### User Management Tests
- [ ] TC-010: Admin can view all users
- [ ] TC-011: Admin can search users by name/email
- [ ] TC-012: Admin can filter users by role
- [ ] TC-013: Admin can view user details
- [ ] TC-014: Admin can change user role
- [ ] TC-015: Admin can verify/unverify user
- [ ] TC-016: Admin can ban user with reason
- [ ] TC-017: Admin can unban user
- [ ] TC-018: Admin can suspend user temporarily
- [ ] TC-019: Admin can delete user
- [ ] TC-020: Admin can reset user password
- [ ] TC-021: Banned user cannot login
- [ ] TC-022: Suspended user cannot login until suspension ends

### Content Moderation Tests
- [ ] TC-030: User can report a post
- [ ] TC-031: User can report a comment
- [ ] TC-032: User cannot report same content twice
- [ ] TC-033: Admin can view all reports
- [ ] TC-034: Admin can filter reports by status
- [ ] TC-035: Admin can review report and dismiss
- [ ] TC-036: Admin can review report and remove post
- [ ] TC-037: Admin can review report and warn user
- [ ] TC-038: Admin can review report and ban user
- [ ] TC-039: User notified when their content is removed
- [ ] TC-040: User notified when they receive a warning

### Announcement Tests
- [ ] TC-050: Admin can create draft announcement
- [ ] TC-051: Admin can schedule announcement
- [ ] TC-052: Admin can publish announcement immediately
- [ ] TC-053: Admin can edit announcement
- [ ] TC-054: Admin can delete announcement
- [ ] TC-055: Published announcements appear on user feed
- [ ] TC-056: Announcements can be filtered by location/audience

### Analytics Tests
- [ ] TC-060: Dashboard shows correct total users count
- [ ] TC-061: Dashboard shows correct total posts count
- [ ] TC-062: Dashboard shows correct pending reports count
- [ ] TC-063: Dashboard shows correct verified officials count
- [ ] TC-064: User growth chart shows correct data
- [ ] TC-065: Post activity chart shows correct data

---

## Phase 4: Implementation Order

1. **Schema Updates** - Add all new models and fields
2. **Admin Middleware** - Create authentication/authorization
3. **Admin Controller** - Implement all admin endpoints
4. **Admin Routes** - Wire up routes
5. **Report Controller** - User reporting functionality
6. **Frontend Types** - TypeScript interfaces
7. **Admin API Service** - Frontend API functions
8. **Admin Panel UI** - Connect to real data
9. **Route Protection** - Protect /admin route
10. **Seed Script** - Create default admin
11. **Testing** - Run all test cases

---

## Default Admin Credentials
After running seed script:
- **Email**: admin@civicconnect.com
- **Password**: Admin@123456
- **Role**: admin

⚠️ **IMPORTANT**: Change the default password immediately after first login!

---

## Setup Instructions

### 1. Generate Prisma Client
```bash
cd backend
npx prisma generate
```

### 2. Push Schema to Database
```bash
npx prisma db push
```

### 3. Seed the Database (creates admin user)
```bash
npx prisma db seed
```

### 4. Start the Backend
```bash
npm run dev
```

### 5. Access Admin Panel
Navigate to `http://localhost:3000/admin` and login with admin credentials.

---

## Files Created/Modified

### Backend
- `prisma/schema.prisma` - Added admin role, Report, Announcement models, ban fields
- `src/middleware/auth.ts` - Added `requireAdmin` and `checkBanned` middleware
- `src/controllers/adminController.ts` - All admin CRUD operations
- `src/controllers/reportController.ts` - User reporting functionality
- `src/routes/admin.ts` - Admin API routes
- `src/routes/reports.ts` - Report API routes
- `src/routes/announcements.ts` - Announcement API routes
- `src/app.ts` - Registered new routes
- `prisma/seed.ts` - Added admin user creation

### Frontend (To be implemented)
- `lib/types.ts` - Admin types
- `lib/admin-api-service.ts` - Admin API functions
- `app/admin/page.tsx` - Connect to real data
