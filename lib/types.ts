/**
 * TypeScript types for CivicConnect
 * These types match the Prisma schema in backend/prisma/schema.prisma
 */

// Enums
export type UserRole = "citizen" | "official" | "admin"
export type NotificationType = "alert" | "message" | "connection" | "application" | "system"
export type ApplicationStatus = "pending" | "approved" | "rejected" | "under_review"
export type ReportReason = "misinformation" | "harassment" | "spam" | "scam" | "inappropriate" | "other"
export type ReportStatus = "pending" | "reviewed" | "dismissed" | "action_taken"
export type ReportAction = "warning" | "post_removed" | "user_suspended" | "user_banned"
export type AnnouncementPriority = "low" | "medium" | "high" | "urgent"
export type AnnouncementStatus = "draft" | "scheduled" | "published" | "archived"

// User model
export interface User {
  id: string
  name: string
  email: string
  handle?: string | null // Unique username handle for @mentions (e.g., @priya_sharma)
  avatar?: string | null
  coverPhoto?: string | null
  bio?: string | null
  location?: string | null
  occupation?: string | null
  phone?: string | null
  website?: string | null
  interests?: string[]
  address?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  connections?: number
  role: UserRole
  isVerified: boolean
  // Ban/Suspension fields
  isBanned?: boolean
  banReason?: string | null
  bannedAt?: string | null
  bannedBy?: string | null
  suspendedUntil?: string | null
  createdAt: string
  updatedAt?: string
  // Counts for admin
  _count?: {
    posts?: number
    reportsMade?: number
    comments?: number
    connections?: number
  }
  reportsAgainst?: number
}

// User Settings model
export interface UserSettings {
  id: string
  userId: string
  // Notification preferences
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  emergencyAlerts: boolean
  schemeUpdates: boolean
  communityUpdates: boolean
  // Privacy settings
  profileVisibility: "everyone" | "connections" | "officials" | "none"
  postVisibility: "everyone" | "connections" | "officials" | "none"
  locationSharing: boolean
  dataAnalytics: boolean
  personalizedAds: boolean
  // Security
  twoFactorEnabled: boolean
  loginAlerts: boolean
  // Language preferences
  primaryLanguage: string
  secondaryLanguage?: string | null
  autoTranslate: boolean
  // Appearance
  theme: "light" | "dark" | "system"
  fontSize: number
  // Accessibility
  highContrast: boolean
  largeText: boolean
  screenReader: boolean
  createdAt: string
  updatedAt: string
}

// Post model
export interface Post {
  id: string
  content: string
  image?: string | null
  location?: string | null
  likes: number
  comments: number
  shares: number
  isLikedByCurrentUser?: boolean
  authorId: string
  author: User
  createdAt: string
  updatedAt?: string
}

// Post liker (user who liked a post)
export interface PostLiker {
  id: string
  name: string
  handle?: string | null
  avatar?: string | null
  role: UserRole
  isVerified: boolean
  likedAt: string
}

// Comment model
export interface Comment {
  id: string
  content: string
  postId: string
  authorId?: string
  author: User
  parentId?: string | null // If set, this is a reply to another comment
  replyCount: number // Cached count of direct replies
  replies?: Comment[] // Nested replies (max 2 levels deep)
  createdAt: string
}

// Scheme model
export interface Scheme {
  id: string
  title: string
  description: string
  deadline: string
  isNew: boolean
  eligibility: string
  documents: string[]
  fundingDetails: string
  applicationProcess: string
  createdAt: string
  updatedAt?: string
}

// SchemeApplication model
export interface SchemeApplication {
  id: string
  userId: string
  user?: User
  schemeId: string
  scheme?: Scheme
  status: ApplicationStatus
  appliedAt: string
  updatedAt?: string
}

// Job model
export interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  salary?: string | null
  isNew: boolean
  postedAt: string
  updatedAt?: string
}

// JobApplication model
export interface JobApplication {
  id: string
  userId: string
  user?: User
  jobId: string
  job?: Job
  status: ApplicationStatus
  appliedAt: string
  updatedAt?: string
}

// Event model
export interface Event {
  id: string
  title: string
  date: string
  location: string
  description: string
  organizer: string
  attendees: number
  createdAt: string
  updatedAt?: string
}

// EventAttendee model
export interface EventAttendee {
  id: string
  userId: string
  user?: User
  eventId: string
  event?: Event
  joinedAt: string
}

// Notification model
export interface Notification {
  id: string
  type: NotificationType
  title: string
  content: string
  isRead: boolean
  actionUrl?: string | null
  userId: string
  createdAt: string
}

// Connection model
export interface Connection {
  id: string
  userId: string
  user?: User
  connectedId: string
  connected?: User
  createdAt: string
}

// Conversation model
export interface Conversation {
  id: string
  user1Id: string
  user1?: User
  user2Id: string
  user2?: User
  createdAt: string
  updatedAt?: string
  messages?: Message[]
}

// Message model
export interface Message {
  id: string
  content: string
  senderId: string
  sender?: User
  receiverId: string
  receiver?: User
  conversationId: string
  isRead: boolean
  createdAt: string
}

// EmergencyAlert model
export interface EmergencyAlert {
  id: string
  title: string
  message: string
  authority: string
  isActive: boolean
  createdAt: string
  expiresAt?: string | null
}

// Report model
export interface Report {
  id: string
  postId?: string | null
  post?: {
    id: string
    content: string
    author?: {
      id: string
      name: string
      email?: string
      avatar?: string | null
    }
  } | null
  commentId?: string | null
  comment?: {
    id: string
    content: string
    author?: {
      id: string
      name: string
      email?: string
      avatar?: string | null
    }
  } | null
  reporterId: string
  reporter?: {
    id: string
    name: string
    email?: string
    avatar?: string | null
  }
  reason: ReportReason
  description?: string | null
  status: ReportStatus
  reviewedBy?: string | null
  reviewer?: {
    id: string
    name: string
  } | null
  reviewedAt?: string | null
  action?: ReportAction | null
  contentType?: "post" | "comment"
  createdAt: string
  updatedAt: string
}

// Announcement model
export interface Announcement {
  id: string
  title: string
  content: string
  department?: string | null
  priority: AnnouncementPriority
  status: AnnouncementStatus
  audience?: string | null
  scheduledFor?: string | null
  publishedAt?: string | null
  createdBy: string
  creator?: {
    id: string
    name: string
    avatar?: string | null
  }
  createdAt: string
  updatedAt: string
}

// Admin Analytics types
export interface AdminOverviewStats {
  totalUsers: number
  totalPosts: number
  totalComments: number
  totalReports: number
  pendingReports: number
  verifiedOfficials: number
  newUsersToday: number
  newPostsToday: number
  bannedUsers: number
  totalAnnouncements: number
}

export interface UserAnalytics {
  userGrowth: Record<string, number>
  roleDistribution: Array<{ role: UserRole; count: number }>
  totalNewUsers: number
}

export interface PostAnalytics {
  postGrowth: Record<string, number>
  totalNewPosts: number
  engagement: {
    totalLikes: number
    totalComments: number
    totalShares: number
    avgLikesPerPost: number | string
    avgCommentsPerPost: number | string
  }
}

export interface ReportAnalytics {
  byStatus: Array<{ status: ReportStatus; count: number }>
  byReason: Array<{ reason: ReportReason; count: number }>
  byAction: Array<{ action: ReportAction | null; count: number }>
  reportsLast7Days: number
}

// API Response types
export interface AuthResponse {
  token: string
  refreshToken: string
  user: User
}

export interface ApiError {
  error: {
    message: string
    code: string
  }
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Search response
export interface SearchResponse {
  users: User[]
  posts: Post[]
  schemes: Scheme[]
  jobs: Job[]
  events: Event[]
}
