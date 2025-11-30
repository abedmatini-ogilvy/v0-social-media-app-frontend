"use client"

import type React from "react"

import { useState } from "react"
import { Bell, CheckCheck, Clock, FileText, Info, MessageSquare, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Sample notification data
const notifications = [
  {
    id: 1,
    title: "Application Status Update",
    message: "Your application for Digital Literacy Program has been approved.",
    timestamp: "10 minutes ago",
    type: "application",
    read: false,
  },
  {
    id: 2,
    title: "New Message",
    message: "Priya Sharma sent you a message regarding the community cleanup event.",
    timestamp: "1 hour ago",
    type: "message",
    read: false,
  },
  {
    id: 3,
    title: "New Scheme Announced",
    message: "PM Kisan Samman Nidhi applications are now open. Check if you're eligible.",
    timestamp: "3 hours ago",
    type: "scheme",
    read: false,
  },
  {
    id: 4,
    title: "Event Reminder",
    message: "Digital Literacy Workshop starts tomorrow at 10 AM. Don't forget to attend!",
    timestamp: "5 hours ago",
    type: "event",
    read: true,
  },
  {
    id: 5,
    title: "Connection Request",
    message: "Amit Patel wants to connect with you.",
    timestamp: "1 day ago",
    type: "connection",
    read: true,
  },
]

export default function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [userNotifications, setUserNotifications] = useState(notifications)

  const unreadCount = userNotifications.filter((n) => !n.read).length

  const filteredNotifications = userNotifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    if (activeTab === "read") return notification.read
    return true
  })

  const markAsRead = (id: number) => {
    setUserNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setUserNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const dismissNotification = (id: number) => {
    setUserNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "application":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      case "scheme":
        return <Info className="h-4 w-4 text-green-500" />
      case "event":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "connection":
        return <User className="h-4 w-4 text-teal-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

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
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
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

          <TabsContent value="all" className="mt-0 max-h-[350px] overflow-y-auto">
            <NotificationList
              notifications={filteredNotifications}
              markAsRead={markAsRead}
              dismissNotification={dismissNotification}
              getNotificationIcon={getNotificationIcon}
            />
          </TabsContent>

          <TabsContent value="unread" className="mt-0 max-h-[350px] overflow-y-auto">
            <NotificationList
              notifications={filteredNotifications}
              markAsRead={markAsRead}
              dismissNotification={dismissNotification}
              getNotificationIcon={getNotificationIcon}
            />
          </TabsContent>

          <TabsContent value="read" className="mt-0 max-h-[350px] overflow-y-auto">
            <NotificationList
              notifications={filteredNotifications}
              markAsRead={markAsRead}
              dismissNotification={dismissNotification}
              getNotificationIcon={getNotificationIcon}
            />
          </TabsContent>
        </Tabs>

        <div className="p-2 border-t border-gray-100 dark:border-gray-800">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            onClick={() => setOpen(false)}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface NotificationListProps {
  notifications: typeof notifications
  markAsRead: (id: number) => void
  dismissNotification: (id: number) => void
  getNotificationIcon: (type: string) => React.ReactNode
}

function NotificationList({
  notifications,
  markAsRead,
  dismissNotification,
  getNotificationIcon,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <Bell className="h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">No notifications to display</p>
      </div>
    )
  }

  return (
    <div>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "p-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50 relative",
            !notification.read && "bg-purple-50 dark:bg-purple-900/10",
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
                  {!notification.read && <Badge className="h-2 w-2 rounded-full bg-purple-500 p-0 mr-2" />}
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
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{notification.timestamp}</span>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 py-0 px-2"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
