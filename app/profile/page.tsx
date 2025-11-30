"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Edit,
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  Globe,
  Users,
  MessageCircle,
  Camera,
  ImageIcon,
  Heart,
  MessageSquare,
  Share2,
} from "lucide-react"
import MobileHeader from "@/components/mobile-header"
import MobileFooterNav from "@/components/mobile-footer-nav"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts")
  const [editMode, setEditMode] = useState(false)

  // Mock user data
  const [user, setUser] = useState({
    name: "Priya Sharma",
    handle: "@priyasharma",
    avatar: "/placeholder.svg?height=100&width=100",
    coverPhoto: "/placeholder.svg?height=400&width=1200",
    bio: "Urban planner passionate about sustainable city development and civic engagement. Working to make our cities more livable and inclusive.",
    location: "Mumbai, Maharashtra",
    occupation: "Urban Planner at City Development Authority",
    joinedDate: "Joined June 2022",
    email: "priya.sharma@example.com",
    phone: "+91 98765 43210",
    website: "priyasharma.portfolio.com",
    connections: 248,
    achievements: [
      { name: "Verified Resident", icon: "🏠" },
      { name: "Community Contributor", icon: "🌟" },
      { name: "Digital Champion", icon: "💻" },
    ],
    interests: ["Urban Planning", "Sustainability", "Public Transport", "Community Development", "Digital Governance"],
  })

  // Mock posts data
  const posts = [
    {
      id: 1,
      content: "Just attended the Smart Cities workshop. Great insights on how technology can improve urban living!",
      timestamp: "2 days ago",
      likes: 24,
      comments: 5,
    },
    {
      id: 2,
      content:
        "The new metro line extension is going to transform connectivity in the eastern suburbs. What are your thoughts on the project timeline?",
      timestamp: "1 week ago",
      likes: 42,
      comments: 13,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      content:
        "Participated in the tree plantation drive today at Sanjay Gandhi National Park. Small steps toward a greener city! #GreenMumbai",
      timestamp: "2 weeks ago",
      likes: 67,
      comments: 8,
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  // Mock activities data
  const activities = [
    {
      id: 1,
      type: "application",
      title: "Applied for Digital Literacy Program",
      timestamp: "Yesterday",
      status: "Under Review",
    },
    {
      id: 2,
      type: "event",
      title: "RSVP'd to Community Clean-up Drive",
      timestamp: "3 days ago",
      status: "Confirmed",
    },
    {
      id: 3,
      type: "comment",
      title: "Commented on Mumbai Infrastructure Plan",
      timestamp: "1 week ago",
    },
  ]

  // Mock connections data
  const connections = [
    {
      id: 1,
      name: "Amit Patel",
      role: "Urban Planner",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Neha Singh",
      role: "Community Organizer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      role: "Local Business Owner",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Mumbai Municipal Corporation",
      role: "Official",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
  ]

  // Handle profile update
  const handleProfileUpdate = (formData: FormData) => {
    // In a real app, this would send data to the backend
    // For now, we'll just update the local state
    setUser({
      ...user,
      name: (formData.get("name") as string) || user.name,
      bio: (formData.get("bio") as string) || user.bio,
      location: (formData.get("location") as string) || user.location,
      occupation: (formData.get("occupation") as string) || user.occupation,
      email: (formData.get("email") as string) || user.email,
      phone: (formData.get("phone") as string) || user.phone,
      website: (formData.get("website") as string) || user.website,
    })
    setEditMode(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 pb-16 md:pb-0">
      {/* Mobile Header */}
      <MobileHeader />

      <main className="container mx-auto px-4 py-4">
        {/* Profile Header */}
        <div className="relative mb-6">
          {/* Cover Photo */}
          <div className="h-32 md:h-48 rounded-lg bg-gradient-to-r from-purple-400 to-blue-500 relative overflow-hidden">
            <img src={user.coverPhoto || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="secondary" className="absolute bottom-2 right-2 bg-white/80 hover:bg-white">
                  <Camera className="h-4 w-4 mr-1" />
                  <span className="text-xs">Edit Cover</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Cover Photo</DialogTitle>
                  <DialogDescription>Choose a new cover photo for your profile</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cover-photo">Upload Photo</Label>
                    <Input id="cover-photo" type="file" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between px-4 -mt-16 md:-mt-20 relative">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="relative">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white dark:border-gray-900 shadow-md">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-2xl text-white">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                    >
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Change profile picture</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Profile Picture</DialogTitle>
                      <DialogDescription>Choose a new profile picture</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="profile-photo">Upload Photo</Label>
                        <Input id="profile-photo" type="file" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mt-2 md:mt-0 md:ml-4">
                <div className="flex items-center">
                  <h1 className="text-xl md:text-2xl font-bold">{user.name}</h1>
                  <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0">
                    Verified
                  </Badge>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{user.handle}</p>
                <p className="text-sm mt-1 hidden md:block">{user.bio}</p>
              </div>
            </div>

            <div className="flex mt-4 md:mt-0 space-x-2">
              <Button size="sm" variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>Make changes to your profile information</DialogDescription>
                  </DialogHeader>
                  <form
                    action={async (formData) => {
                      handleProfileUpdate(formData)
                    }}
                  >
                    <ScrollArea className="h-[60vh] md:h-auto">
                      <div className="grid gap-4 py-4 px-1">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" name="name" defaultValue={user.name} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea id="bio" name="bio" defaultValue={user.bio} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" name="location" defaultValue={user.location} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="occupation">Occupation</Label>
                          <Input id="occupation" name="occupation" defaultValue={user.occupation} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" defaultValue={user.email} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" name="phone" defaultValue={user.phone} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="website">Website</Label>
                          <Input id="website" name="website" defaultValue={user.website} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Interests</Label>
                          <div className="flex flex-wrap gap-2">
                            {user.interests.map((interest, index) => (
                              <Badge key={index} variant="secondary" className="bg-purple-50 text-purple-700">
                                {interest}
                              </Badge>
                            ))}
                            <Button variant="outline" size="sm" className="h-6 text-xs">
                              + Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                    <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Mobile Bio */}
        <div className="md:hidden mb-6">
          <p className="text-sm">{user.bio}</p>
        </div>

        {/* Profile Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-purple-100 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Personal Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                <span>{user.occupation}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>{user.joinedDate}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <Globe className="h-4 w-4 mr-2 text-gray-500" />
                <span>{user.website}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {user.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center text-sm">
                  <span className="mr-2">{achievement.icon}</span>
                  <span>{achievement.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Interests */}
        <Card className="border-purple-100 dark:border-gray-800 shadow-sm mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Interests</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Posts, Activities, Connections */}
        <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6 bg-purple-100 dark:bg-gray-800 p-1">
            <TabsTrigger
              value="posts"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              Activities
            </TabsTrigger>
            <TabsTrigger
              value="connections"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              Connections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {/* New Post Input */}
            <Card className="border-purple-100 dark:border-gray-800 shadow-sm">
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share an update or ask a question..."
                      className="resize-none border-purple-200 dark:border-gray-700 focus-visible:ring-purple-400"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                        >
                          <ImageIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs">Photo</span>
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            {posts.map((post) => (
              <Card key={post.id} className="border-purple-100 dark:border-gray-800 shadow-sm">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-semibold">{user.name}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">{post.timestamp}</span>
                      </div>
                      <p className="mt-1">{post.content}</p>
                      {post.image && (
                        <div className="mt-3 rounded-lg overflow-hidden">
                          <img src={post.image || "/placeholder.svg"} alt="Post" className="w-full h-auto" />
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-red-500">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-blue-500">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-green-500">
                          <Share2 className="h-4 w-4" />
                          <span>Share</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id} className="border-purple-100 dark:border-gray-800 shadow-sm">
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.timestamp}</p>
                    </div>
                    {activity.status && (
                      <Badge
                        className={
                          activity.status === "Confirmed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                        }
                      >
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="connections" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">You have {user.connections} connections</h3>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
              >
                <Users className="h-4 w-4 mr-1" />
                Find Connections
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((connection) => (
                <Card key={connection.id} className="border-purple-100 dark:border-gray-800 shadow-sm">
                  <CardContent className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={connection.avatar || "/placeholder.svg"} alt={connection.name} />
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                          {connection.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="font-medium">{connection.name}</p>
                          {connection.verified && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0 text-xs">
                              Official
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{connection.role}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile Footer Navigation */}
      <MobileFooterNav />
    </div>
  )
}
