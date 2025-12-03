"use client"

import { Switch } from "@/components/ui/switch"
import { CardFooter } from "@/components/ui/card"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BarChart3, Bell, ChevronDown, Flag, Home, Search, Settings, Shield, User, Users, Ban, Loader2, MoreHorizontal, Key, UserCheck, Trash2, Calendar, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  User as UserType,
  Report,
  Announcement,
  AdminOverviewStats,
  ReportStatus,
  ReportAction,
  AnnouncementPriority,
  Event,
} from "@/lib/types"
import {
  getOverviewStats,
  getAdminUsers,
  getAdminReports,
  getAdminAnnouncements,
  reviewReport,
  banUser,
  unbanUser,
  suspendUser,
  updateAdminUser,
  deleteAdminUser,
  resetUserPassword,
  createAnnouncement,
  publishAnnouncement,
  deleteAnnouncement,
} from "@/lib/admin-api-service"
import {
  getEvents,
  adminCreateEvent,
  adminUpdateEvent,
  adminDeleteEvent,
  adminGetEventAttendees,
  type CreateEventData,
  type EventAttendee,
} from "@/lib/api-service"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  
  // Data states
  const [stats, setStats] = useState<AdminOverviewStats | null>(null)
  const [users, setUsers] = useState<UserType[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [reportFilter, setReportFilter] = useState<string>("all")
  
  // Events state
  const [events, setEvents] = useState<Event[]>([])
  
  // Announcement form state
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    department: "",
    priority: "medium" as AnnouncementPriority,
    audience: "all",
  })

  // Event form state
  const [newEvent, setNewEvent] = useState<CreateEventData>({
    title: "",
    description: "",
    date: "",
    location: "",
    organizer: "",
  })
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [viewingAttendees, setViewingAttendees] = useState<{ eventId: string; eventTitle: string; attendees: EventAttendee[] } | null>(null)
  const [loadingAttendees, setLoadingAttendees] = useState(false)

  // Check authentication and admin role
  useEffect(() => {
    const storedToken = localStorage.getItem("civicconnect_token")
    const storedUser = localStorage.getItem("civicconnect_user")
    
    if (!storedToken || !storedUser) {
      router.push("/login")
      return
    }
    
    const user = JSON.parse(storedUser) as UserType
    if (user.role !== "admin") {
      toast.error("Access denied. Admin privileges required.")
      router.push("/")
      return
    }
    
    setToken(storedToken)
    setCurrentUser(user)
  }, [router])

  // Fetch data when token is available
  const fetchData = useCallback(async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const [statsData, usersData, reportsData, announcementsData, eventsData] = await Promise.all([
        getOverviewStats(token),
        getAdminUsers(token, { limit: 50 }),
        getAdminReports(token, { limit: 50 }),
        getAdminAnnouncements(token, { limit: 50 }),
        getEvents(),
      ])
      
      setStats(statsData)
      setUsers(usersData.users)
      setReports(reportsData.reports)
      setAnnouncements(announcementsData.announcements)
      setEvents(eventsData)
    } catch (error) {
      console.error("Failed to fetch admin data:", error)
      toast.error("Failed to load admin data")
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [token, fetchData])

  // Handle report actions
  const handleReviewReport = async (reportId: string, status: ReportStatus, action?: ReportAction) => {
    if (!token) return
    try {
      await reviewReport(token, reportId, { status, action })
      toast.success("Report reviewed successfully")
      fetchData()
    } catch (error) {
      toast.error("Failed to review report")
    }
  }

  // Handle user actions
  const handleBanUser = async (userId: string, reason?: string) => {
    if (!token) return
    try {
      await banUser(token, userId, reason)
      toast.success("User banned successfully")
      fetchData()
    } catch (error) {
      toast.error("Failed to ban user")
    }
  }

  const handleUnbanUser = async (userId: string) => {
    if (!token) return
    try {
      await unbanUser(token, userId)
      toast.success("User unbanned successfully")
      fetchData()
    } catch (error) {
      toast.error("Failed to unban user")
    }
  }

  const handleVerifyUser = async (userId: string, isVerified: boolean) => {
    if (!token) return
    try {
      await updateAdminUser(token, userId, { isVerified })
      toast.success(isVerified ? "User verified" : "User unverified")
      fetchData()
    } catch (error) {
      toast.error("Failed to update user")
    }
  }

  // Handle announcement actions
  const handleCreateAnnouncement = async () => {
    if (!token || !newAnnouncement.title || !newAnnouncement.content) {
      toast.error("Title and content are required")
      return
    }
    try {
      await createAnnouncement(token, newAnnouncement)
      toast.success("Announcement created successfully")
      setNewAnnouncement({ title: "", content: "", department: "", priority: "medium", audience: "all" })
      fetchData()
    } catch (error) {
      toast.error("Failed to create announcement")
    }
  }

  const handlePublishAnnouncement = async (announcementId: string) => {
    if (!token) return
    try {
      await publishAnnouncement(token, announcementId)
      toast.success("Announcement published")
      fetchData()
    } catch (error) {
      toast.error("Failed to publish announcement")
    }
  }

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (!token) return
    try {
      await deleteAnnouncement(token, announcementId)
      toast.success("Announcement deleted")
      fetchData()
    } catch (error) {
      toast.error("Failed to delete announcement")
    }
  }

  // Handle event actions
  const handleCreateEvent = async () => {
    if (!token || !newEvent.title || !newEvent.description || !newEvent.date || !newEvent.location || !newEvent.organizer) {
      toast.error("All fields are required")
      return
    }
    try {
      await adminCreateEvent(newEvent, token)
      toast.success("Event created successfully")
      setNewEvent({ title: "", description: "", date: "", location: "", organizer: "" })
      fetchData()
    } catch (error) {
      toast.error("Failed to create event")
    }
  }

  const handleUpdateEvent = async () => {
    if (!token || !editingEvent) return
    try {
      await adminUpdateEvent(editingEvent.id, {
        title: editingEvent.title,
        description: editingEvent.description,
        date: editingEvent.date,
        location: editingEvent.location,
        organizer: editingEvent.organizer,
      }, token)
      toast.success("Event updated successfully")
      setEditingEvent(null)
      fetchData()
    } catch (error) {
      toast.error("Failed to update event")
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!token) return
    try {
      await adminDeleteEvent(eventId, token)
      toast.success("Event deleted successfully")
      fetchData()
    } catch (error) {
      toast.error("Failed to delete event")
    }
  }

  const handleViewAttendees = async (eventId: string, eventTitle: string) => {
    if (!token) return
    setLoadingAttendees(true)
    try {
      const data = await adminGetEventAttendees(eventId, token)
      setViewingAttendees({ eventId, eventTitle, attendees: data.attendees })
    } catch (error) {
      toast.error("Failed to fetch attendees")
    } finally {
      setLoadingAttendees(false)
    }
  }

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    if (!token) return
    try {
      await deleteAdminUser(token, userId)
      toast.success("User deleted successfully")
      fetchData()
    } catch (error) {
      toast.error("Failed to delete user")
    }
  }

  // Handle reset password
  const handleResetPassword = async (userId: string, newPassword: string) => {
    if (!token) return
    try {
      await resetUserPassword(token, userId, newPassword)
      toast.success("Password reset successfully")
    } catch (error) {
      toast.error("Failed to reset password")
    }
  }

  // Filter reports
  const filteredReports = reportFilter === "all" 
    ? reports 
    : reports.filter(r => r.status === reportFilter)

  // Loading state
  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mr-2">
                <span className="text-white font-bold">CC</span>
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Admin Panel
              </h1>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === "overview"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                <Home className="h-5 w-5 mr-2" />
                Overview
              </Button>

              <Button
                variant={activeTab === "users" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === "users"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    : ""
                }`}
                onClick={() => setActiveTab("users")}
              >
                <Users className="h-5 w-5 mr-2" />
                User Management
              </Button>

              <Button
                variant={activeTab === "content" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === "content"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    : ""
                }`}
                onClick={() => setActiveTab("content")}
              >
                <Flag className="h-5 w-5 mr-2" />
                Content Moderation
              </Button>

              <Button
                variant={activeTab === "verification" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === "verification"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    : ""
                }`}
                onClick={() => setActiveTab("verification")}
              >
                <Shield className="h-5 w-5 mr-2" />
                Verification Requests
              </Button>

              <Button
                variant={activeTab === "announcements" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === "announcements"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    : ""
                }`}
                onClick={() => setActiveTab("announcements")}
              >
                <Bell className="h-5 w-5 mr-2" />
                Announcements
              </Button>

              <Button
                variant={activeTab === "events" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === "events"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    : ""
                }`}
                onClick={() => setActiveTab("events")}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Events
              </Button>

              <Button
                variant={activeTab === "analytics" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === "analytics"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    : ""
                }`}
                onClick={() => setActiveTab("analytics")}
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Analytics
              </Button>

              <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === "settings"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    : ""
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </Button>
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={currentUser?.avatar || "/placeholder.svg?height=32&width=32"} alt="Admin" />
                <AvatarFallback className="bg-purple-700">{currentUser?.name?.[0] || "A"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{currentUser?.name || "Admin User"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center md:hidden">
                <Button variant="ghost" size="icon">
                  <ChevronDown className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-bold ml-2">Admin Panel</h1>
              </div>

              <div className="flex-1 max-w-md mx-4 hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    className="pl-9 border-gray-200 dark:border-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                    5
                  </span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                        <AvatarFallback className="bg-purple-700">AD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/">Back to CivicConnect</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-950">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Dashboard Overview</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total Users</CardTitle>
                      <CardDescription>Active users on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats?.totalUsers?.toLocaleString() || 0}</div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">+{stats?.newUsersToday || 0} new today</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Verified Officials</CardTitle>
                      <CardDescription>Government officials on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats?.verifiedOfficials?.toLocaleString() || 0}</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Verified accounts</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total Posts</CardTitle>
                      <CardDescription>Content on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats?.totalPosts?.toLocaleString() || 0}</div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">+{stats?.newPostsToday || 0} new today</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Pending Reports</CardTitle>
                      <CardDescription>Content moderation needed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats?.pendingReports || 0}</div>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{stats?.bannedUsers || 0} users banned</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader>
                      <CardTitle>Recent Users</CardTitle>
                      <CardDescription>Latest registered users</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-4">
                          {users.slice(0, 5).map((user) => (
                            <div key={user.id} className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium">{user.name}</p>
                                  {user.isVerified && (
                                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {user.role} • Joined {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              {user.isBanned && (
                                <Badge variant="destructive" className="text-xs">Banned</Badge>
                              )}
                            </div>
                          ))}
                          {users.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No users found</p>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader>
                      <CardTitle>Pending Tasks</CardTitle>
                      <CardDescription>Tasks requiring your attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-4">
                          {(stats?.pendingReports || 0) > 0 && (
                            <div className="p-3 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-900/20">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-red-800 dark:text-red-400">Content Moderation</p>
                                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                    {stats?.pendingReports} reports pending review
                                  </p>
                                </div>
                                <Badge className="bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300">
                                  Urgent
                                </Badge>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 border-red-300 text-red-700 dark:border-red-800 dark:text-red-400"
                                onClick={() => setActiveTab("content")}
                              >
                                Review Now
                              </Button>
                            </div>
                          )}

                          {users.filter(u => u.role === "official" && !u.isVerified).length > 0 && (
                            <div className="p-3 border border-orange-200 dark:border-orange-900 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-orange-800 dark:text-orange-400">
                                    Verification Requests
                                  </p>
                                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                                    {users.filter(u => u.role === "official" && !u.isVerified).length} officials waiting for verification
                                  </p>
                                </div>
                                <Badge className="bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                  High
                                </Badge>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 border-orange-300 text-orange-700 dark:border-orange-800 dark:text-orange-400"
                                onClick={() => setActiveTab("verification")}
                              >
                                Review Now
                              </Button>
                            </div>
                          )}

                          {announcements.filter(a => a.status === "draft").length > 0 && (
                            <div className="p-3 border border-blue-200 dark:border-blue-900 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-blue-800 dark:text-blue-400">Draft Announcements</p>
                                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                    {announcements.filter(a => a.status === "draft").length} announcements ready to publish
                                  </p>
                                </div>
                                <Badge className="bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                  Medium
                                </Badge>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 border-blue-300 text-blue-700 dark:border-blue-800 dark:text-blue-400"
                                onClick={() => setActiveTab("announcements")}
                              >
                                Review Now
                              </Button>
                            </div>
                          )}

                          <div className="p-3 border border-green-200 dark:border-green-900 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-green-800 dark:text-green-400">Platform Stats</p>
                                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                  {stats?.totalUsers || 0} users • {stats?.totalPosts || 0} posts
                                </p>
                              </div>
                              <Badge className="bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Info
                              </Badge>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 border-green-300 text-green-700 dark:border-green-800 dark:text-green-400"
                              onClick={() => setActiveTab("analytics")}
                            >
                              View Analytics
                            </Button>
                          </div>

                          {(stats?.pendingReports || 0) === 0 && 
                           users.filter(u => u.role === "official" && !u.isVerified).length === 0 && 
                           announcements.filter(a => a.status === "draft").length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                              All caught up! No pending tasks.
                            </p>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">User Management</h1>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        className="pl-10 w-[250px] border-purple-200 dark:border-purple-900"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="citizen">Citizens</SelectItem>
                        <SelectItem value="official">Officials</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{users.length}</p>
                          <p className="text-sm text-gray-500">Total Users</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{users.filter(u => u.isVerified).length}</p>
                          <p className="text-sm text-gray-500">Verified</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{users.filter(u => u.role === "official").length}</p>
                          <p className="text-sm text-gray-500">Officials</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <Ban className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{users.filter(u => u.isBanned).length}</p>
                          <p className="text-sm text-gray-500">Banned</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Users Table */}
                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">Role</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">Joined</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users
                            .filter(user => 
                              user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge 
                                  variant={user.role === "admin" ? "default" : user.role === "official" ? "secondary" : "outline"}
                                  className={user.role === "admin" ? "bg-purple-600" : ""}
                                >
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-1">
                                  {user.isVerified && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                      Verified
                                    </Badge>
                                  )}
                                  {user.isBanned && (
                                    <Badge variant="destructive">Banned</Badge>
                                  )}
                                  {!user.isVerified && !user.isBanned && (
                                    <Badge variant="outline">Active</Badge>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex justify-end gap-2">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => handleVerifyUser(user.id, !user.isVerified)}>
                                        <Shield className="h-4 w-4 mr-2" />
                                        {user.isVerified ? "Remove Verification" : "Verify User"}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => {
                                          const newPassword = prompt("Enter new password for user:")
                                          if (newPassword && newPassword.length >= 6) {
                                            handleResetPassword(user.id, newPassword)
                                          } else if (newPassword) {
                                            toast.error("Password must be at least 6 characters")
                                          }
                                        }}
                                      >
                                        <Key className="h-4 w-4 mr-2" />
                                        Reset Password
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      {user.isBanned ? (
                                        <DropdownMenuItem onClick={() => handleUnbanUser(user.id)}>
                                          <UserCheck className="h-4 w-4 mr-2" />
                                          Unban User
                                        </DropdownMenuItem>
                                      ) : (
                                        <DropdownMenuItem 
                                          className="text-orange-600"
                                          onClick={() => {
                                            const reason = prompt("Enter ban reason:")
                                            if (reason) {
                                              handleBanUser(user.id, reason)
                                            }
                                          }}
                                        >
                                          <Ban className="h-4 w-4 mr-2" />
                                          Ban User
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuItem 
                                        className="text-red-600"
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
                                            handleDeleteUser(user.id)
                                          }
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete User
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {users.length === 0 && (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-500">No users found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Content Moderation Tab */}
            {activeTab === "content" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Content Moderation</h1>
                  <div className="flex items-center gap-2">
                    <Select value={reportFilter} onValueChange={setReportFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Reports</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="dismissed">Dismissed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>

                {filteredReports.length === 0 ? (
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardContent className="p-8 text-center">
                      <Flag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No reports found</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        {reportFilter === "all" ? "There are no content reports yet." : `No ${reportFilter} reports.`}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredReports.map((report) => (
                      <Card key={report.id} className="border-purple-100 dark:border-purple-900">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3 mb-3">
                                <Avatar>
                                  <AvatarImage src={report.reporter?.avatar || "/placeholder.svg"} alt={report.reporter?.name || "Reporter"} />
                                  <AvatarFallback>{report.reporter?.name?.[0] || "R"}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">Reported by: {report.reporter?.name || "Unknown"}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {report.contentType === "post" ? "Post" : "Comment"} Report
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(report.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md mb-3">
                                <p className="text-sm font-medium mb-1">Reason: {report.reason}</p>
                                {report.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{report.description}</p>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge
                                  variant="outline"
                                  className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                                >
                                  {report.reason}
                                </Badge>
                                <Badge
                                  variant={
                                    report.status === "pending"
                                      ? "outline"
                                      : report.status === "reviewed"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                  className={
                                    report.status === "pending"
                                      ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                                      : ""
                                  }
                                >
                                  {report.status}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 min-w-[200px]">
                              <Button 
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleReviewReport(report.id, "reviewed", "post_removed")}
                                disabled={report.status !== "pending"}
                              >
                                Remove Content
                              </Button>
                              <Button
                                variant="outline"
                                className="border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-400"
                                onClick={() => handleReviewReport(report.id, "reviewed", "warning")}
                                disabled={report.status !== "pending"}
                              >
                                Warn User
                              </Button>
                              <Button
                                variant="outline"
                                className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
                                onClick={() => handleReviewReport(report.id, "dismissed")}
                                disabled={report.status !== "pending"}
                              >
                                Dismiss Report
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Verification Requests Tab */}
            {activeTab === "verification" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Verification Requests</h1>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="pending">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Requests</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>

                {users.filter(u => u.role === "official" && !u.isVerified).length === 0 ? (
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardContent className="p-8 text-center">
                      <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No verification requests</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        There are no pending verification requests at this time.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {users.filter(u => u.role === "official" && !u.isVerified).map((user) => (
                      <Card key={user.id} className="border-purple-100 dark:border-purple-900">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3 mb-3">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-lg">{user.name}</p>
                                  <p className="text-sm">{user.bio || "Government Official"}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {user.email}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                  <p className="text-sm font-medium">Contact Information</p>
                                  <p className="text-sm">Email: {user.email}</p>
                                  <p className="text-sm">Role: {user.role}</p>
                                </div>

                                <div>
                                  <p className="text-sm font-medium">Account Details</p>
                                  <p className="text-sm">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">Status:</p>
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                                >
                                  Pending Verification
                                </Badge>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 min-w-[200px]">
                              <Button 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleVerifyUser(user.id, true)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                className="border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
                                onClick={() => handleBanUser(user.id, "Verification rejected")}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Announcements Tab */}
            {activeTab === "announcements" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Announcements</h1>
                </div>

                {/* Create Announcement Form */}
                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>Create New Announcement</CardTitle>
                    <CardDescription>Create and publish announcements to citizens</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        placeholder="Enter announcement title"
                        className="border-purple-200 dark:border-purple-900"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Content</label>
                      <Textarea
                        placeholder="Enter announcement content"
                        className="min-h-[100px] border-purple-200 dark:border-purple-900"
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Department</label>
                        <Input
                          placeholder="Enter department"
                          className="border-purple-200 dark:border-purple-900"
                          value={newAnnouncement.department}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, department: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Priority</label>
                        <Select 
                          value={newAnnouncement.priority} 
                          onValueChange={(value: AnnouncementPriority) => setNewAnnouncement({ ...newAnnouncement, priority: value })}
                        >
                          <SelectTrigger className="border-purple-200 dark:border-purple-900">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => setNewAnnouncement({ title: "", content: "", department: "", priority: "medium", audience: "all" })}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={handleCreateAnnouncement}
                    >
                      Create Announcement
                    </Button>
                  </CardFooter>
                </Card>

                {/* Announcements List */}
                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>All Announcements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {announcements.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No announcements yet</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Create your first announcement above.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {announcements.map((announcement) => (
                          <div key={announcement.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{announcement.title}</h3>
                                <p className="text-sm text-gray-500">{announcement.department}</p>
                              </div>
                              <div className="flex gap-2">
                                <Badge
                                  className={
                                    announcement.priority === "high" || announcement.priority === "urgent"
                                      ? "bg-red-100 text-red-800"
                                      : announcement.priority === "medium"
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-green-100 text-green-800"
                                  }
                                >
                                  {announcement.priority}
                                </Badge>
                                <Badge variant={announcement.status === "published" ? "secondary" : "outline"}>
                                  {announcement.status}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{announcement.content}</p>
                            <div className="flex gap-2">
                              {announcement.status === "draft" && (
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handlePublishAnnouncement(announcement.id)}
                                >
                                  Publish
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600"
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Events Management</h1>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {events.length} Events
                  </Badge>
                </div>

                {/* Create/Edit Event Form */}
                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>{editingEvent ? "Edit Event" : "Create New Event"}</CardTitle>
                    <CardDescription>
                      {editingEvent ? "Update event details" : "Create community events for citizens to attend"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Event Title</label>
                        <Input
                          placeholder="Enter event title"
                          className="border-purple-200 dark:border-purple-900"
                          value={editingEvent ? editingEvent.title : newEvent.title}
                          onChange={(e) => editingEvent 
                            ? setEditingEvent({ ...editingEvent, title: e.target.value })
                            : setNewEvent({ ...newEvent, title: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date & Time</label>
                        <Input
                          type="datetime-local"
                          className="border-purple-200 dark:border-purple-900"
                          value={editingEvent 
                            ? new Date(editingEvent.date).toISOString().slice(0, 16) 
                            : newEvent.date
                          }
                          onChange={(e) => editingEvent 
                            ? setEditingEvent({ ...editingEvent, date: e.target.value })
                            : setNewEvent({ ...newEvent, date: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Enter event description"
                        className="min-h-[100px] border-purple-200 dark:border-purple-900"
                        value={editingEvent ? editingEvent.description : newEvent.description}
                        onChange={(e) => editingEvent 
                          ? setEditingEvent({ ...editingEvent, description: e.target.value })
                          : setNewEvent({ ...newEvent, description: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          placeholder="Enter event location"
                          className="border-purple-200 dark:border-purple-900"
                          value={editingEvent ? editingEvent.location : newEvent.location}
                          onChange={(e) => editingEvent 
                            ? setEditingEvent({ ...editingEvent, location: e.target.value })
                            : setNewEvent({ ...newEvent, location: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Organizer</label>
                        <Input
                          placeholder="Enter organizer name"
                          className="border-purple-200 dark:border-purple-900"
                          value={editingEvent ? editingEvent.organizer : newEvent.organizer}
                          onChange={(e) => editingEvent 
                            ? setEditingEvent({ ...editingEvent, organizer: e.target.value })
                            : setNewEvent({ ...newEvent, organizer: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {editingEvent ? (
                      <>
                        <Button 
                          variant="outline"
                          onClick={() => setEditingEvent(null)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                          onClick={handleUpdateEvent}
                        >
                          Update Event
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="outline"
                          onClick={() => setNewEvent({ title: "", description: "", date: "", location: "", organizer: "" })}
                        >
                          Clear
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                          onClick={handleCreateEvent}
                        >
                          Create Event
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>

                {/* Events List */}
                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>All Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {events.length === 0 ? (
                      <div className="p-8 text-center">
                        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No events yet</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Create your first event above.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {events.map((event) => (
                          <div key={event.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium text-lg">{event.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {new Date(event.date).toLocaleDateString("en-US", {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {event.location}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  className={
                                    new Date(event.date) > new Date()
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {new Date(event.date) > new Date() ? "Upcoming" : "Past"}
                                </Badge>
                                <Badge variant="outline">
                                  {event.attendees} attendees
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{event.description}</p>
                            <p className="text-xs text-gray-500 mb-3">Organized by: {event.organizer}</p>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewAttendees(event.id, event.title)}
                                disabled={loadingAttendees}
                              >
                                <Users className="h-4 w-4 mr-1" />
                                View Attendees ({event.attendees})
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingEvent(event)}
                              >
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Attendees Modal/Panel */}
                {viewingAttendees && (
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Attendees for "{viewingAttendees.eventTitle}"</CardTitle>
                        <CardDescription>{viewingAttendees.attendees.length} registered attendees</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setViewingAttendees(null)}
                      >
                        Close
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {viewingAttendees.attendees.length === 0 ? (
                        <div className="p-8 text-center">
                          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-500 dark:text-gray-400">No attendees yet</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                            No one has registered for this event.
                          </p>
                        </div>
                      ) : (
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-3">
                            {viewingAttendees.attendees.map((attendee) => (
                              <div key={attendee.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={attendee.user.avatar || "/placeholder.svg"} alt={attendee.user.name} />
                                  <AvatarFallback>{attendee.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="font-medium">{attendee.user.name}</p>
                                  <p className="text-sm text-gray-500">@{attendee.user.username}</p>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline" className="text-xs">
                                    {attendee.status}
                                  </Badge>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Registered {new Date(attendee.registeredAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total Users</CardTitle>
                      <CardDescription>Registered users</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats?.totalUsers?.toLocaleString() || 0}</div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">+{stats?.newUsersToday || 0} new today</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total Posts</CardTitle>
                      <CardDescription>Content created</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats?.totalPosts?.toLocaleString() || 0}</div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">+{stats?.newPostsToday || 0} new today</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Verified Officials</CardTitle>
                      <CardDescription>Government accounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats?.verifiedOfficials?.toLocaleString() || 0}</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Verified accounts</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Reports</CardTitle>
                      <CardDescription>Content moderation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats?.totalReports || 0}</div>
                      <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">{stats?.pendingReports || 0} pending review</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader>
                      <CardTitle>User Breakdown</CardTitle>
                      <CardDescription>Users by role and status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <span className="font-medium">Citizens</span>
                          <span className="text-lg font-bold">{users.filter(u => u.role === "citizen").length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <span className="font-medium">Officials</span>
                          <span className="text-lg font-bold">{users.filter(u => u.role === "official").length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <span className="font-medium">Admins</span>
                          <span className="text-lg font-bold">{users.filter(u => u.role === "admin").length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                          <span className="font-medium text-red-700 dark:text-red-400">Banned Users</span>
                          <span className="text-lg font-bold text-red-700 dark:text-red-400">{stats?.bannedUsers || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader>
                      <CardTitle>Report Statistics</CardTitle>
                      <CardDescription>Content reports by status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                          <span className="font-medium text-yellow-700 dark:text-yellow-400">Pending</span>
                          <span className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                            {reports.filter(r => r.status === "pending").length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                          <span className="font-medium text-green-700 dark:text-green-400">Reviewed</span>
                          <span className="text-lg font-bold text-green-700 dark:text-green-400">
                            {reports.filter(r => r.status === "reviewed").length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <span className="font-medium">Dismissed</span>
                          <span className="text-lg font-bold">
                            {reports.filter(r => r.status === "dismissed").length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                          <span className="font-medium text-purple-700 dark:text-purple-400">Total Reports</span>
                          <span className="text-lg font-bold text-purple-700 dark:text-purple-400">{stats?.totalReports || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader>
                      <CardTitle>Announcements</CardTitle>
                      <CardDescription>Announcement statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                          <span className="font-medium text-blue-700 dark:text-blue-400">Draft</span>
                          <span className="text-lg font-bold text-blue-700 dark:text-blue-400">
                            {announcements.filter(a => a.status === "draft").length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                          <span className="font-medium text-green-700 dark:text-green-400">Published</span>
                          <span className="text-lg font-bold text-green-700 dark:text-green-400">
                            {announcements.filter(a => a.status === "published").length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <span className="font-medium">Archived</span>
                          <span className="text-lg font-bold">
                            {announcements.filter(a => a.status === "archived").length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                          <span className="font-medium text-purple-700 dark:text-purple-400">Total</span>
                          <span className="text-lg font-bold text-purple-700 dark:text-purple-400">{announcements.length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader>
                      <CardTitle>Quick Stats</CardTitle>
                      <CardDescription>Platform overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <span className="font-medium">Total Comments</span>
                          <span className="text-lg font-bold">{stats?.totalComments?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <span className="font-medium">Unverified Officials</span>
                          <span className="text-lg font-bold">{users.filter(u => u.role === "official" && !u.isVerified).length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <span className="font-medium">Active Announcements</span>
                          <span className="text-lg font-bold">{announcements.filter(a => a.status === "published").length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <span className="font-medium">Pending Reports</span>
                          <span className="text-lg font-bold">{stats?.pendingReports || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Admin Settings</h1>

                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Configure general platform settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Platform Name</label>
                      <Input defaultValue="CivicConnect" className="border-purple-200 dark:border-purple-900" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Contact Email</label>
                      <Input
                        defaultValue="support@civicconnect.in"
                        className="border-purple-200 dark:border-purple-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Support Phone</label>
                      <Input defaultValue="+91 1234 567 890" className="border-purple-200 dark:border-purple-900" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>Admin Users</CardTitle>
                    <CardDescription>Manage admin users and permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Admin Users</h3>
                        <Button variant="outline">Add New Admin</Button>
                      </div>

                      <div className="border rounded-md">
                        <div className="grid grid-cols-4 gap-4 p-3 font-medium border-b">
                          <div>Name</div>
                          <div>Email</div>
                          <div>Role</div>
                          <div>Actions</div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 p-3 border-b">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin User" />
                              <AvatarFallback>AU</AvatarFallback>
                            </Avatar>
                            <span>Admin User</span>
                          </div>
                          <div className="flex items-center">admin@civicconnect.in</div>
                          <div className="flex items-center">
                            <Badge>Super Admin</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 p-3 border-b">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Moderator" />
                              <AvatarFallback>MO</AvatarFallback>
                            </Avatar>
                            <span>Content Moderator</span>
                          </div>
                          <div className="flex items-center">moderator@civicconnect.in</div>
                          <div className="flex items-center">
                            <Badge variant="outline">Moderator</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Analyst" />
                              <AvatarFallback>AN</AvatarFallback>
                            </Avatar>
                            <span>Data Analyst</span>
                          </div>
                          <div className="flex items-center">analyst@civicconnect.in</div>
                          <div className="flex items-center">
                            <Badge variant="outline">Analyst</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Configure security settings for the platform</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Require two-factor authentication for all admin users
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Content Moderation</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enable automatic content moderation for posts and comments
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Login Attempts</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Maximum number of failed login attempts before account lockout
                        </p>
                      </div>
                      <Select defaultValue="5">
                        <SelectTrigger className="w-[100px] border-purple-200 dark:border-purple-900">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Session Timeout</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Automatically log out inactive admin users after a period of time
                        </p>
                      </div>
                      <Select defaultValue="30">
                        <SelectTrigger className="w-[100px] border-purple-200 dark:border-purple-900">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 min</SelectItem>
                          <SelectItem value="30">30 min</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Save Security Settings
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
