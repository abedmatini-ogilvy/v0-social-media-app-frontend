# Backend Specification for CivicConnect

This document defines the backend API structure, Prisma schema, and implementation details for the CivicConnect application.

## API Base URL

```
Development: http://localhost:3001/api
Production: https://api.civicconnect.example/api
```

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### JWT Configuration
- Access Token: 15 minutes expiry
- Refresh Token: 7 days expiry (stateless for MVP)
- Algorithm: HS256

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| POST | `/auth/refresh-token` | Refresh access token | No |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password | No |
| POST | `/auth/verify-email` | Verify email address | No |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get current user profile | Yes |
| PUT | `/users/profile` | Update current user profile | Yes |
| PUT | `/users/change-password` | Change password | Yes |
| GET | `/users/connections` | Get user connections | Yes |
| POST | `/users/connect/:userId` | Connect with a user | Yes |
| DELETE | `/users/disconnect/:userId` | Disconnect from a user | Yes |
| GET | `/users/suggested-connections` | Get suggested connections | Yes |

### Posts Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/posts/feed` | Get posts feed | Yes |
| POST | `/posts` | Create a new post | Yes |
| GET | `/posts/:postId` | Get a specific post | Yes |
| PUT | `/posts/:postId` | Update a post | Yes |
| DELETE | `/posts/:postId` | Delete a post | Yes |
| POST | `/posts/:postId/like` | Like a post | Yes |
| DELETE | `/posts/:postId/unlike` | Unlike a post | Yes |
| GET | `/posts/:postId/comments` | Get post comments | Yes |
| POST | `/posts/:postId/comments` | Add a comment to a post | Yes |

### Schemes Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/schemes` | List all schemes | No |
| GET | `/schemes/:schemeId` | Get a specific scheme | No |
| POST | `/schemes/:schemeId/apply` | Apply for a scheme | Yes |
| GET | `/schemes/my-applications` | Get user's scheme applications | Yes |
| GET | `/schemes/applications/:applicationId` | Get application status | Yes |

### Jobs Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/jobs` | List all jobs | No |
| GET | `/jobs/:jobId` | Get a specific job | No |
| POST | `/jobs/:jobId/apply` | Apply for a job | Yes |
| GET | `/jobs/my-applications` | Get user's job applications | Yes |

### Events Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/events` | List all events | No |
| GET | `/events/:eventId` | Get a specific event | No |
| POST | `/events/:eventId/attend` | Mark attendance for an event | Yes |
| GET | `/events/my-events` | Get user's attended events | Yes |

### Notifications Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | Get user's notifications | Yes |
| PUT | `/notifications/:notificationId/read` | Mark notification as read | Yes |
| PUT | `/notifications/read-all` | Mark all notifications as read | Yes |

### Messages Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/messages/conversations` | Get user's conversations | Yes |
| GET | `/messages/conversations/:conversationId` | Get conversation messages | Yes |
| POST | `/messages` | Send a new message | Yes |

### Search Endpoint

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/search` | Search across all content | Yes |

### Emergency Alerts Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/emergency-alerts` | List all emergency alerts | No |
| GET | `/emergency-alerts/:alertId` | Get a specific alert | No |

---

## Request/Response Formats

### Authentication

#### POST /auth/register
Request:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "citizen" | "official"
}
```

Response:
```json
{
  "token": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "avatar": "string | null",
    "role": "citizen" | "official",
    "isVerified": boolean,
    "createdAt": "string"
  }
}
```

#### POST /auth/login
Request:
```json
{
  "email": "string",
  "password": "string"
}
```

Response: Same as register

#### POST /auth/refresh-token
Request:
```json
{
  "refreshToken": "string"
}
```

Response: Same as register

---

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  citizen
  official
}

enum NotificationType {
  alert
  message
  connection
  application
  system
}

enum ApplicationStatus {
  pending
  approved
  rejected
  under_review
}

model User {
  id            String   @id @default(cuid())
  name          String
  email         String   @unique
  password      String
  avatar        String?
  role          UserRole @default(citizen)
  isVerified    Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  posts               Post[]
  comments            Comment[]
  notifications       Notification[]
  schemeApplications  SchemeApplication[]
  jobApplications     JobApplication[]
  eventAttendees      EventAttendee[]
  sentMessages        Message[]           @relation("SentMessages")
  receivedMessages    Message[]           @relation("ReceivedMessages")
  connections         Connection[]        @relation("UserConnections")
  connectedTo         Connection[]        @relation("ConnectedToUser")
  conversationsAsUser1 Conversation[]     @relation("User1Conversations")
  conversationsAsUser2 Conversation[]     @relation("User2Conversations")
}

model Post {
  id        String   @id @default(cuid())
  content   String
  image     String?
  likes     Int      @default(0)
  comments  Int      @default(0)
  shares    Int      @default(0)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  commentList Comment[]

  @@index([authorId])
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@index([postId])
  @@index([authorId])
}

model Scheme {
  id                 String   @id @default(cuid())
  title              String
  description        String
  deadline           DateTime
  isNew              Boolean  @default(true)
  eligibility        String
  documents          String[]
  fundingDetails     String
  applicationProcess String
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  applications SchemeApplication[]
}

model SchemeApplication {
  id        String            @id @default(cuid())
  userId    String
  user      User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  schemeId  String
  scheme    Scheme            @relation(fields: [schemeId], references: [id], onDelete: Cascade)
  status    ApplicationStatus @default(pending)
  appliedAt DateTime          @default(now())
  updatedAt DateTime          @updatedAt

  @@unique([userId, schemeId])
  @@index([userId])
  @@index([schemeId])
}

model Job {
  id           String   @id @default(cuid())
  title        String
  company      String
  location     String
  description  String
  requirements String[]
  salary       String?
  isNew        Boolean  @default(true)
  postedAt     DateTime @default(now())
  updatedAt    DateTime @updatedAt

  applications JobApplication[]
}

model JobApplication {
  id        String            @id @default(cuid())
  userId    String
  user      User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  jobId     String
  job       Job               @relation(fields: [jobId], references: [id], onDelete: Cascade)
  status    ApplicationStatus @default(pending)
  appliedAt DateTime          @default(now())
  updatedAt DateTime          @updatedAt

  @@unique([userId, jobId])
  @@index([userId])
  @@index([jobId])
}

model Event {
  id          String   @id @default(cuid())
  title       String
  date        DateTime
  location    String
  description String
  organizer   String
  attendees   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  eventAttendees EventAttendee[]
}

model EventAttendee {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  eventId   String
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  joinedAt  DateTime @default(now())

  @@unique([userId, eventId])
  @@index([userId])
  @@index([eventId])
}

model Notification {
  id        String           @id @default(cuid())
  type      NotificationType
  title     String
  content   String
  isRead    Boolean          @default(false)
  actionUrl String?
  userId    String
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime         @default(now())

  @@index([userId])
}

model Connection {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation("UserConnections", fields: [userId], references: [id], onDelete: Cascade)
  connectedId String
  connected   User     @relation("ConnectedToUser", fields: [connectedId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())

  @@unique([userId, connectedId])
  @@index([userId])
  @@index([connectedId])
}

model Conversation {
  id        String   @id @default(cuid())
  user1Id   String
  user1     User     @relation("User1Conversations", fields: [user1Id], references: [id], onDelete: Cascade)
  user2Id   String
  user2     User     @relation("User2Conversations", fields: [user2Id], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  messages Message[]

  @@unique([user1Id, user2Id])
  @@index([user1Id])
  @@index([user2Id])
}

model Message {
  id             String       @id @default(cuid())
  content        String
  senderId       String
  sender         User         @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)
  receiverId     String
  receiver       User         @relation("ReceivedMessages", fields: [receiverId], references: [id], onDelete: Cascade)
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  isRead         Boolean      @default(false)
  createdAt      DateTime     @default(now())

  @@index([conversationId])
  @@index([senderId])
  @@index([receiverId])
}

model EmergencyAlert {
  id        String   @id @default(cuid())
  title     String
  message   String
  authority String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  expiresAt DateTime?
}
```

---

## Error Response Format

All API errors follow this format:
```json
{
  "error": {
    "message": "string",
    "code": "string"
  }
}
```

Common error codes:
- `UNAUTHORIZED` - Invalid or missing token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error
