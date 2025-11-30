"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ArrowLeft, Briefcase, Calendar, Filter, MapPin, Search, Star, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getJobs, applyForJob, getMyJobApplications } from "@/lib/api-service"
import { getToken } from "@/lib/auth-service"
import { useAuth } from "@/components/auth-provider"
import type { Job, JobApplication } from "@/lib/types"
import { toast } from "sonner"

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Digital Marketing Assistant",
    company: "TechSolutions Ltd",
    location: "Mumbai, Maharashtra",
    description: "Assist in managing social media accounts, email campaigns, and digital marketing initiatives.",
    requirements: ["Social Media", "Marketing", "Content Creation"],
    salary: "₹3-5 LPA",
    isNew: true,
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Community Manager",
    company: "Local Government",
    location: "Delhi NCR",
    description: "Manage community engagement programs and organize local events.",
    requirements: ["Community Development", "Event Management", "Public Relations"],
    salary: "₹5-8 LPA",
    isNew: false,
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Data Entry Operator",
    company: "Public Services",
    location: "Bangalore, Karnataka",
    description: "Enter and maintain data in government databases and process applications.",
    requirements: ["Data Entry", "MS Office", "Administration"],
    salary: "₹2-3 LPA",
    isNew: false,
    postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    title: "Web Developer",
    company: "InnoTech Solutions",
    location: "Hyderabad, Telangana",
    description: "Develop web applications using React, Node.js, and database technologies.",
    requirements: ["React", "Node.js", "MongoDB"],
    salary: "₹8-12 LPA",
    isNew: true,
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

function formatPostedDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [myApplications, setMyApplications] = useState<JobApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const { isLoggedIn } = useAuth()

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    try {
      const fetchedJobs = await getJobs()
      setJobs(fetchedJobs.length > 0 ? fetchedJobs : mockJobs)
    } catch {
      setJobs(mockJobs)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchMyApplications = useCallback(async () => {
    if (!isLoggedIn) return
    const token = getToken()
    if (!token) return
    try {
      const applications = await getMyJobApplications(token)
      setMyApplications(applications)
    } catch {
      // Silently handle error
    }
  }, [isLoggedIn])

  useEffect(() => {
    fetchJobs()
    fetchMyApplications()
  }, [fetchJobs, fetchMyApplications])

  const handleApply = async (jobId: string) => {
    if (!isLoggedIn) {
      toast.error("Please login to apply for jobs")
      return
    }
    const token = getToken()
    if (!token) return
    setApplyingJobId(jobId)
    try {
      await applyForJob(jobId, token)
      toast.success("Application submitted successfully!")
      await fetchMyApplications()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to apply")
    } finally {
      setApplyingJobId(null)
    }
  }

  const hasApplied = (jobId: string) => myApplications.some(app => app.jobId === jobId)
  const getApplicationStatus = (jobId: string) => myApplications.find(app => app.jobId === jobId)?.status

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = locationFilter === "all" || job.location.toLowerCase().includes(locationFilter.toLowerCase())
    return matchesSearch && matchesLocation
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}><CardHeader><Skeleton className="h-6 w-full" /></CardHeader></Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderJobCard = (job: Job) => {
    const applied = hasApplied(job.id)
    const status = getApplicationStatus(job.id)
    return (
      <Card key={job.id} className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <div>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>{job.company}</CardDescription>
            </div>
            {job.isNew && <Badge className="bg-green-100 text-green-800 border-0">New</Badge>}
            {applied && <Badge className="bg-blue-100 text-blue-800 border-0">{status || "Applied"}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500"><MapPin className="h-4 w-4 mr-1" />{job.location}</div>
            <div className="flex items-center text-sm text-gray-500"><Briefcase className="h-4 w-4 mr-1" />{job.salary || "Competitive"}</div>
            <div className="flex items-center text-sm text-gray-500"><Calendar className="h-4 w-4 mr-1" />Posted {formatPostedDate(job.postedAt)}</div>
            <p className="text-sm line-clamp-2">{job.description}</p>
            <div className="flex flex-wrap gap-2">
              {job.requirements.slice(0, 3).map((req, i) => (
                <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{req}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {applied ? (
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600" disabled>Applied - {status}</Button>
          ) : (
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => handleApply(job.id)} disabled={applyingJobId === job.id}>
              {applyingJobId === job.id ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Applying...</> : "Apply Now"}
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center text-purple-700 hover:text-purple-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /><span>Back to Home</span>
        </Link>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Jobs & Opportunities</h1>
            <p className="text-gray-500">Find opportunities in your community</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search jobs..." className="pl-9 border-purple-200" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Button variant="outline" size="icon" className="border-purple-200"><Filter className="h-4 w-4" /></Button>
          </div>
        </div>
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-purple-100 p-1">
            <TabsTrigger value="jobs" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Jobs ({filteredJobs.length})</TabsTrigger>
            <TabsTrigger value="applied" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">My Applications</TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Saved</TabsTrigger>
          </TabsList>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64">
              <Card className="border-purple-100">
                <CardHeader className="pb-2"><CardTitle className="text-lg">Filters</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger className="border-purple-200"><SelectValue placeholder="Select location" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="mumbai">Mumbai</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="bangalore">Bangalore</SelectItem>
                        <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600" onClick={() => { setSearchQuery(""); setLocationFilter("all") }}>Clear Filters</Button>
                </CardContent>
              </Card>
            </div>
            <div className="flex-1">
              <TabsContent value="jobs" className="mt-0">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-12"><Briefcase className="h-12 w-12 mx-auto text-gray-300" /><h2 className="mt-4 text-xl">No jobs found</h2></div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{filteredJobs.map(job => renderJobCard(job))}</div>
                )}
              </TabsContent>
              <TabsContent value="applied" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredJobs.filter(job => hasApplied(job.id)).map(job => renderJobCard(job))}
                  {filteredJobs.filter(job => hasApplied(job.id)).length === 0 && (
                    <div className="col-span-full text-center py-12"><Briefcase className="h-12 w-12 mx-auto text-gray-300" /><h2 className="mt-4 text-xl">No applications yet</h2></div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="saved" className="mt-0">
                <div className="text-center py-12"><Star className="h-12 w-12 mx-auto text-gray-300" /><h2 className="mt-4 text-xl">No saved jobs</h2></div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
