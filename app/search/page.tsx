"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Calendar, CheckCircle, FileText, Filter, MapPin, SearchIcon, Users } from "lucide-react"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 pb-16 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="flex items-center text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Home</span>
        </Link>

        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-3xl font-bold mb-6">Search CivicConnect</h1>
          <div className="w-full max-w-3xl flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for schemes, officials, events, or community posts..."
                className="pl-10 py-6 text-lg border-purple-200 dark:border-purple-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="border-purple-200 dark:border-purple-900">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-6 bg-purple-100 dark:bg-gray-800 p-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="schemes"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              Schemes
            </TabsTrigger>
            <TabsTrigger
              value="officials"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              Officials
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              Community
            </TabsTrigger>
          </TabsList>

          {searchQuery ? (
            <>
              <TabsContent value="all" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Schemes */}
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>Schemes</CardTitle>
                        <Button
                          variant="link"
                          className="text-purple-600 dark:text-purple-400"
                          onClick={() => setActiveTab("schemes")}
                        >
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Digital Literacy Program</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Ministry of Electronics & IT</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                            New
                          </Badge>
                        </div>
                        <p className="text-sm mt-2">
                          Free training program to learn basic computer skills, internet usage, and accessing government
                          services online.
                        </p>
                      </div>

                      <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">PM Kisan Samman Nidhi</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Ministry of Agriculture</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-0">
                            Popular
                          </Badge>
                        </div>
                        <p className="text-sm mt-2">
                          Direct income support of ₹6,000 per year to farmer families across the country in three equal
                          installments.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Officials */}
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>Officials</CardTitle>
                        <Button
                          variant="link"
                          className="text-purple-600 dark:text-purple-400"
                          onClick={() => setActiveTab("officials")}
                        >
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Dr. Suresh Mehta" />
                            <AvatarFallback className="bg-blue-500">SM</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">Dr. Suresh Mehta</h3>
                              <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-500 ml-1" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Chief Medical Officer, Health Department
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Mumbai Municipal Corporation</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Anita Desai" />
                            <AvatarFallback className="bg-blue-500">AD</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">Anita Desai</h3>
                              <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-500 ml-1" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Senior Engineer, Public Works Department
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Delhi Development Authority</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Events */}
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>Events</CardTitle>
                        <Button
                          variant="link"
                          className="text-purple-600 dark:text-purple-400"
                          onClick={() => setActiveTab("events")}
                        >
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Digital Literacy Workshop</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Digital India Initiative</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                            Upcoming
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>June 15, 2023 • 10:00 AM - 1:00 PM</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Community Center, Sector 15</span>
                        </div>
                      </div>

                      <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Public Hearing on Infrastructure</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Municipal Corporation</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-0">
                            Official
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>June 20, 2023 • 11:00 AM - 2:00 PM</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Municipal Hall</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Community */}
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>Community</CardTitle>
                        <Button
                          variant="link"
                          className="text-purple-600 dark:text-purple-400"
                          onClick={() => setActiveTab("community")}
                        >
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Ravi Kumar" />
                            <AvatarFallback className="bg-green-500">RK</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">Ravi Kumar</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">2 days ago</p>
                            <p className="text-sm mt-1">
                              Just attended the digital literacy workshop at our community center. Great initiative by
                              the local government!
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Priya Sharma" />
                            <AvatarFallback className="bg-green-500">PS</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">Priya Sharma</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">3 days ago</p>
                            <p className="text-sm mt-1">
                              Just used the new water bill payment feature on the CivicConnect app. So convenient! No
                              more standing in long queues.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="schemes" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">Digital Literacy Program</CardTitle>
                        <Badge className="bg-white text-blue-700">Education</Badge>
                      </div>
                      <CardDescription className="text-blue-100">Ministry of Electronics & IT</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        Free training program to learn basic computer skills, internet usage, and accessing government
                        services online.
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>5M+ beneficiaries</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Launched: Jan 2023</span>
                        </div>
                        <div className="flex items-center text-green-600 dark:text-green-400 col-span-2">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>Eligible based on your profile</span>
                        </div>
                      </div>

                      <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">PM Kisan Samman Nidhi</CardTitle>
                        <Badge className="bg-white text-green-700">Welfare</Badge>
                      </div>
                      <CardDescription className="text-green-100">Ministry of Agriculture</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        Direct income support of ₹6,000 per year to farmer families across the country in three equal
                        installments.
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>120M+ beneficiaries</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Launched: Dec 2018</span>
                        </div>
                        <div className="flex items-center text-yellow-600 dark:text-yellow-400 col-span-2">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>Eligibility check required</span>
                        </div>
                      </div>

                      <Button className="w-full mt-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                        Check Eligibility
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">Skill India Initiative</CardTitle>
                        <Badge className="bg-white text-purple-700">Employment</Badge>
                      </div>
                      <CardDescription className="text-purple-100">Ministry of Skill Development</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        Vocational training program to enhance employability skills in various sectors including IT,
                        manufacturing, and services.
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>10M+ beneficiaries</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Launched: Jul 2015</span>
                        </div>
                        <div className="flex items-center text-green-600 dark:text-green-400 col-span-2">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>Eligible based on your profile</span>
                        </div>
                      </div>

                      <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="officials" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <Avatar className="h-24 w-24 mb-4">
                          <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Dr. Suresh Mehta" />
                          <AvatarFallback className="bg-blue-500 text-xl">SM</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center">
                          <h3 className="text-xl font-bold">Dr. Suresh Mehta</h3>
                          <CheckCircle className="h-5 w-5 text-blue-500 fill-blue-500 ml-1" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">Chief Medical Officer</p>
                        <p className="text-gray-500 dark:text-gray-400">Health Department</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Office</span>
                          <span>Mumbai Municipal Corporation</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Contact</span>
                          <span>health.officer@mumbai.gov.in</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Office Hours</span>
                          <span>Mon-Fri, 10:00 AM - 5:00 PM</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1">Message</Button>
                        <Button variant="outline" className="flex-1">
                          Schedule Meeting
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <Avatar className="h-24 w-24 mb-4">
                          <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Anita Desai" />
                          <AvatarFallback className="bg-blue-500 text-xl">AD</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center">
                          <h3 className="text-xl font-bold">Anita Desai</h3>
                          <CheckCircle className="h-5 w-5 text-blue-500 fill-blue-500 ml-1" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">Senior Engineer</p>
                        <p className="text-gray-500 dark:text-gray-400">Public Works Department</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Office</span>
                          <span>Delhi Development Authority</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Contact</span>
                          <span>engineer@dda.gov.in</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Office Hours</span>
                          <span>Mon-Fri, 9:00 AM - 4:30 PM</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1">Message</Button>
                        <Button variant="outline" className="flex-1">
                          Schedule Meeting
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <Avatar className="h-24 w-24 mb-4">
                          <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Rajesh Khanna" />
                          <AvatarFallback className="bg-blue-500 text-xl">RK</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center">
                          <h3 className="text-xl font-bold">Rajesh Khanna</h3>
                          <CheckCircle className="h-5 w-5 text-blue-500 fill-blue-500 ml-1" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">District Collector</p>
                        <p className="text-gray-500 dark:text-gray-400">Revenue Department</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Office</span>
                          <span>Jaipur District Administration</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Contact</span>
                          <span>collector@jaipur.gov.in</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Office Hours</span>
                          <span>Mon-Fri, 10:00 AM - 5:00 PM</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1">Message</Button>
                        <Button variant="outline" className="flex-1">
                          Schedule Meeting
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="events" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Digital Literacy Workshop</CardTitle>
                          <CardDescription>Digital India Initiative</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                          Upcoming
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>June 15, 2023 • 10:00 AM - 1:00 PM</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>Community Center, Sector 15, New Delhi</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Learn basic computer skills, internet usage, and how to access government services online.
                          Suitable for beginners and seniors.
                        </p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-2" />
                          <span>45 people attending</span>
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1">Register</Button>
                          <Button variant="outline" className="flex-1">
                            Add to Calendar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Public Hearing on Infrastructure</CardTitle>
                          <CardDescription>Municipal Corporation</CardDescription>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-0">
                          Official
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>June 20, 2023 • 11:00 AM - 2:00 PM</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>Municipal Hall, City Center</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Public hearing on proposed infrastructure development projects in the city. Citizens are
                          invited to share their feedback and concerns.
                        </p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-2" />
                          <span>120 people attending</span>
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1">Register</Button>
                          <Button variant="outline" className="flex-1">
                            Add to Calendar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Job Fair 2023</CardTitle>
                          <CardDescription>Ministry of Labor & Employment</CardDescription>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-0">
                          Featured
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>July 5-6, 2023 • 9:00 AM - 5:00 PM</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>Exhibition Center, Pragati Maidan</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Annual job fair with over 100 employers from various sectors. Bring your resume and be
                          prepared for on-the-spot interviews.
                        </p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-2" />
                          <span>1,500+ people attending</span>
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1">Register</Button>
                          <Button variant="outline" className="flex-1">
                            Add to Calendar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Farmers' Training Program</CardTitle>
                          <CardDescription>Agricultural Extension Division</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                          Upcoming
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>June 25-27, 2023 • 9:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>Agricultural Research Center, Sector 45</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Three-day training program on modern farming techniques, crop management, and government
                          schemes for farmers.
                        </p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-2" />
                          <span>200 people attending</span>
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1">Register</Button>
                          <Button variant="outline" className="flex-1">
                            Add to Calendar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="community" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Ravi Kumar" />
                          <AvatarFallback className="bg-green-500">RK</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Ravi Kumar</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Delhi, India</p>
                          <p className="text-sm mt-2">
                            Just attended the digital literacy workshop at our community center. Great initiative by the
                            local government! They taught us how to use government websites to access various services
                            online. No more standing in long queues!
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <path d="M7 10v12" />
                                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                              </svg>
                              Like (24)
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                              Comment (5)
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" y1="2" x2="12" y2="15" />
                              </svg>
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Priya Sharma" />
                          <AvatarFallback className="bg-green-500">PS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Priya Sharma</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Mumbai, India</p>
                          <p className="text-sm mt-2">
                            Just used the new water bill payment feature on the CivicConnect app. So convenient! No more
                            standing in long queues. The app also shows my consumption patterns and gives tips on water
                            conservation. Highly recommend!
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <path d="M7 10v12" />
                                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                              </svg>
                              Like (36)
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                              Comment (8)
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" y1="2" x2="12" y2="15" />
                              </svg>
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 dark:border-purple-900">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Amit Patel" />
                          <AvatarFallback className="bg-green-500">AP</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Amit Patel</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">5 days ago</p>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Ahmedabad, India</p>
                          <p className="text-sm mt-2">
                            Has anyone applied for the PM Kisan Samman Nidhi scheme? I submitted my application last
                            week, but haven't received any confirmation yet. Any idea how long it usually takes?
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <path d="M7 10v12" />
                                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                              </svg>
                              Like (12)
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                              Comment (15)
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" y1="2" x2="12" y2="15" />
                              </svg>
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </>
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
              <h2 className="mt-4 text-xl font-medium">Search for something</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Enter a search term to find schemes, officials, events, or community posts.
              </p>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  )
}
