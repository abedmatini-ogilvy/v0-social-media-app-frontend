"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  CheckCheck,
  FileText,
  Info,
  MessageSquare,
  User,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/api-service";
import { getToken } from "@/lib/auth-service";
import type { Notification } from "@/lib/types";
import Link from "next/link";

// Helper to format timestamp
function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [userNotifications, setUserNotifications] = useState<Notification[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [markingReadId, setMarkingReadId] = useState<string | null>(null);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUserNotifications([]);
      return;
    }

    setIsLoading(true);
    try {
      const notifications = await getNotifications(token);
      setUserNotifications(notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setUserNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount and when popover opens
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Refresh when popover opens
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  // Refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const filteredNotifications = userNotifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    if (activeTab === "read") return notification.isRead;
    return true;
  });

  const markAsRead = async (id: string) => {
    const token = getToken();
    if (!token) return;

    setMarkingReadId(id);
    try {
      await markNotificationAsRead(id, token);
      setUserNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    } finally {
      setMarkingReadId(null);
    }
  };

  const markAllAsRead = async () => {
    const token = getToken();
    if (!token) return;

    setMarkingAllRead(true);
    try {
      await markAllNotificationsAsRead(token);
      setUserNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      setMarkingAllRead(false);
    }
  };

  const dismissNotification = (id: string) => {
    setUserNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "application":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "message":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case "alert":
        return <Bell className="h-4 w-4 text-red-500" />;
      case "system":
        return <Info className="h-4 w-4 text-green-500" />;
      case "connection":
        return <User className="h-4 w-4 text-teal-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              onClick={markAllAsRead}
              disabled={markingAllRead}
            >
              {markingAllRead ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <CheckCheck className="h-3 w-3 mr-1" />
              )}
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 bg-gray-50 dark:bg-gray-900 p-1 rounded-none border-b border-gray-100 dark:border-gray-800">
            <TabsTrigger
              value="all"
              className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger
              value="read"
              className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              Read
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="all"
            className="mt-0 max-h-[350px] overflow-y-auto"
          >
            <NotificationList
              notifications={filteredNotifications}
              markAsRead={markAsRead}
              dismissNotification={dismissNotification}
              getNotificationIcon={getNotificationIcon}
              markingReadId={markingReadId}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent
            value="unread"
            className="mt-0 max-h-[350px] overflow-y-auto"
          >
            <NotificationList
              notifications={filteredNotifications}
              markAsRead={markAsRead}
              dismissNotification={dismissNotification}
              getNotificationIcon={getNotificationIcon}
              markingReadId={markingReadId}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent
            value="read"
            className="mt-0 max-h-[350px] overflow-y-auto"
          >
            <NotificationList
              notifications={filteredNotifications}
              markAsRead={markAsRead}
              dismissNotification={dismissNotification}
              getNotificationIcon={getNotificationIcon}
              markingReadId={markingReadId}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>

        <div className="p-2 border-t border-gray-100 dark:border-gray-800">
          <Link href="/notifications" onClick={() => setOpen(false)}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              View all notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface NotificationListProps {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  getNotificationIcon: (type: string) => React.ReactNode;
  markingReadId: string | null;
  isLoading: boolean;
}

function NotificationList({
  notifications,
  markAsRead,
  dismissNotification,
  getNotificationIcon,
  markingReadId,
  isLoading,
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <Loader2 className="h-8 w-8 text-purple-400 mb-2 animate-spin" />
        <p className="text-sm text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <Bell className="h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">No notifications to display</p>
      </div>
    );
  }

  return (
    <div>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "p-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50 relative",
            !notification.isRead && "bg-purple-50 dark:bg-purple-900/10"
          )}
        >
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-medium">{notification.title}</h4>
                <div className="flex items-center">
                  {!notification.isRead && (
                    <Badge className="h-2 w-2 rounded-full bg-purple-500 p-0 mr-2" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-gray-500"
                    onClick={() => dismissNotification(notification.id)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {notification.content}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {formatTimestamp(notification.createdAt)}
                </span>
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 py-0 px-2"
                    onClick={() => markAsRead(notification.id)}
                    disabled={markingReadId === notification.id}
                  >
                    {markingReadId === notification.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Mark as read"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
