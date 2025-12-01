"use client"

import { useState, useEffect, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ArrowLeft, Bell, Calendar, CheckCircle, FileText, MessageCircle, UserPlus, Loader2 } from "lucide-react"
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/api-service"
import { getToken } from "@/lib/auth-service"
import { useAuth } from "@/components/auth-provider"
import type { Notification } from "@/lib/types"
import { toast } from "sonner"

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Emergency Alert: Heavy Rainfall",
    content: "Heavy rainfall expected in Mumbai region for next 48 hours. Please stay indoors.",
    isRead: false,
    userId: "1",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    type: "connection",
    title: "New Connection Request",
    content: "Priya Sharma (Community Organizer) wants to connect with you",
    isRead: false,
    userId: "1",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    type: "application",
    title: "Application Approved",
    content: "Your application for Digital Literacy Program has been approved. Classes start June 15.",
    isRead: false,
    actionUrl: "/schemes/1",
    userId: "1",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    type: "message",
    title: "New Comment",
    content: "Amit Patel commented: \"Great initiative! I'll be joining the workshop too.\"",
    isRead: true,
    userId: "1",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    type: "system",
    title: "Upcoming Event Reminder",
    content: "Digital Literacy Workshop is tomorrow at 10:00 AM at Community Center.",
    isRead: true,
    actionUrl: "/events/1",
    userId: "1",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
]

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "alert": return <Bell className="h-5 w-5" />
    case "connection": return <UserPlus className="h-5 w-5" />
    case "application": return <CheckCircle className="h-5 w-5" />
    case "message": return <MessageCircle className="h-5 w-5" />
    case "system": return <Calendar className="h-5 w-5" />
    default: return <FileText className="h-5 w-5" />
  }
}

function getNotificationColor(type: string) {
  switch (type) {
    case "alert": return { bg: "bg-red-50", border: "border-red-500", icon: "bg-red-100 text-red-600", text: "text-red-800" }
    case "connection": return { bg: "", border: "border-purple-300", icon: "bg-purple-100 text-purple-600", text: "" }
    case "application": return { bg: "", border: "border-green-300", icon: "bg-green-100 text-green-600", text: "" }
    case "message": return { bg: "", border: "border-blue-300", icon: "bg-blue-100 text-blue-600", text: "" }
    case "system": return { bg: "", border: "border-orange-300", icon: "bg-orange-100 text-orange-600", text: "" }
    default: return { bg: "", border: "border-gray-300", icon: "bg-gray-100 text-gray-600", text: "" }
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [markingReadId, setMarkingReadId] = useState<string | null>(null)
  const [markingAllRead, setMarkingAllRead] = useState(false)
  const { isLoggedIn } = useAuth()

  const fetchNotifications = useCallback(async () => {
    if (!isLoggedIn) {
      setNotifications(mockNotifications)
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    const token = getToken()
    if (!token) {
      setNotifications(mockNotifications)
      setIsLoading(false)
      return
    }
    try {
      const fetchedNotifications = await getNotifications(token)
      setNotifications(fetchedNotifications.length > 0 ? fetchedNotifications : mockNotifications)
    } catch {
      setNotifications(mockNotifications)
    } finally {
      setIsLoading(false)
    }
  }, [isLoggedIn])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleMarkAsRead = async (notificationId: string) => {
    const token = getToken()
    if (!token) return
    setMarkingReadId(notificationId)
    try {
      await markNotificationAsRead(notificationId, token)
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n))
    } catch {
      toast.error("Failed to mark notification as read")
    } finally {
      setMarkingReadId(null)
    }
  }

  const handleMarkAllAsRead = async () => {
    const token = getToken()
    if (!token) return
    setMarkingAllRead(true)
    try {
      await markAllNotificationsAsRead(token)
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      toast.success("All notifications marked as read")
    } catch {
      toast.error("Failed to mark all as read")
    } finally {
      setMarkingAllRead(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
  const alertNotifications = notifications.filter(n => n.type === "alert")
  const socialNotifications = notifications.filter(n => n.type === "connection" || n.type === "message")
  const schemeNotifications = notifications.filter(n => n.type === "application" || n.type === "system")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderNotification = (notification: Notification) => {
    const colors = getNotificationColor(notification.type)
    return (
      <div
        key={notification.id}
        className={`p-3 ${colors.bg} border-l-4 ${colors.border} rounded-md flex items-start gap-3 ${!notification.isRead ? "bg-gray-50" : ""}`}
      >
        <div className={`h-10 w-10 rounded-full ${colors.icon} flex items-center justify-center flex-shrink-0`}>
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1">
          <p className={`font-medium ${colors.text}`}>{notification.title}</p>
          <p className="text-sm text-gray-500 mt-1">{notification.content}</p>
          <div className="flex items-center gap-2 mt-2">
            {notification.actionUrl && (
              <Button size="sm" variant="outline" className="h-8" asChild>
                <Link href={notification.actionUrl}>View Details</Link>
              </Button>
            )}
            {!notification.isRead && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 text-xs"
                onClick={() => handleMarkAsRead(notification.id)}
                disabled={markingReadId === notification.id}
              >
                {markingReadId === notification.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Mark as read"}
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">{formatTimestamp(notification.createdAt)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center text-purple-700 hover:text-purple-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && <p className="text-sm text-gray-500">{unreadCount} unread</p>}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={handleMarkAllAsRead}
            disabled={markingAllRead || unreadCount === 0}
          >
            {markingAllRead ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Mark All as Read
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6 bg-purple-100 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              Alerts
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              Social
            </TabsTrigger>
            <TabsTrigger value="schemes" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              Schemes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="border-purple-100 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-purple-600" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No notifications</div>
                  ) : (
                    notifications.map(renderNotification)
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card className="border-purple-100 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-red-600" />
                  Emergency Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {alertNotifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No alerts</div>
                  ) : (
                    alertNotifications.map(renderNotification)
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card className="border-purple-100 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <UserPlus className="h-5 w-5 mr-2 text-purple-600" />
                  Social Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {socialNotifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No social notifications</div>
                  ) : (
                    socialNotifications.map(renderNotification)
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schemes">
            <Card className="border-purple-100 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Scheme Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {schemeNotifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No scheme notifications</div>
                  ) : (
                    schemeNotifications.map(renderNotification)
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
