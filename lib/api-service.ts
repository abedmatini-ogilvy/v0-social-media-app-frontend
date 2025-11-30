/**
 * API Service for CivicConnect
 * This file contains all the API endpoints and methods for interacting with the backend
 */

// Base API URL - would be set from environment variables in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.civicconnect.example"

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
  },

  // Posts endpoints
  POSTS: {
    FEED: `${API_BASE_URL}/posts/feed`,
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
}

// HTTP request headers
const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

// Generic API request function
export async function apiRequest<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any,
  token?: string,
): Promise<T> {
  try {
    const options: RequestInit = {
      method,
      headers: getHeaders(token),
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(url, options)

    // Handle unauthorized errors (expired token)
    if (response.status === 401) {
      // Attempt to refresh token or redirect to login
      // This would be implemented based on your auth strategy
      throw new Error("Unauthorized - Please login again")
    }

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "API request failed")
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Example usage of the API service:
/*
// Authentication
export async function loginUser(email: string, password: string) {
  return apiRequest<{ token: string, user: User }>(
    API_ENDPOINTS.AUTH.LOGIN,
    'POST',
    { email, password }
  );
}

// Get user profile
export async function getUserProfile(token: string) {
  return apiRequest<User>(
    API_ENDPOINTS.USER.PROFILE,
    'GET',
    undefined,
    token
  );
}

// Create a post
export async function createPost(content: string, image?: File, token: string) {
  const formData = new FormData();
  formData.append('content', content);
  if (image) {
    formData.append('image', image);
  }
  
  return apiRequest<Post>(
    API_ENDPOINTS.POSTS.CREATE,
    'POST',
    formData,
    token
  );
}
*/
