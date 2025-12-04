"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Home,
  User,
  MessageSquare,
  Bell,
  FileText,
  Briefcase,
  Calendar,
  Settings,
  Bookmark,
  Users,
  Shield,
  LogIn,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { getNotifications, getConversations } from "@/lib/api-service";
import { getToken } from "@/lib/auth-service";

const serviceLinks = [
  { href: "/schemes", icon: FileText, label: "Government Schemes" },
  { href: "/jobs", icon: Briefcase, label: "Job Opportunities" },
  { href: "/events", icon: Calendar, label: "Community Events" },
];

const quickLinks = [
  { href: "/saved", icon: Bookmark, label: "Saved Items" },
  { href: "/connections", icon: Users, label: "My Connections" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function LeftSidebar() {
  const pathname = usePathname();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  // Fetch notification and message counts from API
  useEffect(() => {
    const fetchCounts = async () => {
      const token = getToken();
      if (!token) {
        setNotificationCount(0);
        setMessageCount(0);
        return;
      }

      try {
        // Fetch notifications
        const notifications = await getNotifications(token);
        const unreadNotifications = notifications.filter(
          (n) => !n.isRead
        ).length;
        setNotificationCount(unreadNotifications);

        // Fetch conversations for unread messages
        const conversations = await getConversations(token);
        const unreadMessages = conversations.reduce(
          (count, conv) => count + (conv.unreadCount || 0),
          0
        );
        setMessageCount(unreadMessages);
      } catch (error) {
        console.error("Failed to fetch counts:", error);
        setNotificationCount(0);
        setMessageCount(0);
      }
    };

    fetchCounts();

    // Refresh counts every 30 seconds
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Navigation links with dynamic counts
  const navigationLinks = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/profile", icon: User, label: "My Profile" },
    {
      href: "/messages",
      icon: MessageSquare,
      label: "Messages",
      badge: messageCount,
    },
    {
      href: "/notifications",
      icon: Bell,
      label: "Notifications",
      badge: notificationCount,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Helper to get user initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* Profile Card - LinkedIn inspired */}
      <Card className="border-purple-100 shadow-md overflow-hidden">
        {/* Cover/Banner */}
        <div className="h-16 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500" />

        {/* Profile Info */}
        <CardContent className="pt-0 pb-4">
          {/* Loading State */}
          {isLoading ? (
            <>
              <div className="flex justify-center -mt-8 mb-3">
                <Skeleton className="h-16 w-16 rounded-full border-4 border-white" />
              </div>
              <div className="text-center space-y-2">
                <Skeleton className="h-5 w-32 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
                <Skeleton className="h-3 w-28 mx-auto" />
                <Skeleton className="h-5 w-16 mx-auto mt-2" />
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </>
          ) : isLoggedIn && user ? (
            /* Logged In State */
            <>
              {/* Avatar - overlapping the banner */}
              <div className="flex justify-center -mt-8 mb-3">
                <Link href="/profile">
                  <Avatar className="h-16 w-16 border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity">
                    <AvatarImage
                      src={user.avatar || "/placeholder-user.jpg"}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>

              {/* Name and Details */}
              <div className="text-center">
                <Link href="/profile" className="hover:underline">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {user.name}
                  </h3>
                </Link>
                {user.occupation && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.occupation}
                  </p>
                )}
                {user.location && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {user.location}
                  </p>
                )}

                {/* Role Badge */}
                <div className="mt-2">
                  {user.role === "official" ? (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0">
                      <Shield className="h-3 w-3 mr-1" />
                      Government Official
                    </Badge>
                  ) : user.role === "admin" ? (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-0">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Citizen
                    </Badge>
                  )}
                </div>
              </div>

              {/* Stats - LinkedIn inspired */}
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-2 text-center">
                <Link
                  href="/connections"
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
                >
                  <p className="text-lg font-semibold text-purple-600">
                    {user.connections ?? 0}
                  </p>
                  <p className="text-xs text-gray-500">Connections</p>
                </Link>
                <div className="hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors cursor-pointer">
                  <p className="text-lg font-semibold text-blue-600">—</p>
                  <p className="text-xs text-gray-500">Profile Views</p>
                </div>
              </div>
            </>
          ) : (
            /* Guest State - Not Logged In */
            <>
              <div className="flex justify-center -mt-8 mb-3">
                <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                  <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-500">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="text-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Welcome!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Sign in to access your profile
                </p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Link href="/login" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation Links - Facebook inspired */}
      <Card className="border-purple-100 shadow-md">
        <CardContent className="p-2">
          <nav className="space-y-1">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-5 w-5 ${
                        active ? "text-purple-600" : "text-gray-500"
                      }`}
                    />
                    <span className="text-sm font-medium">{link.label}</span>
                  </div>
                  {link.badge !== undefined && link.badge > 0 && (
                    <Badge className="bg-red-500 text-white text-xs h-5 min-w-[20px] flex items-center justify-center">
                      {link.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </CardContent>
      </Card>

      {/* Services Section - Civic specific */}
      <Card className="border-purple-100 shadow-md">
        <CardContent className="p-2">
          <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Services
          </p>
          <nav className="space-y-1">
            {serviceLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      active ? "text-purple-600" : "text-gray-500"
                    }`}
                  />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="border-purple-100 shadow-md">
        <CardContent className="p-2">
          <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Quick Links
          </p>
          <nav className="space-y-1">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      active ? "text-purple-600" : "text-gray-500"
                    }`}
                  />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="px-3 text-xs text-gray-400 space-y-1">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <span>•</span>
          <Link href="/help" className="hover:underline">
            Help
          </Link>
          <span>•</span>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </div>
        <p>© 2025 More & More Network</p>
      </div>
    </div>
  );
}
