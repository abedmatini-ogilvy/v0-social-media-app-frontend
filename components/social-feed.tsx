"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  MessageCircle,
  Share2,
  ImageIcon,
  Smile,
  MapPin,
  CheckCircle,
  UserPlus,
  UserCheck,
  MoreHorizontal,
  Bookmark,
  Flag,
  UserX,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample data for posts
const posts = [
  {
    id: 1,
    author: {
      name: "Mumbai Municipal Corporation",
      handle: "MumbaiMC",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: true,
      isOfficial: true,
    },
    content:
      "Road repair work will be carried out on Western Express Highway from Andheri to Borivali on June 15-16. Please plan your travel accordingly.",
    timestamp: "1 hour ago",
    likes: 245,
    comments: 32,
    shares: 78,
    isFollowing: true,
  },
  {
    id: 2,
    author: {
      name: "Ravi Kumar",
      handle: "ravikumar",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: false,
      isOfficial: false,
    },
    content:
      "The new digital literacy program at our community center is amazing! Already learned how to access government services online. Thanks @DigitalIndiaOfficial for the initiative!",
    timestamp: "3 hours ago",
    likes: 89,
    comments: 14,
    shares: 5,
    isFollowing: false,
  },
  {
    id: 3,
    author: {
      name: "Digital India",
      handle: "DigitalIndiaOfficial",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: true,
      isOfficial: true,
    },
    content:
      "Proud to announce that over 5 million citizens have been trained in basic digital skills across 15 states. Our mission continues to bridge the digital divide. #DigitalIndia",
    timestamp: "5 hours ago",
    likes: 1245,
    comments: 132,
    shares: 478,
    image: "/placeholder.svg?height=300&width=500",
    isFollowing: true,
  },
  {
    id: 4,
    author: {
      name: "Priya Sharma",
      handle: "priyasharma",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: false,
      isOfficial: false,
    },
    content:
      "Just used the new water bill payment feature on the CivicConnect app. So convenient! No more standing in long queues. #DigitalIndia #SmartCity",
    timestamp: "6 hours ago",
    likes: 156,
    comments: 23,
    shares: 12,
    isFollowing: false,
  },
  {
    id: 5,
    author: {
      name: "Ministry of Health",
      handle: "MoHFW_India",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: true,
      isOfficial: true,
    },
    content:
      "Free health checkup camps will be organized across all districts from June 20-25. Services include general health checkup, eye examination, and diabetes screening. #HealthForAll",
    timestamp: "8 hours ago",
    likes: 892,
    comments: 145,
    shares: 367,
    image: "/placeholder.svg?height=300&width=500",
    isFollowing: false,
  },
]

export default function SocialFeed() {
  const [activeTab, setActiveTab] = useState("all")
  const [postContent, setPostContent] = useState("")

  return (
    <div className="space-y-4">
      {/* Post creation card */}
      <Card className="border-purple-100 dark:border-gray-800 shadow-md">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share updates or ask a question..."
                className="resize-none border-purple-200 dark:border-gray-700 focus-visible:ring-purple-400"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                        >
                          <ImageIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs">Photo</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add a photo to your post</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                        >
                          <Smile className="h-4 w-4 mr-1" />
                          <span className="text-xs">Emoji</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add emoji</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-xs">Location</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add your location</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button
                  size="sm"
                  disabled={!postContent.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 bg-purple-100 dark:bg-gray-800 p-1">
          <TabsTrigger
            value="all"
            onClick={() => setActiveTab("all")}
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="official"
            onClick={() => setActiveTab("official")}
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
          >
            Official
          </TabsTrigger>
          <TabsTrigger
            value="community"
            onClick={() => setActiveTab("community")}
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
          >
            Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </TabsContent>

        <TabsContent value="official" className="space-y-4">
          {posts
            .filter((post) => post.author.isOfficial)
            .map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          {posts
            .filter((post) => !post.author.isOfficial)
            .map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PostCardProps {
  post: {
    id: number
    author: {
      name: string
      handle: string
      avatar: string
      isVerified: boolean
      isOfficial: boolean
    }
    content: string
    timestamp: string
    likes: number
    comments: number
    shares: number
    image?: string
    isFollowing: boolean
  }
}

function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [following, setFollowing] = useState(post.isFollowing)
  const [saved, setSaved] = useState(false)

  return (
    <Card className="border-purple-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
            <AvatarFallback
              className={
                post.author.isOfficial
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "bg-gradient-to-r from-green-500 to-teal-500 text-white"
              }
            >
              {post.author.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="font-semibold">{post.author.name}</span>
              {post.author.isVerified && <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-500" />}
              {post.author.isOfficial && (
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 ml-1"
                >
                  Official
                </Badge>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>@{post.author.handle}</span>
              <span>•</span>
              <span>{post.timestamp}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!post.author.isOfficial && (
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-3 ${
                  following
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50"
                    : "border border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                }`}
                onClick={() => setFollowing(!following)}
              >
                {following ? (
                  <>
                    <UserCheck className="h-4 w-4 mr-1" />
                    <span className="text-xs">Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1" />
                    <span className="text-xs">Follow</span>
                  </>
                )}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-purple-50 dark:hover:bg-gray-800"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSaved(!saved)}>
                  <Bookmark className={`h-4 w-4 mr-2 ${saved ? "fill-purple-500 text-purple-500" : ""}`} />
                  {saved ? "Unsave post" : "Save post"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2" />
                  Report post
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserX className="h-4 w-4 mr-2" />
                  Hide posts from this user
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
        {post.image && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img src={post.image || "/placeholder.svg"} alt="Post image" className="w-full h-auto" />
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 pb-2">
        <div className="flex justify-between w-full text-gray-500 dark:text-gray-400">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 ${liked ? "text-red-500" : ""} hover:bg-red-50 dark:hover:bg-red-950`}
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            <span>{liked ? post.likes + 1 : post.likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400"
          >
            <Share2 className="h-4 w-4" />
            <span>{post.shares}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
