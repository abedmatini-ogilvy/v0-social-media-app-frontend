/**
 * API Service for CivicConnect
 * This file contains all the API endpoints and methods for interacting with the backend
 */

import type {
  User,
  UserSettings,
  Post,
  Comment,
  Scheme,
  SchemeApplication,
  Job,
  JobApplication,
  Event,
  Notification,
  EmergencyAlert,
  Conversation,
  Message,
  AuthResponse,
  ApiError,
  PaginatedResponse,
  SearchResponse,
} from "./types"

// Base API URL - set from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
  },

  // User endpoints
  USER: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password`,
    CONNECTIONS: `${API_BASE_URL}/users/connections`,
    CONNECT: (userId: string) => `${API_BASE_URL}/users/connect/${userId}`,
    DISCONNECT: (userId: string) => `${API_BASE_URL}/users/disconnect/${userId}`,
    SUGGESTED_CONNECTIONS: `${API_BASE_URL}/users/suggested-connections`,
    SETTINGS: `${API_BASE_URL}/users/settings`,
  },

  // Upload endpoints
  UPLOAD: {
    IMAGE: `${API_BASE_URL}/upload/image`,
    AVATAR: `${API_BASE_URL}/upload/avatar`,
    COVER: `${API_BASE_URL}/upload/cover`,
  },

  // Posts endpoints
  POSTS: {
    FEED: `${API_BASE_URL}/posts/feed`,
    PUBLIC: `${API_BASE_URL}/posts/public`,
    CREATE: `${API_BASE_URL}/posts`,
    GET: (postId: string) => `${API_BASE_URL}/posts/${postId}`,
    UPDATE: (postId: string) => `${API_BASE_URL}/posts/${postId}`,
    DELETE: (postId: string) => `${API_BASE_URL}/posts/${postId}`,
    LIKE: (postId: string) => `${API_BASE_URL}/posts/${postId}/like`,
    UNLIKE: (postId: string) => `${API_BASE_URL}/posts/${postId}/unlike`,
    COMMENTS: (postId: string) => `${API_BASE_URL}/posts/${postId}/comments`,
    ADD_COMMENT: (postId: string) => `${API_BASE_URL}/posts/${postId}/comments`,
  },

  // Schemes endpoints
  SCHEMES: {
    LIST: `${API_BASE_URL}/schemes`,
    GET: (schemeId: string) => `${API_BASE_URL}/schemes/${schemeId}`,
    APPLY: (schemeId: string) => `${API_BASE_URL}/schemes/${schemeId}/apply`,
    MY_APPLICATIONS: `${API_BASE_URL}/schemes/my-applications`,
    APPLICATION_STATUS: (applicationId: string) => `${API_BASE_URL}/schemes/applications/${applicationId}`,
  },

  // Jobs endpoints
  JOBS: {
    LIST: `${API_BASE_URL}/jobs`,
    GET: (jobId: string) => `${API_BASE_URL}/jobs/${jobId}`,
    APPLY: (jobId: string) => `${API_BASE_URL}/jobs/${jobId}/apply`,
    MY_APPLICATIONS: `${API_BASE_URL}/jobs/my-applications`,
  },

  // Events endpoints
  EVENTS: {
    LIST: `${API_BASE_URL}/events`,
    GET: (eventId: string) => `${API_BASE_URL}/events/${eventId}`,
    ATTEND: (eventId: string) => `${API_BASE_URL}/events/${eventId}/attend`,
    MY_EVENTS: `${API_BASE_URL}/events/my-events`,
  },

  // Notifications endpoints
  NOTIFICATIONS: {
    LIST: `${API_BASE_URL}/notifications`,
    MARK_READ: (notificationId: string) => `${API_BASE_URL}/notifications/${notificationId}/read`,
    MARK_ALL_READ: `${API_BASE_URL}/notifications/read-all`,
  },

  // Messages endpoints
  MESSAGES: {
    CONVERSATIONS: `${API_BASE_URL}/messages/conversations`,
    CONVERSATION: (conversationId: string) => `${API_BASE_URL}/messages/conversations/${conversationId}`,
    SEND: `${API_BASE_URL}/messages`,
  },

  // Search endpoint
  SEARCH: `${API_BASE_URL}/search`,

  // Emergency alerts endpoints
  EMERGENCY_ALERTS: {
    LIST: `${API_BASE_URL}/emergency-alerts`,
    GET: (alertId: string) => `${API_BASE_URL}/emergency-alerts/${alertId}`,
  },

  // Public announcements endpoint
  ANNOUNCEMENTS: {
    LIST: `${API_BASE_URL}/announcements`,
  },
}

// HTTP request headers
const getHeaders = (token?: string, isFormData?: boolean) => {
  const headers: Record<string, string> = {}

  if (!isFormData) {
    headers["Content-Type"] = "application/json"
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

// Generic API request function with improved error handling
export async function apiRequest<T, D = unknown>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: D,
  token?: string,
): Promise<T> {
  try {
    const isFormData = data instanceof FormData
    const options: RequestInit = {
      method,
      headers: getHeaders(token, isFormData),
    }

    if (data) {
      options.body = isFormData ? data : JSON.stringify(data)
    }

    const response = await fetch(url, options)

    // Handle unauthorized errors (expired token)
    if (response.status === 401) {
      throw new Error("Unauthorized - Please login again")
    }

    // Handle other error responses
    if (!response.ok) {
      let errorMessage = "API request failed"
      try {
        const errorData: ApiError = await response.json()
        errorMessage = errorData.error?.message || errorMessage
      } catch {
        // If we can't parse the error, use the status text
        errorMessage = response.statusText || errorMessage
      }
      throw new Error(errorMessage)
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return {} as T
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      console.error("API request failed:", error.message)
      throw error
    }
    console.error("API request failed:", error)
    throw new Error("An unexpected error occurred")
  }
}

// ==================== AUTH API ====================

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, "POST", { email, password })
}

export async function register(userData: {
  name: string
  email: string
  password: string
  role: "citizen" | "official"
}): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, "POST", userData)
}

export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, "POST", { refreshToken })
}

export async function logout(token: string): Promise<void> {
  return apiRequest<void>(API_ENDPOINTS.AUTH.LOGOUT, "POST", undefined, token)
}

// ==================== USER API ====================

export async function getUserProfile(token: string): Promise<User> {
  return apiRequest<User>(API_ENDPOINTS.USER.PROFILE, "GET", undefined, token)
}

export async function updateUserProfile(token: string, data: Partial<User>): Promise<User> {
  return apiRequest<User>(API_ENDPOINTS.USER.UPDATE_PROFILE, "PUT", data, token)
}

export async function getUserPosts(token: string): Promise<Post[]> {
  return apiRequest<Post[]>(`${API_BASE_URL}/posts/my-posts`, "GET", undefined, token)
}

export async function getConnections(token: string): Promise<User[]> {
  return apiRequest<User[]>(API_ENDPOINTS.USER.CONNECTIONS, "GET", undefined, token)
}

export async function getSuggestedConnections(token: string): Promise<User[]> {
  return apiRequest<User[]>(API_ENDPOINTS.USER.SUGGESTED_CONNECTIONS, "GET", undefined, token)
}

export async function connectWithUser(userId: string, token: string): Promise<void> {
  return apiRequest<void>(API_ENDPOINTS.USER.CONNECT(userId), "POST", undefined, token)
}

export async function disconnectFromUser(userId: string, token: string): Promise<void> {
  return apiRequest<void>(API_ENDPOINTS.USER.DISCONNECT(userId), "DELETE", undefined, token)
}

export async function getUserSettings(token: string): Promise<UserSettings> {
  return apiRequest<UserSettings>(API_ENDPOINTS.USER.SETTINGS, "GET", undefined, token)
}

export async function updateUserSettings(token: string, data: Partial<UserSettings>): Promise<UserSettings> {
  return apiRequest<UserSettings>(API_ENDPOINTS.USER.SETTINGS, "PUT", data, token)
}

export async function changePassword(token: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(API_ENDPOINTS.USER.CHANGE_PASSWORD, "PUT", { currentPassword, newPassword }, token)
}

// ==================== POSTS API ====================

export async function getPostsFeed(token: string): Promise<Post[]> {
  const response = await apiRequest<{ posts: Post[]; pagination: unknown }>(
    API_ENDPOINTS.POSTS.FEED,
    "GET",
    undefined,
    token
  )
  return response.posts
}

// Public feed - no authentication required
export async function getPublicFeed(): Promise<Post[]> {
  const response = await fetch(API_ENDPOINTS.POSTS.PUBLIC)
  if (!response.ok) {
    throw new Error('Failed to fetch public feed')
  }
  const data = await response.json()
  return data.posts
}

export async function createPost(
  content: string, 
  token: string, 
  options?: { image?: string; location?: string }
): Promise<Post> {
  return apiRequest<Post>(
    API_ENDPOINTS.POSTS.CREATE, 
    "POST", 
    { 
      content, 
      image: options?.image,
      location: options?.location 
    }, 
    token
  )
}

export async function getPost(postId: string, token: string): Promise<Post> {
  return apiRequest<Post>(API_ENDPOINTS.POSTS.GET(postId), "GET", undefined, token)
}

export async function updatePost(postId: string, content: string, token: string): Promise<Post> {
  return apiRequest<Post>(API_ENDPOINTS.POSTS.UPDATE(postId), "PUT", { content }, token)
}

export async function deletePost(postId: string, token: string): Promise<void> {
  return apiRequest<void>(API_ENDPOINTS.POSTS.DELETE(postId), "DELETE", undefined, token)
}

export async function likePost(postId: string, token: string): Promise<void> {
  return apiRequest<void>(API_ENDPOINTS.POSTS.LIKE(postId), "POST", undefined, token)
}

export async function unlikePost(postId: string, token: string): Promise<void> {
  return apiRequest<void>(API_ENDPOINTS.POSTS.UNLIKE(postId), "DELETE", undefined, token)
}

export async function getPostComments(postId: string, token: string): Promise<Comment[]> {
  return apiRequest<Comment[]>(API_ENDPOINTS.POSTS.COMMENTS(postId), "GET", undefined, token)
}

export async function addComment(postId: string, content: string, token: string): Promise<Comment> {
  return apiRequest<Comment>(API_ENDPOINTS.POSTS.ADD_COMMENT(postId), "POST", { content }, token)
}

// ==================== UPLOAD API ====================

export interface UploadResponse {
  message: string;
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export async function uploadImage(file: File, token: string): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(API_ENDPOINTS.UPLOAD.IMAGE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to upload image');
  }

  return response.json();
}

// Upload avatar
export async function uploadAvatar(file: File, token: string): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch(API_ENDPOINTS.UPLOAD.AVATAR, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to upload avatar');
  }

  return response.json();
}

// Upload cover photo
export async function uploadCoverPhoto(file: File, token: string): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('cover', file);

  const response = await fetch(API_ENDPOINTS.UPLOAD.COVER, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to upload cover photo');
  }

  return response.json();
}

// ==================== SCHEMES API ====================

export async function getSchemes(): Promise<Scheme[]> {
  return apiRequest<Scheme[]>(API_ENDPOINTS.SCHEMES.LIST, "GET")
}

export async function getScheme(schemeId: string): Promise<Scheme> {
  return apiRequest<Scheme>(API_ENDPOINTS.SCHEMES.GET(schemeId), "GET")
}

export async function applyForScheme(schemeId: string, token: string): Promise<SchemeApplication> {
  return apiRequest<SchemeApplication>(API_ENDPOINTS.SCHEMES.APPLY(schemeId), "POST", undefined, token)
}

export async function getMySchemeApplications(token: string): Promise<SchemeApplication[]> {
  return apiRequest<SchemeApplication[]>(API_ENDPOINTS.SCHEMES.MY_APPLICATIONS, "GET", undefined, token)
}

export async function getSchemeApplicationStatus(applicationId: string, token: string): Promise<SchemeApplication> {
  return apiRequest<SchemeApplication>(API_ENDPOINTS.SCHEMES.APPLICATION_STATUS(applicationId), "GET", undefined, token)
}

// ==================== JOBS API ====================

export async function getJobs(): Promise<Job[]> {
  return apiRequest<Job[]>(API_ENDPOINTS.JOBS.LIST, "GET")
}

export async function getJob(jobId: string): Promise<Job> {
  return apiRequest<Job>(API_ENDPOINTS.JOBS.GET(jobId), "GET")
}

export async function applyForJob(jobId: string, token: string): Promise<JobApplication> {
  return apiRequest<JobApplication>(API_ENDPOINTS.JOBS.APPLY(jobId), "POST", undefined, token)
}

export async function getMyJobApplications(token: string): Promise<JobApplication[]> {
  return apiRequest<JobApplication[]>(API_ENDPOINTS.JOBS.MY_APPLICATIONS, "GET", undefined, token)
}

// ==================== EVENTS API ====================

export async function getEvents(): Promise<Event[]> {
  return apiRequest<Event[]>(API_ENDPOINTS.EVENTS.LIST, "GET")
}

export async function getEvent(eventId: string): Promise<Event> {
  return apiRequest<Event>(API_ENDPOINTS.EVENTS.GET(eventId), "GET")
}

export async function attendEvent(eventId: string, token: string): Promise<void> {
  return apiRequest<void>(API_ENDPOINTS.EVENTS.ATTEND(eventId), "POST", undefined, token)
}

export async function getMyEvents(token: string): Promise<Event[]> {
  return apiRequest<Event[]>(API_ENDPOINTS.EVENTS.MY_EVENTS, "GET", undefined, token)
}

// ==================== ADMIN EVENTS API ====================

export interface CreateEventData {
  title: string
  description: string
  date: string
  location: string
  organizer: string
}

export async function adminCreateEvent(data: CreateEventData, token: string): Promise<Event> {
  return apiRequest<Event>(`${API_BASE_URL}/admin/events`, "POST", data, token)
}

export async function adminUpdateEvent(eventId: string, data: Partial<CreateEventData>, token: string): Promise<Event> {
  return apiRequest<Event>(`${API_BASE_URL}/admin/events/${eventId}`, "PUT", data, token)
}

export async function adminDeleteEvent(eventId: string, token: string): Promise<void> {
  return apiRequest<void>(`${API_BASE_URL}/admin/events/${eventId}`, "DELETE", undefined, token)
}

export interface EventAttendee {
  id: string
  joinedAt: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string | null
  }
}

export interface EventWithAttendees {
  event: Event
  attendees: EventAttendee[]
}

export async function adminGetEventAttendees(eventId: string, token: string): Promise<EventWithAttendees> {
  return apiRequest<EventWithAttendees>(`${API_BASE_URL}/admin/events/${eventId}/attendees`, "GET", undefined, token)
}

// ==================== NOTIFICATIONS API ====================

export async function getNotifications(token: string): Promise<Notification[]> {
  return apiRequest<Notification[]>(API_ENDPOINTS.NOTIFICATIONS.LIST, "GET", undefined, token)
}

export async function markNotificationAsRead(notificationId: string, token: string): Promise<void> {
  return apiRequest<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId), "PUT", undefined, token)
}

export async function markAllNotificationsAsRead(token: string): Promise<void> {
  return apiRequest<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, "PUT", undefined, token)
}

// ==================== MESSAGES API ====================

export async function getConversations(token: string): Promise<Conversation[]> {
  return apiRequest<Conversation[]>(API_ENDPOINTS.MESSAGES.CONVERSATIONS, "GET", undefined, token)
}

export interface ConversationDetail {
  id: string
  user: { id: string; name: string; avatar: string | null }
  messages: Message[]
}

export async function getConversation(conversationId: string, token: string): Promise<ConversationDetail> {
  return apiRequest<ConversationDetail>(API_ENDPOINTS.MESSAGES.CONVERSATION(conversationId), "GET", undefined, token)
}

export async function sendMessage(receiverId: string, content: string, token: string): Promise<Message> {
  return apiRequest<Message>(API_ENDPOINTS.MESSAGES.SEND, "POST", { receiverId, content }, token)
}

// ==================== SEARCH API ====================

export async function search(query: string, token: string): Promise<SearchResponse> {
  return apiRequest<SearchResponse>(`${API_ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`, "GET", undefined, token)
}

// ==================== EMERGENCY ALERTS API ====================

export async function getEmergencyAlerts(): Promise<EmergencyAlert[]> {
  return apiRequest<EmergencyAlert[]>(API_ENDPOINTS.EMERGENCY_ALERTS.LIST, "GET")
}

export async function getEmergencyAlert(alertId: string): Promise<EmergencyAlert> {
  return apiRequest<EmergencyAlert>(API_ENDPOINTS.EMERGENCY_ALERTS.GET(alertId), "GET")
}

// ==================== PUBLIC ANNOUNCEMENTS API ====================

export interface PublicAnnouncement {
  id: string
  title: string
  content: string
  department?: string | null
  priority: "low" | "medium" | "high" | "urgent"
  audience?: string | null
  publishedAt?: string | null
  creator?: {
    id: string
    name: string
    avatar?: string | null
  }
}

export async function getPublicAnnouncements(audience?: string): Promise<PublicAnnouncement[]> {
  const url = audience 
    ? `${API_ENDPOINTS.ANNOUNCEMENTS.LIST}?audience=${encodeURIComponent(audience)}`
    : API_ENDPOINTS.ANNOUNCEMENTS.LIST
  return apiRequest<PublicAnnouncement[]>(url, "GET")
}

export async function getUrgentAnnouncements(): Promise<PublicAnnouncement[]> {
  const announcements = await getPublicAnnouncements()
  return announcements.filter(a => a.priority === "urgent")
}

// Re-export types
export type { User, Post, Comment, Scheme, Job, Event, Notification, EmergencyAlert, AuthResponse, ApiError }
