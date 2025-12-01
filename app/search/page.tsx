"use client"

import { useState, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ArrowLeft, Calendar, CheckCircle, FileText, Filter, MapPin, SearchIcon, Users, Loader2 } from "lucide-react"
import { search } from "@/lib/api-service"
import { getToken } from "@/lib/auth-service"
import { useAuth } from "@/components/auth-provider"
import type { User, Post, Scheme, Job, Event, SearchResponse } from "@/lib/types"
import { toast } from "sonner"

const emptySearchResults: SearchResponse = { users: [], posts: [], schemes: [], jobs: [], events: [] }

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResponse>(emptySearchResults)
  const [hasSearched, setHasSearched] = useState(false)
  const { isLoggedIn } = useAuth()

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    setHasSearched(true)
    
    try {
      const token = getToken()
      if (token) {
        const searchResults = await search(searchQuery, token)
        setResults(searchResults)
      } else {
        // Return empty results for non-authenticated users
        setResults(emptySearchResults)
        toast.info("Login to see personalized search results")
      }
    } catch {
      setResults(emptySearchResults)
      toast.error("Search failed. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery])

  const totalResults = results.users.length + results.posts.length + results.schemes.length + results.jobs.length + results.events.length

  const renderUserCard = (user: User) => (
    <div key={user.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3">
        <Avatar><AvatarImage src={user.avatar || "/placeholder.svg"} /><AvatarFallback className="bg-blue-500">{user.name?.[0] || "U"}</AvatarFallback></Avatar>
        <div>
          <div className="flex items-center">
            <h3 className="font-medium">{user.name || "Unknown"}</h3>
            {user.isVerified && <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-500 ml-1" />}
          </div>
          <p className="text-sm text-gray-500">{user.role === "official" ? "Government Official" : "Citizen"}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
    </div>
  )

  const renderSchemeCard = (scheme: Scheme) => (
    <div key={scheme.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{scheme.title}</h3>
          <p className="text-sm text-gray-500">{scheme.eligibility}</p>
        </div>
        {scheme.isNew && <Badge className="bg-green-100 text-green-800 border-0">New</Badge>}
      </div>
      <p className="text-sm mt-2 line-clamp-2">{scheme.description}</p>
      <Button size="sm" className="mt-2" asChild><Link href={`/schemes/${scheme.id}`}>View Details</Link></Button>
    </div>
  )

  const renderJobCard = (job: Job) => (
    <div key={job.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.company}</p>
        </div>
        {job.isNew && <Badge className="bg-green-100 text-green-800 border-0">New</Badge>}
      </div>
      <div className="flex items-center text-sm text-gray-500 mt-2"><MapPin className="h-4 w-4 mr-1" />{job.location}</div>
      <p className="text-sm mt-1 line-clamp-2">{job.description}</p>
      <Button size="sm" className="mt-2" asChild><Link href="/jobs">Apply Now</Link></Button>
    </div>
  )

  const renderEventCard = (event: Event) => (
    <div key={event.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{event.title}</h3>
          <p className="text-sm text-gray-500">{event.organizer}</p>
        </div>
        <Badge className="bg-green-100 text-green-800 border-0">Upcoming</Badge>
      </div>
      <div className="flex items-center text-sm text-gray-500 mt-2"><Calendar className="h-4 w-4 mr-1" />{new Date(event.date).toLocaleDateString()}</div>
      <div className="flex items-center text-sm text-gray-500 mt-1"><MapPin className="h-4 w-4 mr-1" />{event.location}</div>
      <p className="text-sm mt-1 line-clamp-2">{event.description}</p>
    </div>
  )

  const renderPostCard = (post: Post) => (
    <div key={post.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3">
        <Avatar><AvatarImage src={post.author?.avatar || "/placeholder.svg"} /><AvatarFallback className="bg-green-500">{post.author?.name?.[0] || "U"}</AvatarFallback></Avatar>
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="font-medium">{post.author?.name}</h3>
            <span className="text-xs text-gray-500 ml-2">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-sm mt-1 line-clamp-3">{post.content}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>❤️ {post.likes}</span>
            <span>💬 {post.comments}</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 pb-16 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center text-purple-700 hover:text-purple-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /><span>Back to Home</span>
        </Link>

        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-3xl font-bold mb-6">Search CivicConnect</h1>
          <div className="w-full max-w-3xl flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for schemes, officials, events, or community posts..."
                className="pl-10 py-6 text-lg border-purple-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} className="bg-gradient-to-r from-blue-600 to-purple-600 px-6">
              {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
            </Button>
            <Button variant="outline" size="icon" className="border-purple-200"><Filter className="h-5 w-5" /></Button>
          </div>
        </div>

        {isSearching ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : hasSearched ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-5 mb-6 bg-purple-100 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">All ({totalResults})</TabsTrigger>
              <TabsTrigger value="schemes" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Schemes ({results.schemes.length})</TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Officials ({results.users.length})</TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Events ({results.events.length})</TabsTrigger>
              <TabsTrigger value="posts" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Posts ({results.posts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {totalResults === 0 ? (
                <div className="text-center py-12">
                  <SearchIcon className="h-12 w-12 mx-auto text-gray-300" />
                  <h2 className="mt-4 text-xl font-medium">No results found</h2>
                  <p className="mt-2 text-gray-500">Try a different search term</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.schemes.length > 0 && (
                    <Card className="border-purple-100">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle>Schemes</CardTitle>
                          <Button variant="link" className="text-purple-600" asChild><Link href="/schemes">View All</Link></Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">{results.schemes.slice(0, 2).map(renderSchemeCard)}</CardContent>
                    </Card>
                  )}
                  {results.users.length > 0 && (
                    <Card className="border-purple-100">
                      <CardHeader className="pb-2"><CardTitle>Officials</CardTitle></CardHeader>
                      <CardContent className="space-y-4">{results.users.slice(0, 2).map(renderUserCard)}</CardContent>
                    </Card>
                  )}
                  {results.events.length > 0 && (
                    <Card className="border-purple-100">
                      <CardHeader className="pb-2"><CardTitle>Events</CardTitle></CardHeader>
                      <CardContent className="space-y-4">{results.events.slice(0, 2).map(renderEventCard)}</CardContent>
                    </Card>
                  )}
                  {results.posts.length > 0 && (
                    <Card className="border-purple-100">
                      <CardHeader className="pb-2"><CardTitle>Community Posts</CardTitle></CardHeader>
                      <CardContent className="space-y-4">{results.posts.slice(0, 2).map(renderPostCard)}</CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="schemes">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.schemes.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500">No schemes found</div>
                ) : results.schemes.map(renderSchemeCard)}
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.users.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500">No officials found</div>
                ) : results.users.map(renderUserCard)}
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.events.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500">No events found</div>
                ) : results.events.map(renderEventCard)}
              </div>
            </TabsContent>

            <TabsContent value="posts">
              <div className="grid grid-cols-1 gap-6">
                {results.posts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">No posts found</div>
                ) : results.posts.map(renderPostCard)}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="h-12 w-12 mx-auto text-gray-300" />
            <h2 className="mt-4 text-xl font-medium">Search for something</h2>
            <p className="mt-2 text-gray-500">Enter a search term to find schemes, officials, events, or community posts.</p>
          </div>
        )}
      </div>
    </div>
  )
}
