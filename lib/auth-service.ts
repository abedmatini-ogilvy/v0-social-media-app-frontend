/**
 * Authentication Service for CivicConnect
 * Handles user authentication, token management, and session persistence
 */

import { apiRequest, API_ENDPOINTS } from "./api-service"

// Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "citizen" | "official"
  isVerified: boolean
  createdAt: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: User
}

// Token storage keys
const TOKEN_KEY = "civicconnect_token"
const REFRESH_TOKEN_KEY = "civicconnect_refresh_token"
const USER_KEY = "civicconnect_user"

// Store authentication data in localStorage (or sessionStorage)
export const storeAuthData = (authData: AuthResponse) => {
  if (typeof window === "undefined") return

  localStorage.setItem(TOKEN_KEY, authData.token)
  localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken)
  localStorage.setItem(USER_KEY, JSON.stringify(authData.user))
}

// Clear authentication data from storage
export const clearAuthData = () => {
  if (typeof window === "undefined") return

  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// Get stored token
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

// Get stored refresh token
export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

// Get stored user data
export const getUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem(USER_KEY)
  if (!userData) return null

  try {
    return JSON.parse(userData) as User
  } catch (error) {
    console.error("Failed to parse user data:", error)
    return null
  }
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken()
}

// Login user
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiRequest<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, "POST", { email, password })

  storeAuthData(response)
  return response
}

// Register user
export const registerUser = async (userData: {
  name: string
  email: string
  password: string
  role: "citizen" | "official"
}): Promise<AuthResponse> => {
  const response = await apiRequest<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, "POST", userData)

  storeAuthData(response)
  return response
}

// Logout user
export const logoutUser = async (): Promise<void> => {
  const token = getToken()

  if (token) {
    try {
      await apiRequest(API_ENDPOINTS.AUTH.LOGOUT, "POST", undefined, token)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  clearAuthData()
}

// Refresh token
export const refreshAuthToken = async (): Promise<AuthResponse> => {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    throw new Error("No refresh token available")
  }

  const response = await apiRequest<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, "POST", { refreshToken })

  storeAuthData(response)
  return response
}

// Request password reset
export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, "POST", { email })
}

// Reset password
export const resetPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>(API_ENDPOINTS.AUTH.RESET_PASSWORD, "POST", { token, newPassword })
}

// Verify email
export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, "POST", { token })
}
