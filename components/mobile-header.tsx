"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, LogOut, User, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useAuth } from "@/components/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MobileHeader() {
  const { user, isLoggedIn, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex md:hidden items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2 shadow-sm">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="More & More Network"
          width={150}
          height={28}
          className="h-7 w-auto"
          priority
        />
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[85%] sm:w-[350px] pt-10 border-l-purple-200"
          >
            <SheetHeader className="text-left mb-6">
              <SheetTitle className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="More & More Network"
                  width={150}
                  height={28}
                  className="h-7 w-auto"
                />
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-6">
              {/* User Profile Section */}
              {isLoading ? (
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                  </div>
                </div>
              ) : isLoggedIn && user ? (
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {user.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sign in to access all features
                  </p>
                  <div className="flex gap-2">
                    <SheetClose asChild>
                      <Link href="/login" className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400"
                        >
                          <LogIn className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/signup" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Sign Up
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              )}

              {/* Navigation Links - Only show when logged in */}
              {isLoggedIn && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-500">Account</h3>
                  <div className="space-y-1">
                    <SheetClose asChild>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 text-sm py-2 text-purple-600 dark:text-purple-400"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">Explore</h3>
                <div className="space-y-1">
                  <SheetClose asChild>
                    <Link
                      href="/schemes"
                      className="block text-sm py-2 text-purple-600 dark:text-purple-400"
                    >
                      Government Schemes
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/jobs"
                      className="block text-sm py-2 text-purple-600 dark:text-purple-400"
                    >
                      Jobs & Opportunities
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/events"
                      className="block text-sm py-2 text-purple-600 dark:text-purple-400"
                    >
                      Events
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/community"
                      className="block text-sm py-2 text-purple-600 dark:text-purple-400"
                    >
                      Community
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/help"
                      className="block text-sm py-2 text-purple-600 dark:text-purple-400"
                    >
                      Help & Support
                    </Link>
                  </SheetClose>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <SheetClose asChild>
                      <Link
                        href="/settings"
                        className="block text-sm py-2 text-purple-600 dark:text-purple-400"
                      >
                        Account Settings
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full text-sm py-2 text-red-600 dark:text-red-400"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </SheetClose>
                  </div>
                ) : (
                  <SheetClose asChild>
                    <Link
                      href="/settings"
                      className="block text-sm py-2 text-purple-600 dark:text-purple-400"
                    >
                      Settings
                    </Link>
                  </SheetClose>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
