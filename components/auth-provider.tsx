"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  getToken,
  getUser,
  isAuthenticated,
  loginUser,
  registerUser,
  logoutUser,
  refreshAuthToken,
  clearAuthData,
  type User,
  type AuthResponse,
} from "@/lib/auth-service"
import { toast } from "sonner"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: "citizen" | "official"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/login", "/signup", "/schemes", "/jobs", "/forgot-password"]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = getUser()
        const authenticated = isAuthenticated()

        if (authenticated && storedUser) {
          setUser(storedUser)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // Redirect unauthenticated users from protected routes
  useEffect(() => {
    if (!isLoading && !user && !PUBLIC_ROUTES.includes(pathname)) {
      // Check if the path starts with any public route patterns
      const isPublicPath = PUBLIC_ROUTES.some(route => pathname.startsWith(route + "/") || pathname === route)
      if (!isPublicPath) {
        router.push("/login")
      }
    }
  }, [isLoading, user, pathname, router])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response: AuthResponse = await loginUser(email, password)
      setUser(response.user)
      toast.success("Login successful!")
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again."
      toast.error(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response: AuthResponse = await registerUser(userData)
      setUser(response.user)
      toast.success("Registration successful!")
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed. Please try again."
      toast.error(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      await logoutUser()
      setUser(null)
      toast.success("Logged out successfully")
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      // Even if logout fails on server, clear local data
      clearAuthData()
      setUser(null)
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const response = await refreshAuthToken()
      setUser(response.user)
    } catch (error) {
      console.error("Failed to refresh user:", error)
      // Token refresh failed, user needs to login again
      clearAuthData()
      setUser(null)
    }
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
