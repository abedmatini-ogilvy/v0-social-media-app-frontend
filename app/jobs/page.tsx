import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Briefcase, Calendar, Filter, MapPin, Search, Star, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="flex items-center text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Home</span>
        </Link>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Jobs & Local Offers</h1>
            <p className="text-gray-500 dark:text-gray-400">Find opportunities and deals in your community</p>
          </div>

          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search jobs & offers..." className="pl-9 border-purple-200 dark:border-purple-900" />
            </div>
            <Button variant="outline" size="icon" className="border-purple-200 dark:border-purple-900">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-purple-100 dark:bg-gray-800 p-1">
            <TabsTrigger
              value="jobs"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              Jobs
            </TabsTrigger>
            <TabsTrigger
              value="offers"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              Local Offers
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              Events
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters */}
            <div className="w-full md:w-64 space-y-4">
              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Select defaultValue="mumbai">
                      <SelectTrigger className="border-purple-200 dark:border-purple-900">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mumbai">Mumbai</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="bangalore">Bangalore</SelectItem>
                        <SelectItem value="hyderabad">Hyderabad</SelectItem>
                        <SelectItem value="chennai">Chennai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Type</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="border-purple-200 dark:border-purple-900">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Experience Level</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="border-purple-200 dark:border-purple-900">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Salary Range</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="border-purple-200 dark:border-purple-900">
                        <SelectValue placeholder="Select salary range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ranges</SelectItem>
                        <SelectItem value="0-3">₹0 - ₹3 LPA</SelectItem>
                        <SelectItem value="3-6">₹3 - ₹6 LPA</SelectItem>
                        <SelectItem value="6-10">₹6 - ₹10 LPA</SelectItem>
                        <SelectItem value="10-15">₹10 - ₹15 LPA</SelectItem>
                        <SelectItem value="15+">₹15+ LPA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Apply Filters
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Post a Job or Offer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Are you a business owner or recruiter? Post a job or local offer to reach people in your community.
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Post a Job
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-400"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Post an Offer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content */}
            <div className="flex-1">
              <TabsContent value="jobs" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Digital Marketing Assistant */}
                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>Digital Marketing Assistant</CardTitle>
                          <CardDescription>TechSolutions Ltd</CardDescription>
                        </div>
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-0">
                          New
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Mumbai, Maharashtra</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span>Full-time</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Entry Level (0-2 years)</span>
                        </div>
                        <p className="text-sm">
                          Assist in managing social media accounts, email campaigns, and digital marketing initiatives
                          for local businesses.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          >
                            Social Media
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                          >
                            Marketing
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                          >
                            Content Creation
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Apply Now
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Community Manager */}
                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>Community Manager</CardTitle>
                          <CardDescription>Local Government</CardDescription>
                        </div>
                        <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-0">
                          Government
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Delhi NCR</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span>Full-time</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Mid Level (2-5 years)</span>
                        </div>
                        <p className="text-sm">
                          Manage community engagement programs, organize local events, and facilitate communication
                          between citizens and government.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          >
                            Community Development
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                          >
                            Event Management
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                          >
                            Public Relations
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Apply Now
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Data Entry Operator */}
                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>Data Entry Operator</CardTitle>
                          <CardDescription>Public Services</CardDescription>
                        </div>
                        <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-0">
                          Government
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Bangalore, Karnataka</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span>Full-time</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Entry Level (0-1 years)</span>
                        </div>
                        <p className="text-sm">
                          Enter and maintain data in government databases, process applications, and assist with
                          administrative tasks.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          >
                            Data Entry
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                          >
                            MS Office
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                          >
                            Administration
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Apply Now
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Web Developer */}
                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>Web Developer</CardTitle>
                          <CardDescription>InnoTech Solutions</CardDescription>
                        </div>
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-0">
                          New
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Hyderabad, Telangana</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span>Full-time</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Mid Level (2-4 years)</span>
                        </div>
                        <p className="text-sm">
                          Develop and maintain web applications using modern technologies. Experience with React,
                          Node.js, and database management required.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          >
                            React
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                          >
                            Node.js
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                          >
                            MongoDB
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Apply Now
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="offers" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Grocery Store Discount */}
                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                      <div className="flex justify-between">
                        <CardTitle>20% Off on Groceries</CardTitle>
                        <Badge className="bg-white text-green-700 border-0">Limited Time</Badge>
                      </div>
                      <CardDescription className="text-green-100">Fresh Mart Supermarket</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Andheri West, Mumbai</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Valid till: June 30, 2023</span>
                        </div>
                        <p className="text-sm">
                          Get 20% off on all grocery purchases above ₹1000. Includes fresh produce, dairy, and household
                          essentials.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                        Get Coupon
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Restaurant Offer */}
                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
                      <div className="flex justify-between">
                        <CardTitle>Buy 1 Get 1 Free</CardTitle>
                        <Badge className="bg-white text-orange-700 border-0">Weekend Only</Badge>
                      </div>
                      <CardDescription className="text-orange-100">Spice Garden Restaurant</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Connaught Place, Delhi</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Valid on: Saturdays and Sundays</span>
                        </div>
                        <p className="text-sm">
                          Buy one main course and get another one free. Valid for dine-in only on weekends. Reservation
                          recommended.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                        Get Coupon
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Electronics Store */}
                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                      <div className="flex justify-between">
                        <CardTitle>Flat ₹2000 Off on Smartphones</CardTitle>
                        <Badge className="bg-white text-blue-700 border-0">New Launch</Badge>
                      </div>
                      <CardDescription className="text-blue-100">TechWorld Electronics</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Koramangala, Bangalore</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Valid till: July 15, 2023</span>
                        </div>
                        <p className="text-sm">
                          Get flat ₹2000 off on all smartphones priced above ₹15,000. Additional 10% off with HDFC Bank
                          cards.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                        Get Coupon
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Clothing Store */}
                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                      <div className="flex justify-between">
                        <CardTitle>50% Off on Summer Collection</CardTitle>
                        <Badge className="bg-white text-purple-700 border-0">Clearance Sale</Badge>
                      </div>
                      <CardDescription className="text-purple-100">Fashion Hub</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>T. Nagar, Chennai</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Valid till: June 25, 2023</span>
                        </div>
                        <p className="text-sm">
                          Get 50% off on all summer collection items. Additional 10% off on purchases above ₹3000.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Get Coupon
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Digital Literacy Workshop */}
                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                      <div className="flex justify-between">
                        <CardTitle>Digital Literacy Workshop</CardTitle>
                        <Badge className="bg-white text-blue-700 border-0">Free</Badge>
                      </div>
                      <CardDescription className="text-blue-100">Digital India Initiative</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Community Center, Sector 15</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>June 15, 2023 • 10:00 AM - 1:00 PM</span>
                        </div>
                        <p className="text-sm">
                          Learn basic computer skills, internet usage, and how to access government services online.
                          Open to all citizens.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Register
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Public Hearing */}
                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                      <div className="flex justify-between">
                        <CardTitle>Public Hearing on Infrastructure</CardTitle>
                        <Badge className="bg-white text-green-700 border-0">Official</Badge>
                      </div>
                      <CardDescription className="text-green-100">Municipal Corporation</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Municipal Hall</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>June 20, 2023 • 11:00 AM - 2:00 PM</span>
                        </div>
                        <p className="text-sm">
                          Public hearing on proposed infrastructure development projects in the city. Citizens are
                          invited to share their feedback.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                        Register
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Job Fair */}
                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
                      <div className="flex justify-between">
                        <CardTitle>Community Job Fair</CardTitle>
                        <Badge className="bg-white text-orange-700 border-0">Free Entry</Badge>
                      </div>
                      <CardDescription className="text-orange-100">Employment Department</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Exhibition Center, Sector 34</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>June 25, 2023 • 9:00 AM - 5:00 PM</span>
                        </div>
                        <p className="text-sm">
                          Job fair featuring over 50 companies hiring for various positions. Bring your resume and be
                          ready for on-the-spot interviews.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                        Register
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Health Camp */}
                  <Card className="border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
                      <div className="flex justify-between">
                        <CardTitle>Free Health Checkup Camp</CardTitle>
                        <Badge className="bg-white text-red-700 border-0">Free</Badge>
                      </div>
                      <CardDescription className="text-red-100">Ministry of Health</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Government Hospital, Sector 10</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>June 22-23, 2023 • 8:00 AM - 4:00 PM</span>
                        </div>
                        <p className="text-sm">
                          Free health checkup including general health, eye examination, and diabetes screening. Open to
                          all citizens.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                        Register
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
