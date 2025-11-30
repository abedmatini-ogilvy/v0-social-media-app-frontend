"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import LanguageSwitcher from "@/components/language-switcher"
import EmergencyAlert from "@/components/emergency-alert"
import SocialFeed from "@/components/social-feed"
import MobileHeader from "@/components/mobile-header"
import MobileFooterNav from "@/components/mobile-footer-nav"
import MobileTabs from "@/components/mobile-tabs"
import Sidebar from "@/components/sidebar"
import { Bell, Search, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function HomePage() {
  const { user, isLoggedIn, logout, isLoading } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 pb-16 md:pb-0">
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 hidden md:flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2 shadow-sm">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mr-2">
              <span className="text-white font-bold">CC</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              CivicConnect
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-64 rounded-full bg-gray-100 dark:bg-gray-800 px-4 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white dark:focus:bg-gray-700 transition-all"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </Link>

          <LanguageSwitcher />
          <ThemeToggle />

          {isLoading ? (
            <div className="h-8 w-20 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
          ) : isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 rounded-full px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                      {user.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-sm font-medium hidden lg:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950"
              >
                <Link href="/login">Login</Link>
              </Button>

              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Mobile Header */}
      <MobileHeader />

      <main className="container mx-auto px-4 py-4">
        {/* Emergency Alert */}
        <EmergencyAlert
          title="Heavy Rainfall Alert"
          message="Heavy rainfall expected in Mumbai region for next 48 hours. Please stay indoors and avoid unnecessary travel."
          authority="Mumbai Meteorological Department"
          timestamp="2 hours ago"
        />

        <div className="flex flex-col md:flex-row gap-6 w-full mt-4">
          {/* Mobile Tabs - Only visible on mobile */}
          <MobileTabs />

          {/* Main Content - Social Feed */}
          <div className="flex-1 order-2 md:order-1 mt-6 md:mt-0">
            <SocialFeed />
          </div>

          {/* Desktop Sidebar - Only visible on desktop */}
          <div className="md:w-80 w-full order-1 md:order-2 hidden md:block">
            <div className="space-y-6 md:sticky md:top-20">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Footer Navigation */}
      <MobileFooterNav />
    </div>
  )
}
