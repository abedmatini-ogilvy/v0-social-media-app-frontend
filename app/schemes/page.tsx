"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ArrowLeft, Calendar, CheckCircle, Clock, FileText, Filter, Search, Users, Loader2 } from "lucide-react"
import { getSchemes, applyForScheme, getMySchemeApplications } from "@/lib/api-service"
import { getToken } from "@/lib/auth-service"
import { useAuth } from "@/components/auth-provider"
import type { Scheme, SchemeApplication } from "@/lib/types"
import { toast } from "sonner"

// Fallback mock data for when API is not available
const mockSchemes: Scheme[] = [
  {
    id: "1",
    title: "Digital Literacy Program",
    description: "Free training program to learn basic computer skills, internet usage, and accessing government services online.",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: true,
    eligibility: "All citizens aged 14 and above",
    documents: ["Aadhaar Card", "Address Proof"],
    fundingDetails: "Free program, no cost to beneficiary",
    applicationProcess: "Apply online through portal",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "PM Kisan Samman Nidhi",
    description: "Direct income support of ₹6,000 per year to farmer families across the country in three equal installments.",
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: false,
    eligibility: "Landholding farmer families",
    documents: ["Aadhaar Card", "Land Records", "Bank Account"],
    fundingDetails: "₹6,000 per year",
    applicationProcess: "Apply at nearest CSC or online",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Skill India Initiative",
    description: "Vocational training program to enhance employability skills in various sectors including IT, manufacturing, and services.",
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: true,
    eligibility: "Youth aged 18-35",
    documents: ["Aadhaar Card", "Educational Certificates"],
    fundingDetails: "Free training with stipend",
    applicationProcess: "Register through Skill India portal",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Startup India",
    description: "Initiative to catalyze startup culture and build a strong ecosystem for innovation and entrepreneurship in India.",
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: false,
    eligibility: "Entrepreneurs with innovative ideas",
    documents: ["Business Plan", "ID Proof", "Bank Account"],
    fundingDetails: "Various funding options available",
    applicationProcess: "Register on Startup India portal",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Ayushman Bharat",
    description: "Health insurance scheme providing coverage up to ₹5 lakhs per family per year for secondary and tertiary care hospitalization.",
    deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: false,
    eligibility: "Economically weaker sections",
    documents: ["Aadhaar Card", "Income Certificate", "Ration Card"],
    fundingDetails: "Up to ₹5 lakhs per family per year",
    applicationProcess: "Apply at empaneled hospitals or CSC",
    createdAt: new Date().toISOString(),
  },
]

// Helper function to format deadline
function formatDeadline(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return "Expired"
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays <= 7) return `${diffDays} days left`
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
}

// Color schemes for cards
const cardColors = [
  { bg: "from-blue-500 to-cyan-500", badge: "text-blue-700", button: "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700", light: "bg-blue-50" },
  { bg: "from-green-500 to-teal-500", badge: "text-green-700", button: "from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700", light: "bg-green-50" },
  { bg: "from-purple-500 to-indigo-500", badge: "text-purple-700", button: "from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700", light: "bg-purple-50" },
  { bg: "from-orange-500 to-amber-500", badge: "text-orange-700", button: "from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700", light: "bg-orange-50" },
  { bg: "from-red-500 to-pink-500", badge: "text-red-700", button: "from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700", light: "bg-red-50" },
  { bg: "from-cyan-500 to-blue-500", badge: "text-cyan-700", button: "from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700", light: "bg-cyan-50" },
]

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [myApplications, setMyApplications] = useState<SchemeApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [applyingSchemeId, setApplyingSchemeId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { isLoggedIn } = useAuth()

  const fetchSchemes = useCallback(async () => {
    setIsLoading(true)
    try {
      const fetchedSchemes = await getSchemes()
      setSchemes(fetchedSchemes.length > 0 ? fetchedSchemes : mockSchemes)
    } catch (error) {
      console.error("Failed to fetch schemes:", error)
      // Fall back to mock data
      setSchemes(mockSchemes)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchMyApplications = useCallback(async () => {
    if (!isLoggedIn) return
    const token = getToken()
    if (!token) return
    
    try {
      const applications = await getMySchemeApplications(token)
      setMyApplications(applications)
    } catch (error) {
      console.error("Failed to fetch applications:", error)
    }
  }, [isLoggedIn])

  useEffect(() => {
    fetchSchemes()
    fetchMyApplications()
  }, [fetchSchemes, fetchMyApplications])

  const handleApply = async (schemeId: string) => {
    if (!isLoggedIn) {
      toast.error("Please login to apply for schemes")
      return
    }

    const token = getToken()
    if (!token) {
      toast.error("Please login to apply for schemes")
      return
    }

    setApplyingSchemeId(schemeId)
    try {
      await applyForScheme(schemeId, token)
      toast.success("Application submitted successfully!")
      // Refresh applications
      await fetchMyApplications()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to apply"
      toast.error(errorMessage)
    } finally {
      setApplyingSchemeId(null)
    }
  }

  const hasApplied = (schemeId: string) => {
    return myApplications.some(app => app.schemeId === schemeId)
  }

  const getApplicationStatus = (schemeId: string) => {
    const app = myApplications.find(app => app.schemeId === schemeId)
    return app?.status
  }

  const filteredSchemes = schemes.filter(scheme =>
    scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-gray-100">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderSchemeCard = (scheme: Scheme, index: number) => {
    const color = cardColors[index % cardColors.length]
    const applied = hasApplied(scheme.id)
    const status = getApplicationStatus(scheme.id)

    return (
      <Card key={scheme.id} className="border-gray-100 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className={`pb-2 bg-gradient-to-r ${color.bg} text-white rounded-t-lg`}>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{scheme.title}</CardTitle>
            {scheme.isNew && <Badge className={`bg-white ${color.badge}`}>New</Badge>}
          </div>
          <CardDescription className="text-white/80">{scheme.eligibility}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{scheme.description}</p>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-gray-500">
              <FileText className="h-4 w-4 mr-1" />
              <span>{scheme.documents.length} documents</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDeadline(scheme.deadline)}</span>
            </div>
            {applied ? (
              <div className="flex items-center text-blue-600 col-span-2">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Applied - {status}</span>
              </div>
            ) : isLoggedIn ? (
              <div className="flex items-center text-green-600 col-span-2">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Eligible to apply</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-500 col-span-2">
                <FileText className="h-4 w-4 mr-1" />
                <span>Login to apply</span>
              </div>
            )}
          </div>

          <div className={`mt-4 p-2 ${color.light} rounded-md`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-700">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Deadline: {formatDeadline(scheme.deadline)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            asChild
          >
            <Link href={`/schemes/${scheme.id}`}>View Details</Link>
          </Button>
          {applied ? (
            <Button 
              className={`flex-1 bg-gradient-to-r ${color.button}`}
              disabled
            >
              Applied
            </Button>
          ) : (
            <Button 
              className={`flex-1 bg-gradient-to-r ${color.button}`}
              onClick={() => handleApply(scheme.id)}
              disabled={applyingSchemeId === scheme.id}
            >
              {applyingSchemeId === scheme.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply Now"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-16 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center text-purple-700 hover:text-purple-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Home</span>
        </Link>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Government Schemes</h1>
            <p className="text-gray-500">Discover and apply for government schemes and benefits</p>
          </div>

          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search schemes..." 
                className="pl-9 border-purple-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="border-purple-200">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Show empty state if no schemes match */}
        {filteredSchemes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-300" />
            <h2 className="mt-4 text-xl font-medium">No schemes found</h2>
            <p className="mt-2 text-gray-500">
              {searchQuery ? "Try a different search term" : "No schemes are currently available"}
            </p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6 bg-purple-100 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
                All Schemes ({filteredSchemes.length})
              </TabsTrigger>
              <TabsTrigger value="new" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
                New
              </TabsTrigger>
              <TabsTrigger value="applied" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
                My Applications
              </TabsTrigger>
              <TabsTrigger value="expiring" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
                Expiring Soon
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchemes.map((scheme, index) => renderSchemeCard(scheme, index))}
              </div>
            </TabsContent>

            <TabsContent value="new">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchemes
                  .filter(scheme => scheme.isNew)
                  .map((scheme, index) => renderSchemeCard(scheme, index))}
              </div>
            </TabsContent>

            <TabsContent value="applied">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchemes
                  .filter(scheme => hasApplied(scheme.id))
                  .map((scheme, index) => renderSchemeCard(scheme, index))}
                {filteredSchemes.filter(scheme => hasApplied(scheme.id)).length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-gray-300" />
                    <p className="mt-4 text-gray-500">You haven't applied for any schemes yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="expiring">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchemes
                  .filter(scheme => {
                    const deadline = new Date(scheme.deadline)
                    const now = new Date()
                    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                    return diffDays <= 30 && diffDays >= 0
                  })
                  .map((scheme, index) => renderSchemeCard(scheme, index))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
