"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, MapPin, Briefcase, Calendar, Mail, Phone, Globe, Users, MessageCircle, Camera, Heart, MessageSquare, Share2, Loader2, ArrowLeft } from "lucide-react"
import MobileHeader from "@/components/mobile-header"
import MobileFooterNav from "@/components/mobile-footer-nav"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getUserProfile, updateUserProfile, getUserPosts } from "@/lib/api-service"
import { getToken } from "@/lib/auth-service"
import { useAuth } from "@/components/auth-provider"
import type { Post } from "@/lib/types"
import { toast } from "sonner"

interface ProfileData {
  name: string
  handle: string
  avatar: string
  coverPhoto: string
  bio: string
  location: string
  occupation: string
  joinedDate: string
  email: string
  phone: string
  website: string
  connections: number
  interests: string[]
}

const defaultProfile: ProfileData = {
  name: "User",
  handle: "@user",
  avatar: "/placeholder.svg?height=100&width=100",
  coverPhoto: "/placeholder.svg?height=400&width=1200",
  bio: "Welcome to CivicConnect! Update your profile to share more about yourself.",
  location: "India",
  occupation: "",
  joinedDate: "Joined recently",
  email: "",
  phone: "",
  website: "",
  connections: 0,
  interests: [],
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const { user, isLoggedIn, isLoading: authLoading } = useAuth()

  const fetchProfile = useCallback(async () => {
    if (!isLoggedIn) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    const token = getToken()
    if (!token) {
      setIsLoading(false)
      return
    }
    try {
      const profileData = await getUserProfile(token)
      setProfile({
        name: profileData.name || user?.name || "User",
        handle: `@${(profileData.name || "user").toLowerCase().replace(/\s+/g, "")}`,
        avatar: profileData.avatar || "/placeholder.svg?height=100&width=100",
        coverPhoto: "/placeholder.svg?height=400&width=1200",
        bio: profileData.bio || "Welcome to CivicConnect!",
        location: profileData.location || "India",
        occupation: profileData.occupation || "",
        joinedDate: `Joined ${new Date(profileData.createdAt || Date.now()).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}`,
        email: profileData.email || user?.email || "",
        phone: profileData.phone || "",
        website: profileData.website || "",
        connections: profileData.connections || 0,
        interests: profileData.interests || [],
      })
    } catch {
      if (user) {
        setProfile({
          ...defaultProfile,
          name: user.name,
          handle: `@${user.name.toLowerCase().replace(/\s+/g, "")}`,
          email: user.email,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [isLoggedIn, user])

  const fetchPosts = useCallback(async () => {
    if (!isLoggedIn) return
    const token = getToken()
    if (!token) return
    try {
      const userPosts = await getUserPosts(token)
      setPosts(userPosts)
    } catch {
      // Silently handle
    }
  }, [isLoggedIn])

  useEffect(() => {
    fetchProfile()
    fetchPosts()
  }, [fetchProfile, fetchPosts])

  const handleProfileUpdate = async (formData: FormData) => {
    const token = getToken()
    if (!token) return
    setIsSaving(true)
    try {
      const updateData = {
        name: formData.get("name") as string,
        bio: formData.get("bio") as string,
        location: formData.get("location") as string,
        occupation: formData.get("occupation") as string,
        phone: formData.get("phone") as string,
        website: formData.get("website") as string,
      }
      await updateUserProfile(updateData, token)
      setProfile(prev => ({
        ...prev,
        name: updateData.name || prev.name,
        bio: updateData.bio || prev.bio,
        location: updateData.location || prev.location,
        occupation: updateData.occupation || prev.occupation,
        phone: updateData.phone || prev.phone,
        website: updateData.website || prev.website,
      }))
      setEditDialogOpen(false)
      toast.success("Profile updated successfully!")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 pb-16 md:pb-0">
        <MobileHeader />
        <main className="container mx-auto px-4 py-4">
          <Skeleton className="h-32 md:h-48 w-full rounded-lg mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </main>
        <MobileFooterNav />
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 pb-16 md:pb-0">
        <MobileHeader />
        <main className="container mx-auto px-4 py-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Please Login</h2>
            <p className="text-gray-500 mb-6">You need to be logged in to view your profile</p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </main>
        <MobileFooterNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 pb-16 md:pb-0">
      <MobileHeader />
      <main className="container mx-auto px-4 py-4">
        <Link href="/" className="flex items-center text-purple-700 hover:text-purple-900 mb-4 md:hidden">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Home</span>
        </Link>

        {/* Profile Header */}
        <div className="relative mb-6">
          <div className="h-32 md:h-48 rounded-lg bg-gradient-to-r from-purple-400 to-blue-500 relative overflow-hidden">
            <img src={profile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between px-4 -mt-16 md:-mt-20 relative">
            <div className="flex flex-col md:flex-row md:items-center">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white dark:border-gray-900 shadow-md">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-2xl text-white">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-2 md:mt-0 md:ml-4">
                <div className="flex items-center">
                  <h1 className="text-xl md:text-2xl font-bold">{profile.name}</h1>
                  {user?.isVerified && <Badge className="ml-2 bg-blue-100 text-blue-800 border-0">Verified</Badge>}
                </div>
                <p className="text-gray-500 text-sm">{profile.handle}</p>
              </div>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-2">
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>Make changes to your profile information</DialogDescription>
                  </DialogHeader>
                  <form action={async (formData) => { await handleProfileUpdate(formData) }}>
                    <ScrollArea className="h-[60vh] md:h-auto">
                      <div className="grid gap-4 py-4 px-1">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" name="name" defaultValue={profile.name} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea id="bio" name="bio" defaultValue={profile.bio} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" name="location" defaultValue={profile.location} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="occupation">Occupation</Label>
                          <Input id="occupation" name="occupation" defaultValue={profile.occupation} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" name="phone" defaultValue={profile.phone} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="website">Website</Label>
                          <Input id="website" name="website" defaultValue={profile.website} />
                        </div>
                      </div>
                    </ScrollArea>
                    <DialogFooter>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save changes"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <p className="text-sm">{profile.bio}</p>
        </div>

        {/* Profile Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-purple-100 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-md">Personal Info</CardTitle></CardHeader>
            <CardContent className="space-y-2 pt-0">
              {profile.location && <div className="flex items-center text-sm"><MapPin className="h-4 w-4 mr-2 text-gray-500" />{profile.location}</div>}
              {profile.occupation && <div className="flex items-center text-sm"><Briefcase className="h-4 w-4 mr-2 text-gray-500" />{profile.occupation}</div>}
              <div className="flex items-center text-sm"><Calendar className="h-4 w-4 mr-2 text-gray-500" />{profile.joinedDate}</div>
            </CardContent>
          </Card>
          <Card className="border-purple-100 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-md">Contact</CardTitle></CardHeader>
            <CardContent className="space-y-2 pt-0">
              {profile.email && <div className="flex items-center text-sm"><Mail className="h-4 w-4 mr-2 text-gray-500" />{profile.email}</div>}
              {profile.phone && <div className="flex items-center text-sm"><Phone className="h-4 w-4 mr-2 text-gray-500" />{profile.phone}</div>}
              {profile.website && <div className="flex items-center text-sm"><Globe className="h-4 w-4 mr-2 text-gray-500" />{profile.website}</div>}
            </CardContent>
          </Card>
          <Card className="border-purple-100 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-md">Stats</CardTitle></CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="flex items-center text-sm"><Users className="h-4 w-4 mr-2 text-gray-500" />{profile.connections} connections</div>
              <div className="flex items-center text-sm"><MessageSquare className="h-4 w-4 mr-2 text-gray-500" />{posts.length} posts</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 bg-purple-100 p-1">
            <TabsTrigger value="posts" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Posts</TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No posts yet. Share your first update!</div>
            ) : (
              posts.map(post => (
                <Card key={post.id} className="border-purple-100 shadow-sm">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={profile.avatar} alt={profile.name} />
                        <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-semibold">{profile.name}</span>
                          <span className="text-gray-500 text-sm ml-2">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="mt-1">{post.content}</p>
                        {post.image && <img src={post.image} alt="Post" className="mt-3 rounded-lg w-full" />}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <Button variant="ghost" size="sm"><Heart className="h-4 w-4 mr-1" />{post.likes}</Button>
                          <Button variant="ghost" size="sm"><MessageSquare className="h-4 w-4 mr-1" />{post.comments}</Button>
                          <Button variant="ghost" size="sm"><Share2 className="h-4 w-4 mr-1" />Share</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          <TabsContent value="activity">
            <div className="text-center py-8 text-gray-500">No recent activity</div>
          </TabsContent>
        </Tabs>
      </main>
      <MobileFooterNav />
    </div>
  )
}
