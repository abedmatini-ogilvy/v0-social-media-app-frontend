"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, BarChart3, Download, LineChart, PieChart, TrendingUp, Users } from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")

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
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Track your community engagement and impact</p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] border-purple-200 dark:border-purple-900">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-purple-200 dark:border-purple-900">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6 bg-purple-100 dark:bg-gray-800 p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="engagement"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              Engagement
            </TabsTrigger>
            <TabsTrigger
              value="schemes"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              Schemes
            </TabsTrigger>
            <TabsTrigger
              value="demographics"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
            >
              Demographics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Users</CardTitle>
                  <CardDescription>Active users on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">125,430</div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">+12.5% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Engagement Rate</CardTitle>
                  <CardDescription>Average daily engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">68.2%</div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">+5.3% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Scheme Applications</CardTitle>
                  <CardDescription>Total applications submitted</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12,845</div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">+7.8% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Issue Resolution</CardTitle>
                  <CardDescription>Average resolution time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">2.4 days</div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">-0.5 days from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader>
                  <CardTitle>User Growth Trend</CardTitle>
                  <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                    <LineChart className="h-16 w-16 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader>
                  <CardTitle>Platform Usage</CardTitle>
                  <CardDescription>Most used features and sections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                    <PieChart className="h-16 w-16 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-purple-100 dark:border-purple-900">
              <CardHeader>
                <CardTitle>Key Metrics Overview</CardTitle>
                <CardDescription>Performance across all major metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                  <BarChart3 className="h-16 w-16 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Daily Active Users</CardTitle>
                  <CardDescription>Average users per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">45,280</div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">+8.3% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Posts Created</CardTitle>
                  <CardDescription>Total posts in time period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">24,567</div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">+12.1% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Comments</CardTitle>
                  <CardDescription>Total comments in time period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">78,912</div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">+15.7% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Avg. Session Time</CardTitle>
                  <CardDescription>Time spent per session</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">8.5 min</div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">+1.2 min from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader>
                  <CardTitle>User Engagement by Time</CardTitle>
                  <CardDescription>Activity patterns throughout the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                    <LineChart className="h-16 w-16 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader>
                  <CardTitle>Content Engagement</CardTitle>
                  <CardDescription>Most engaging content types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                    <BarChart3 className="h-16 w-16 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-purple-100 dark:border-purple-900">
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
                <CardDescription>Posts with highest engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Emergency Alert: Heavy Rainfall</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Mumbai Meteorological Department</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>45.2K views</span>
                        </div>
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>98% engagement</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">
                      Heavy rainfall expected in Mumbai region for next 48 hours. Please stay indoors and avoid
                      unnecessary travel.
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Digital Literacy Program Launch</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Digital India Initiative</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>38.7K views</span>
                        </div>
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>92% engagement</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">
                      Proud to announce that over 5 million citizens have been trained in basic digital skills across 15
                      states. Our mission continues to bridge the digital divide.
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Free Health Checkup Camp</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ministry of Health</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>32.1K views</span>
                        </div>
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>89% engagement</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">
                      Free health checkup camps will be organized across all districts from June 20-25. Services include
                      general health checkup, eye examination, and diabetes screening.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schemes Tab */}
          <TabsContent value="schemes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Applications</CardTitle>
                  <CardDescription>Scheme applications submitted</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12,845</div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">+7.8% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Approval Rate</CardTitle>
                  <CardDescription>Applications approved</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">78.5%</div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">+2.3% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Processing Time</CardTitle>
                  <CardDescription>Average application processing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3.2 days</div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">-0.8 days from last month</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Schemes</CardTitle>
                  <CardDescription>Currently active schemes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">78</div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">+3 from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader>
                  <CardTitle>Scheme Popularity</CardTitle>
                  <CardDescription>Most popular government schemes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                    <BarChart3 className="h-16 w-16 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader>
                  <CardTitle>Application Trends</CardTitle>
                  <CardDescription>Application volume over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                    <LineChart className="h-16 w-16 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-purple-100 dark:border-purple-900">
              <CardHeader>
                <CardTitle>Top Performing Schemes</CardTitle>
                <CardDescription>Schemes with highest application rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">PM Kisan Samman Nidhi</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ministry of Agriculture</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>120M+ beneficiaries</span>
                        </div>
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>95% approval rate</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">
                      Direct income support of ₹6,000 per year to farmer families across the country in three equal
                      installments.
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Digital Literacy Program</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ministry of Electronics & IT</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>5M+ beneficiaries</span>
                        </div>
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>92% approval rate</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">
                      Free training program to learn basic computer skills, internet usage, and accessing government
                      services online.
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Ayushman Bharat</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ministry of Health & Family Welfare</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>500M+ beneficiaries</span>
                        </div>
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>88% approval rate</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">
                      Health insurance scheme providing coverage up to ₹5 lakhs per family per year for secondary and
                      tertiary care hospitalization.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demographics Tab */}
          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Age Distribution</CardTitle>
                  <CardDescription>User age demographics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[150px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                    <PieChart className="h-12 w-12 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Gender Distribution</CardTitle>
                  <CardDescription>User gender demographics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[150px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                    <PieChart className="h-12 w-12 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Location</CardTitle>
                  <CardDescription>User geographical distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[150px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                    <PieChart className="h-12 w-12 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Language</CardTitle>
                  <CardDescription>User language preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[150px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                    <PieChart className="h-12 w-12 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader>
                  <CardTitle>Regional User Distribution</CardTitle>
                  <CardDescription>Users by state and region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                    <BarChart3 className="h-16 w-16 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader>
                  <CardTitle>Urban vs Rural Distribution</CardTitle>
                  <CardDescription>User distribution by area type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                    <PieChart className="h-16 w-16 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-purple-100 dark:border-purple-900">
              <CardHeader>
                <CardTitle>Device & Access Analytics</CardTitle>
                <CardDescription>How users access the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <h3 className="font-medium mb-2">Device Type</h3>
                    <div className="h-[200px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                      <PieChart className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="mt-4 text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Mobile</span>
                        <span>78%</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Desktop</span>
                        <span>18%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tablet</span>
                        <span>4%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <h3 className="font-medium mb-2">Browser</h3>
                    <div className="h-[200px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                      <PieChart className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="mt-4 text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Chrome</span>
                        <span>62%</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Safari</span>
                        <span>24%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Others</span>
                        <span>14%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <h3 className="font-medium mb-2">Connection Type</h3>
                    <div className="h-[200px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                      <PieChart className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="mt-4 text-sm">
                      <div className="flex justify-between mb-1">
                        <span>4G</span>
                        <span>65%</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>WiFi</span>
                        <span>30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Others</span>
                        <span>5%</span>
                      </div>
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
