"use client"

import { useState, useEffect, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { getPostsFeed, createPost, likePost, unlikePost, getPostComments, addComment, connectWithUser, disconnectFromUser } from "@/lib/api-service"
import { getToken } from "@/lib/auth-service"
import type { Post, Comment } from "@/lib/types"
import { toast } from "sonner"

// Common emojis for the picker
const EMOJI_LIST = [
  "😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂",
  "😉", "😍", "🥰", "😘", "😋", "😎", "🤩", "🥳", "😏", "😌",
  "👍", "👎", "👏", "🙌", "🤝", "❤️", "🧡", "💛", "💚", "💙",
  "🎉", "🎊", "✨", "🔥", "💯", "✅", "⭐", "🌟", "💪", "🙏",
]

// Sample data for posts (used as fallback when API is not available)
const mockPosts = [
  {
    id: "1",
    author: {
      id: "1",
      name: "Mumbai Municipal Corporation",
      email: "mmc@gov.in",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: true,
      role: "official" as const,
      createdAt: new Date().toISOString(),
    },
    content:
      "Road repair work will be carried out on Western Express Highway from Andheri to Borivali on June 15-16. Please plan your travel accordingly.",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    likes: 245,
    comments: 32,
    shares: 78,
    authorId: "1",
  },
  {
    id: "2",
    author: {
      id: "2",
      name: "Ravi Kumar",
      email: "ravi@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: false,
      role: "citizen" as const,
      createdAt: new Date().toISOString(),
    },
    content:
      "The new digital literacy program at our community center is amazing! Already learned how to access government services online. Thanks @DigitalIndiaOfficial for the initiative!",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    likes: 89,
    comments: 14,
    shares: 5,
    authorId: "2",
  },
  {
    id: "3",
    author: {
      id: "3",
      name: "Digital India",
      email: "digital@gov.in",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: true,
      role: "official" as const,
      createdAt: new Date().toISOString(),
    },
    content:
      "Proud to announce that over 5 million citizens have been trained in basic digital skills across 15 states. Our mission continues to bridge the digital divide. #DigitalIndia",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 1245,
    comments: 132,
    shares: 478,
    image: "/placeholder.svg?height=300&width=500",
    authorId: "3",
  },
  {
    id: "4",
    author: {
      id: "4",
      name: "Priya Sharma",
      email: "priya@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: false,
      role: "citizen" as const,
      createdAt: new Date().toISOString(),
    },
    content:
      "Just used the new water bill payment feature on the CivicConnect app. So convenient! No more standing in long queues. #DigitalIndia #SmartCity",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    likes: 156,
    comments: 23,
    shares: 12,
    authorId: "4",
  },
  {
    id: "5",
    author: {
      id: "5",
      name: "Ministry of Health",
      email: "health@gov.in",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: true,
      role: "official" as const,
      createdAt: new Date().toISOString(),
    },
    content:
      "Free health checkup camps will be organized across all districts from June 20-25. Services include general health checkup, eye examination, and diabetes screening. #HealthForAll",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: 892,
    comments: 145,
    shares: 367,
    image: "/placeholder.svg?height=300&width=500",
    authorId: "5",
  },
]

// Helper function to format relative time
function formatRelativeTime(dateString: string): string {
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

export default function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [postContent, setPostContent] = useState("")
  const [postImage, setPostImage] = useState("")
  const [postLocation, setPostLocation] = useState("")
  const [showImageInput, setShowImageInput] = useState(false)
  const [showLocationInput, setShowLocationInput] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const { user, isLoggedIn } = useAuth()

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const token = getToken()
      if (token) {
        const fetchedPosts = await getPostsFeed(token)
        setPosts(fetchedPosts)
      } else {
        // Use mock data when not authenticated
        setPosts(mockPosts)
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err)
      // Fall back to mock data on error
      setPosts(mockPosts)
      setError("Unable to load live feed. Showing sample posts.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleCreatePost = async () => {
    if (!postContent.trim()) return
    
    if (!isLoggedIn) {
      toast.error("Please login to create a post")
      return
    }

    setIsPosting(true)
    try {
      const token = getToken()
      if (token) {
        const options: { image?: string; location?: string } = {}
        if (postImage.trim()) options.image = postImage.trim()
        if (postLocation.trim()) options.location = postLocation.trim()
        
        const newPost = await createPost(postContent, token, Object.keys(options).length > 0 ? options : undefined)
        setPosts([newPost, ...posts])
        setPostContent("")
        setPostImage("")
        setPostLocation("")
        setShowImageInput(false)
        setShowLocationInput(false)
        toast.success("Post created successfully!")
      }
    } catch (err) {
      console.error("Failed to create post:", err)
      toast.error("Failed to create post. Please try again.")
    } finally {
      setIsPosting(false)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setPostContent((prev) => prev + emoji)
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="border-purple-100 dark:border-gray-800 shadow-md">
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-20 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-purple-100 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <Skeleton className="h-16 w-full" />
            </CardContent>
            <CardFooter className="pt-0 pb-2">
              <div className="flex justify-between w-full">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Error banner */}
      {error && (
        <div className="p-3 text-sm text-amber-600 bg-amber-50 rounded-md border border-amber-200">
          {error}
        </div>
      )}

      {/* Post creation card */}
      <Card className="border-purple-100 dark:border-gray-800 shadow-md">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={user?.avatar || "/placeholder.svg?height=40&width=40"} alt="User" />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {user?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder={isLoggedIn ? "Share updates or ask a question..." : "Login to share updates..."}
                className="resize-none border-purple-200 dark:border-gray-700 focus-visible:ring-purple-400"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                disabled={!isLoggedIn || isPosting}
              />
                {/* Image URL input */}
              {showImageInput && (
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Enter image URL..."
                    value={postImage}
                    onChange={(e) => setPostImage(e.target.value)}
                    className="flex-1 border-purple-200 dark:border-gray-700"
                    disabled={!isLoggedIn || isPosting}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowImageInput(false)
                      setPostImage("")
                    }}
                    className="text-gray-500"
                  >
                    ✕
                  </Button>
                </div>
              )}

              {/* Location input */}
              {showLocationInput && (
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Enter your location..."
                    value={postLocation}
                    onChange={(e) => setPostLocation(e.target.value)}
                    className="flex-1 border-purple-200 dark:border-gray-700"
                    disabled={!isLoggedIn || isPosting}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowLocationInput(false)
                      setPostLocation("")
                    }}
                    className="text-gray-500"
                  >
                    ✕
                  </Button>
                </div>
              )}

              {/* Preview badges */}
              {(postImage || postLocation) && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {postImage && (
                    <Badge variant="secondary" className="text-xs">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      Image attached
                    </Badge>
                  )}
                  {postLocation && (
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {postLocation}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 ${showImageInput ? 'bg-purple-100 dark:bg-purple-900/30' : ''}`}
                          disabled={!isLoggedIn}
                          onClick={() => setShowImageInput(!showImageInput)}
                        >
                          <ImageIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs">Photo</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add a photo URL to your post</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                        disabled={!isLoggedIn}
                      >
                        <Smile className="h-4 w-4 mr-1" />
                        <span className="text-xs">Emoji</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2" align="start">
                      <div className="grid grid-cols-8 gap-1">
                        {EMOJI_LIST.map((emoji, index) => (
                          <button
                            key={index}
                            className="p-1 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded text-lg"
                            onClick={() => handleEmojiSelect(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 ${showLocationInput ? 'bg-purple-100 dark:bg-purple-900/30' : ''}`}
                          disabled={!isLoggedIn}
                          onClick={() => setShowLocationInput(!showLocationInput)}
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
                  disabled={!postContent.trim() || !isLoggedIn || isPosting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={handleCreatePost}
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post"
                  )}
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
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="official"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
          >
            Official
          </TabsTrigger>
          <TabsTrigger
            value="community"
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
            .filter((post) => post.author.role === "official")
            .map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          {posts
            .filter((post) => post.author.role === "citizen")
            .map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PostCardProps {
  post: Post
}

function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [following, setFollowing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [isPostingComment, setIsPostingComment] = useState(false)
  const { isLoggedIn, user } = useAuth()

  const isOfficial = post.author.role === "official"

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setIsLoadingComments(true)
      try {
        const token = getToken()
        if (token) {
          const fetchedComments = await getPostComments(post.id, token)
          setComments(fetchedComments)
        }
      } catch (err) {
        console.error("Failed to fetch comments:", err)
      } finally {
        setIsLoadingComments(false)
      }
    }
    setShowComments(!showComments)
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !isLoggedIn) return

    setIsPostingComment(true)
    try {
      const token = getToken()
      if (token) {
        const comment = await addComment(post.id, newComment, token)
        setComments([comment, ...comments])
        setNewComment("")
        toast.success("Comment added!")
      }
    } catch (err) {
      console.error("Failed to add comment:", err)
      toast.error("Failed to add comment")
    } finally {
      setIsPostingComment(false)
    }
  }

  const handleFollow = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to connect with users")
      return
    }

    setIsFollowing(true)
    try {
      const token = getToken()
      if (token) {
        if (following) {
          await disconnectFromUser(post.author.id, token)
          setFollowing(false)
          toast.success("Disconnected")
        } else {
          await connectWithUser(post.author.id, token)
          setFollowing(true)
          toast.success("Connected!")
        }
      }
    } catch (err) {
      console.error("Failed to update connection:", err)
      toast.error("Failed to update connection")
    } finally {
      setIsFollowing(false)
    }
  }

  const handleLike = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to like posts")
      return
    }

    // Store previous state for rollback
    const previousLiked = liked
    const previousLikeCount = likeCount

    // Optimistic update
    setLiked(!liked)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))

    setIsLiking(true)
    try {
      const token = getToken()
      if (token) {
        if (previousLiked) {
          await unlikePost(post.id, token)
        } else {
          await likePost(post.id, token)
        }
      }
    } catch (err) {
      console.error("Failed to like post:", err)
      // Rollback on error
      setLiked(previousLiked)
      setLikeCount(previousLikeCount)
      toast.error("Failed to update like. Please try again.")
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <Card className="border-purple-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
            <AvatarFallback
              className={
                isOfficial
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
              {isOfficial && (
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 ml-1"
                >
                  Official
                </Badge>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>@{post.author.name.toLowerCase().replace(/\s+/g, "")}</span>
              <span>•</span>
              <span>{formatRelativeTime(post.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isOfficial && post.author.id !== user?.id && (
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-3 ${
                  following
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50"
                    : "border border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                }`}
                onClick={handleFollow}
                disabled={isFollowing}
              >
                {isFollowing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : following ? (
                  <>
                    <UserCheck className="h-4 w-4 mr-1" />
                    <span className="text-xs">Connected</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1" />
                    <span className="text-xs">Connect</span>
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
        {post.location && (
          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="h-3 w-3" />
            <span>{post.location}</span>
          </div>
        )}
        {post.image && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img src={post.image || "/placeholder.svg"} alt="Post image" className="w-full h-auto" />
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 pb-2 flex-col">
        <div className="flex justify-between w-full text-gray-500 dark:text-gray-400">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 ${liked ? "text-red-500" : ""} hover:bg-red-50 dark:hover:bg-red-950`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            <span>{likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400 ${showComments ? 'text-blue-600 dark:text-blue-400' : ''}`}
            onClick={handleToggleComments}
          >
            <MessageCircle className={`h-4 w-4 ${showComments ? 'fill-blue-100' : ''}`} />
            <span>{post.comments + comments.length}</span>
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

        {/* Comments Section */}
        {showComments && (
          <div className="w-full mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            {/* Add comment input */}
            {isLoggedIn && (
              <div className="flex gap-2 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 h-8 text-sm"
                    disabled={isPostingComment}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleAddComment()
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    className="h-8"
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isPostingComment}
                  >
                    {isPostingComment ? <Loader2 className="h-3 w-3 animate-spin" /> : "Post"}
                  </Button>
                </div>
              </div>
            )}

            {/* Comments list */}
            {isLoadingComments ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{comment.author.name}</span>
                        <span className="text-xs text-gray-500">{formatRelativeTime(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">No comments yet. Be the first to comment!</p>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
