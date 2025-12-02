/**
 * TypeScript types for CivicConnect
 * These types match the Prisma schema in backend/prisma/schema.prisma
 */

// Enums
export type UserRole = "citizen" | "official"
export type NotificationType = "alert" | "message" | "connection" | "application" | "system"
export type ApplicationStatus = "pending" | "approved" | "rejected" | "under_review"

// User model
export interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
  role: UserRole
  isVerified: boolean
  createdAt: string
  updatedAt?: string
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
  authorId: string
  author: User
  createdAt: string
  updatedAt?: string
}

// Comment model
export interface Comment {
  id: string
  content: string
  postId: string
  authorId: string
  author: User
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
