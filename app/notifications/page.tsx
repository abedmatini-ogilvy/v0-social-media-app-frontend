import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft, Bell, Calendar, CheckCircle, FileText, MessageCircle, UserPlus } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center text-purple-700 hover:text-purple-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50">
            Mark All as Read
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6 bg-purple-100 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              All
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
                  {/* Emergency Alert Notification */}
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-red-800">Emergency Alert: Heavy Rainfall</p>
                      <p className="text-sm text-red-700 mt-1">
                        Heavy rainfall expected in Mumbai region for next 48 hours. Please stay indoors and avoid
                        unnecessary travel.
                      </p>
                      <p className="text-xs text-red-600 mt-2">2 hours ago • Mumbai Meteorological Department</p>
                    </div>
                  </div>

                  {/* Social Notification */}
                  <div className="p-3 border-l-4 border-purple-300 rounded-md flex items-start gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Priya Sharma" />
                      <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                        PS
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Priya Sharma sent you a connection request</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Priya Sharma (Community Organizer) wants to connect with you
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          className="h-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          Decline
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">3 hours ago</p>
                    </div>
                  </div>

                  {/* Scheme Notification */}
                  <div className="p-3 border-l-4 border-green-300 rounded-md flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Your application has been approved</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Your application for the Digital Literacy Program has been approved. Classes start on June 15.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-8 border-green-200 text-green-700 hover:bg-green-50"
                      >
                        View Details
                      </Button>
                      <p className="text-xs text-gray-400 mt-2">5 hours ago • Digital India Initiative</p>
                    </div>
                  </div>

                  {/* Comment Notification */}
                  <div className="p-3 border-l-4 border-blue-300 rounded-md flex items-start gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Amit Patel" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        AP
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Amit Patel commented on your post</p>
                      <p className="text-sm text-gray-500 mt-1">
                        "Great initiative! I'll be joining the workshop too."
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-8 border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                      <p className="text-xs text-gray-400 mt-2">8 hours ago</p>
                    </div>
                  </div>

                  {/* Event Notification */}
                  <div className="p-3 border-l-4 border-orange-300 rounded-md flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Upcoming Event Reminder</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Digital Literacy Workshop is tomorrow at 10:00 AM at Community Center, Sector 15.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                          View Event
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 text-gray-500 hover:bg-gray-100">
                          Dismiss
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">12 hours ago</p>
                    </div>
                  </div>

                  {/* New Scheme Notification */}
                  <div className="p-3 border-l-4 border-blue-300 rounded-md flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">New Government Scheme Launched</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Skill India Initiative has been launched. Apply now to enhance your vocational skills.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-8 border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        Apply Now
                      </Button>
                      <p className="text-xs text-gray-400 mt-2">1 day ago • Ministry of Skill Development</p>
                    </div>
                  </div>

                  {/* Connection Notification */}
                  <div className="p-3 border-l-4 border-purple-300 rounded-md flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">3 new people in your area joined CivicConnect</p>
                      <p className="text-sm text-gray-500 mt-1">Discover new connections in your neighborhood</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-8 border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        View Suggestions
                      </Button>
                      <p className="text-xs text-gray-400 mt-2">2 days ago</p>
                    </div>
                  </div>
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
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-red-800">Emergency Alert: Heavy Rainfall</p>
                      <p className="text-sm text-red-700 mt-1">
                        Heavy rainfall expected in Mumbai region for next 48 hours. Please stay indoors and avoid
                        unnecessary travel.
                      </p>
                      <p className="text-xs text-red-600 mt-2">2 hours ago • Mumbai Meteorological Department</p>
                    </div>
                  </div>
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
                  <div className="p-3 border-l-4 border-purple-300 rounded-md flex items-start gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Priya Sharma" />
                      <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                        PS
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Priya Sharma sent you a connection request</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Priya Sharma (Community Organizer) wants to connect with you
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          className="h-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          Decline
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">3 hours ago</p>
                    </div>
                  </div>

                  <div className="p-3 border-l-4 border-blue-300 rounded-md flex items-start gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Amit Patel" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        AP
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Amit Patel commented on your post</p>
                      <p className="text-sm text-gray-500 mt-1">
                        "Great initiative! I'll be joining the workshop too."
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-8 border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                      <p className="text-xs text-gray-400 mt-2">8 hours ago</p>
                    </div>
                  </div>

                  <div className="p-3 border-l-4 border-purple-300 rounded-md flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">3 new people in your area joined CivicConnect</p>
                      <p className="text-sm text-gray-500 mt-1">Discover new connections in your neighborhood</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-8 border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        View Suggestions
                      </Button>
                      <p className="text-xs text-gray-400 mt-2">2 days ago</p>
                    </div>
                  </div>
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
                  <div className="p-3 border-l-4 border-green-300 rounded-md flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Your application has been approved</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Your application for the Digital Literacy Program has been approved. Classes start on June 15.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-8 border-green-200 text-green-700 hover:bg-green-50"
                      >
                        View Details
                      </Button>
                      <p className="text-xs text-gray-400 mt-2">5 hours ago • Digital India Initiative</p>
                    </div>
                  </div>

                  <div className="p-3 border-l-4 border-blue-300 rounded-md flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">New Government Scheme Launched</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Skill India Initiative has been launched. Apply now to enhance your vocational skills.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-8 border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        Apply Now
                      </Button>
                      <p className="text-xs text-gray-400 mt-2">1 day ago • Ministry of Skill Development</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
