"use client"

import { Switch } from "@/components/ui/switch"

import { CardFooter } from "@/components/ui/card"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BarChart3, Bell, ChevronDown, Flag, Home, Search, Settings, Shield, User } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Sample data for flagged content
const flaggedContent = [
  {
    id: 1,
    author: {
      name: "Anonymous User",
      handle: "anonymous123",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "This post contains misleading information about the new water conservation policy.",
    timestamp: "2 hours ago",
    flags: 5,
    reason: "Misinformation",
    status: "pending",
  },
  {
    id: 2,
    author: {
      name: "Rajesh Kumar",
      handle: "rajesh_k",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "This comment contains inappropriate language and personal attacks against a government official.",
    timestamp: "5 hours ago",
    flags: 12,
    reason: "Harassment",
    status: "pending",
  },
  {
    id: 3,
    author: {
      name: "Priya Sharma",
      handle: "priya_s",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "This post is promoting a fake government scheme and asking for personal information.",
    timestamp: "1 day ago",
    flags: 8,
    reason: "Scam",
    status: "pending",
  },
  {
    id: 4,
    author: {
      name: "Amit Patel",
      handle: "amit_p",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "This post contains spam links to external websites.",
    timestamp: "2 days ago",
    flags: 3,
    reason: "Spam",
    status: "resolved",
  },
]

// Sample data for verification requests
const verificationRequests = [
  {
    id: 1,
    name: "Dr. Suresh Mehta",
    position: "Chief Medical Officer",
    department: "Health Department",
    organization: "Mumbai Municipal Corporation",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "suresh.mehta@mumbai.gov.in",
    phone: "+91 9876543210",
    status: "pending",
    documents: ["ID Card", "Appointment Letter", "Aadhaar Card"],
    requestDate: "June 10, 2023",
  },
  {
    id: 2,
    name: "Anita Desai",
    position: "Senior Engineer",
    department: "Public Works Department",
    organization: "Delhi Development Authority",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "anita.desai@dda.gov.in",
    phone: "+91 9876543211",
    status: "pending",
    documents: ["ID Card", "Appointment Letter", "Aadhaar Card"],
    requestDate: "June 9, 2023",
  },
  {
    id: 3,
    name: "Vikram Singh",
    position: "District Collector",
    department: "Revenue Department",
    organization: "Government of Maharashtra",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "vikram.singh@maharashtra.gov.in",
    phone: "+91 9876543212",
    status: "pending",
    documents: ["ID Card", "Appointment Letter", "Aadhaar Card"],
    requestDate: "June 8, 2023",
  },
]

// Sample data for announcements
const announcements = [
  {
    id: 1,
    title: "Water Supply Interruption",
    content:
      "Due to maintenance work, water supply will be interrupted in Sectors 10-15 on June 15, 2023, from 10:00 AM to 2:00 PM.",
    department: "Water Department",
    status: "scheduled",
    scheduledDate: "June 15, 2023",
    audience: "Mumbai - Andheri",
    priority: "medium",
  },
  {
    id: 2,
    title: "Road Closure for Construction",
    content:
      "MG Road will be closed for traffic from June 20-25, 2023, due to metro construction work. Please use alternative routes.",
    department: "Traffic Police",
    status: "scheduled",
    scheduledDate: "June 20, 2023",
    audience: "Bangalore - MG Road Area",
    priority: "high",
  },
  {
    id: 3,
    title: "Free Health Checkup Camp",
    content:
      "A free health checkup camp will be organized at the Community Center, Sector 15, on June 18, 2023, from 9:00 AM to 5:00 PM.",
    department: "Health Department",
    status: "published",
    publishedDate: "June 5, 2023",
    audience: "All Delhi Residents",
    priority: "medium",
  },
]

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

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
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                <AvatarFallback className="bg-purple-700">AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
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
                      <div className="text-3xl font-bold">125,430</div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">+12.5% from last month</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Verified Officials</CardTitle>
                      <CardDescription>Government officials on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">1,245</div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">+5.2% from last month</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Active Schemes</CardTitle>
                      <CardDescription>Government schemes available</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">78</div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">+3 new this month</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Content Reports</CardTitle>
                      <CardDescription>Pending content moderation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">24</div>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">+8 new today</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest actions on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">New user registered</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Priya Sharma from Mumbai</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">10 minutes ago</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                              <Shield className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Official verification approved</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Dr. Rajesh Kumar - Health Department
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">30 minutes ago</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                              <Flag className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Content reported</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Post ID #12345 reported for misinformation
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                              <Bell className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Emergency alert published</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Heavy rainfall alert for Mumbai region
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                              <BarChart3 className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Analytics report generated</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Monthly user engagement report</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">3 hours ago</p>
                            </div>
                          </div>
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
                          <div className="p-3 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-900/20">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-red-800 dark:text-red-400">Content Moderation</p>
                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                  24 posts flagged for review
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

                          <div className="p-3 border border-orange-200 dark:border-orange-900 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-orange-800 dark:text-orange-400">
                                  Verification Requests
                                </p>
                                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                                  12 officials waiting for verification
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

                          <div className="p-3 border border-blue-200 dark:border-blue-900 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-blue-800 dark:text-blue-400">Scheduled Announcements</p>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                  5 announcements scheduled for this week
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

                          <div className="p-3 border border-green-200 dark:border-green-900 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-green-800 dark:text-green-400">Analytics Reports</p>
                                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                  Monthly engagement report ready for review
                                </p>
                              </div>
                              <Badge className="bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Low
                              </Badge>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 border-green-300 text-green-700 dark:border-green-800 dark:text-green-400"
                              onClick={() => setActiveTab("analytics")}
                            >
                              View Report
                            </Button>
                          </div>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Content Moderation Tab */}
            {activeTab === "content" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Content Moderation</h1>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Reports</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="dismissed">Dismissed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {flaggedContent.map((item) => (
                    <Card key={item.id} className="border-purple-100 dark:border-purple-900">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <Avatar>
                                <AvatarImage src={item.author.avatar || "/placeholder.svg"} alt={item.author.name} />
                                <AvatarFallback>{item.author.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{item.author.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">@{item.author.handle}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.timestamp}</p>
                              </div>
                            </div>

                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md mb-3">
                              <p className="text-sm">{item.content}</p>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge
                                variant="outline"
                                className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                              >
                                {item.reason}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800"
                              >
                                {item.flags} flags
                              </Badge>
                              <Badge
                                variant={
                                  item.status === "pending"
                                    ? "outline"
                                    : item.status === "resolved"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className={
                                  item.status === "pending"
                                    ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                                    : ""
                                }
                              >
                                {item.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 min-w-[200px]">
                            <Button className="bg-red-600 hover:bg-red-700">Remove Content</Button>
                            <Button
                              variant="outline"
                              className="border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-400"
                            >
                              Warn User
                            </Button>
                            <Button
                              variant="outline"
                              className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
                            >
                              Dismiss Report
                            </Button>
                            <Button variant="ghost">View Details</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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

                <div className="space-y-4">
                  {verificationRequests.map((request) => (
                    <Card key={request.id} className="border-purple-100 dark:border-purple-900">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.name} />
                                <AvatarFallback>{request.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-lg">{request.name}</p>
                                <p className="text-sm">{request.position}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {request.department}, {request.organization}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm font-medium">Contact Information</p>
                                <p className="text-sm">Email: {request.email}</p>
                                <p className="text-sm">Phone: {request.phone}</p>
                              </div>

                              <div>
                                <p className="text-sm font-medium">Verification Documents</p>
                                <ul className="list-disc list-inside text-sm">
                                  {request.documents.map((doc, index) => (
                                    <li key={index}>{doc}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <p className="text-sm font-medium">Request Date:</p>
                              <p className="text-sm">{request.requestDate}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">Status:</p>
                              <Badge
                                variant={
                                  request.status === "pending"
                                    ? "outline"
                                    : request.status === "approved"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className={
                                  request.status === "pending"
                                    ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                                    : ""
                                }
                              >
                                {request.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 min-w-[200px]">
                            <Button className="bg-green-600 hover:bg-green-700">Approve</Button>
                            <Button
                              variant="outline"
                              className="border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
                            >
                              Reject
                            </Button>
                            <Button variant="outline">Request More Info</Button>
                            <Button variant="ghost">View Documents</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Announcements Tab */}
            {activeTab === "announcements" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Announcements</h1>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Create New Announcement
                  </Button>
                </div>

                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                    <TabsTrigger value="published">Published</TabsTrigger>
                    <TabsTrigger value="draft">Drafts</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <div className="space-y-4">
                      {announcements.map((announcement) => (
                        <Card key={announcement.id} className="border-purple-100 dark:border-purple-900">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h3 className="font-medium text-lg">{announcement.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {announcement.department}
                                    </p>
                                  </div>
                                  <Badge
                                    className={
                                      announcement.priority === "high"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                        : announcement.priority === "medium"
                                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    }
                                  >
                                    {announcement.priority} priority
                                  </Badge>
                                </div>

                                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md mb-3">
                                  <p className="text-sm">{announcement.content}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</p>
                                    <Badge
                                      variant={
                                        announcement.status === "published"
                                          ? "secondary"
                                          : announcement.status === "scheduled"
                                            ? "outline"
                                            : "default"
                                      }
                                      className={
                                        announcement.status === "scheduled"
                                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                          : ""
                                      }
                                    >
                                      {announcement.status}
                                    </Badge>
                                  </div>

                                  <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                      {announcement.status === "published" ? "Published Date" : "Scheduled Date"}
                                    </p>
                                    <p className="text-sm">
                                      {announcement.status === "published"
                                        ? announcement.publishedDate
                                        : announcement.scheduledDate}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Audience</p>
                                    <p className="text-sm">{announcement.audience}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 min-w-[200px]">
                                <Button variant="outline">Edit</Button>
                                {announcement.status === "scheduled" && (
                                  <Button className="bg-green-600 hover:bg-green-700">Publish Now</Button>
                                )}
                                {announcement.status === "published" && (
                                  <Button
                                    variant="outline"
                                    className="border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
                                  >
                                    Unpublish
                                  </Button>
                                )}
                                <Button variant="ghost">View Details</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="scheduled" className="mt-4">
                    <div className="space-y-4">
                      {announcements
                        .filter((a) => a.status === "scheduled")
                        .map((announcement) => (
                          <Card key={announcement.id} className="border-purple-100 dark:border-purple-900">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <h3 className="font-medium text-lg">{announcement.title}</h3>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {announcement.department}
                                      </p>
                                    </div>
                                    <Badge
                                      className={
                                        announcement.priority === "high"
                                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                          : announcement.priority === "medium"
                                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                      }
                                    >
                                      {announcement.priority} priority
                                    </Badge>
                                  </div>

                                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md mb-3">
                                    <p className="text-sm">{announcement.content}</p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                    <div>
                                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        Scheduled Date
                                      </p>
                                      <p className="text-sm">{announcement.scheduledDate}</p>
                                    </div>

                                    <div>
                                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Audience</p>
                                      <p className="text-sm">{announcement.audience}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2 min-w-[200px]">
                                  <Button variant="outline">Edit</Button>
                                  <Button className="bg-green-600 hover:bg-green-700">Publish Now</Button>
                                  <Button variant="ghost">View Details</Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="published" className="mt-4">
                    <div className="space-y-4">
                      {announcements
                        .filter((a) => a.status === "published")
                        .map((announcement) => (
                          <Card key={announcement.id} className="border-purple-100 dark:border-purple-900">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <h3 className="font-medium text-lg">{announcement.title}</h3>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {announcement.department}
                                      </p>
                                    </div>
                                    <Badge
                                      className={
                                        announcement.priority === "high"
                                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                          : announcement.priority === "medium"
                                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                      }
                                    >
                                      {announcement.priority} priority
                                    </Badge>
                                  </div>

                                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md mb-3">
                                    <p className="text-sm">{announcement.content}</p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                    <div>
                                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        Published Date
                                      </p>
                                      <p className="text-sm">{announcement.publishedDate}</p>
                                    </div>

                                    <div>
                                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Audience</p>
                                      <p className="text-sm">{announcement.audience}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2 min-w-[200px]">
                                  <Button variant="outline">Edit</Button>
                                  <Button
                                    variant="outline"
                                    className="border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
                                  >
                                    Unpublish
                                  </Button>
                                  <Button variant="ghost">View Details</Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="draft" className="mt-4">
                    <div className="p-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">No draft announcements found.</p>
                    </div>
                  </TabsContent>
                </Tabs>

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
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Content</label>
                      <Textarea
                        placeholder="Enter announcement content"
                        className="min-h-[100px] border-purple-200 dark:border-purple-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Department</label>
                        <Select>
                          <SelectTrigger className="border-purple-200 dark:border-purple-900">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="water">Water Department</SelectItem>
                            <SelectItem value="health">Health Department</SelectItem>
                            <SelectItem value="traffic">Traffic Police</SelectItem>
                            <SelectItem value="education">Education Department</SelectItem>
                            <SelectItem value="municipal">Municipal Corporation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Priority</label>
                        <Select>
                          <SelectTrigger className="border-purple-200 dark:border-purple-900">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Audience</label>
                        <Select>
                          <SelectTrigger className="border-purple-200 dark:border-purple-900">
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="mumbai">Mumbai</SelectItem>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="bangalore">Bangalore</SelectItem>
                            <SelectItem value="chennai">Chennai</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Schedule</label>
                        <Select>
                          <SelectTrigger className="border-purple-200 dark:border-purple-900">
                            <SelectValue placeholder="Select schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="now">Publish Now</SelectItem>
                            <SelectItem value="later">Schedule for Later</SelectItem>
                            <SelectItem value="draft">Save as Draft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Create Announcement
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">User Growth</CardTitle>
                      <CardDescription>New users this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">+15,430</div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">+12.5% from last month</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Active Users</CardTitle>
                      <CardDescription>Daily active users</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">45,280</div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">+8.3% from last week</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Scheme Applications</CardTitle>
                      <CardDescription>Applications this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">12,845</div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">+5.7% from last month</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Content Engagement</CardTitle>
                      <CardDescription>Avg. interactions per post</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">124</div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">+3.2% from last month</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader>
                      <CardTitle>User Demographics</CardTitle>
                      <CardDescription>User distribution by region and age</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                        <p className="text-gray-500 dark:text-gray-400">User Demographics Chart</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader>
                      <CardTitle>Scheme Popularity</CardTitle>
                      <CardDescription>Most popular government schemes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                        <p className="text-gray-500 dark:text-gray-400">Scheme Popularity Chart</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader>
                      <CardTitle>User Engagement</CardTitle>
                      <CardDescription>Daily active users over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                        <p className="text-gray-500 dark:text-gray-400">User Engagement Chart</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader>
                      <CardTitle>Language Distribution</CardTitle>
                      <CardDescription>User preferred languages</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                        <p className="text-gray-500 dark:text-gray-400">Language Distribution Chart</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader>
                    <CardTitle>Generate Reports</CardTitle>
                    <CardDescription>Create custom analytics reports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Report Type</label>
                        <Select>
                          <SelectTrigger className="border-purple-200 dark:border-purple-900">
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User Growth</SelectItem>
                            <SelectItem value="engagement">User Engagement</SelectItem>
                            <SelectItem value="scheme">Scheme Applications</SelectItem>
                            <SelectItem value="content">Content Performance</SelectItem>
                            <SelectItem value="language">Language Usage</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Time Period</label>
                        <Select>
                          <SelectTrigger className="border-purple-200 dark:border-purple-900">
                            <SelectValue placeholder="Select time period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7days">Last 7 Days</SelectItem>
                            <SelectItem value="30days">Last 30 Days</SelectItem>
                            <SelectItem value="90days">Last 90 Days</SelectItem>
                            <SelectItem value="6months">Last 6 Months</SelectItem>
                            <SelectItem value="1year">Last Year</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Format</label>
                        <Select>
                          <SelectTrigger className="border-purple-200 dark:border-purple-900">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Generate Report
                    </Button>
                  </CardFooter>
                </Card>
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
