"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Briefcase, Calendar, Users, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for suggested connections
const suggestedConnections = [
  {
    id: 1,
    name: "Amit Patel",
    role: "Urban Planner",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualConnections: 5,
  },
  {
    id: 2,
    name: "Neha Singh",
    role: "Community Organizer",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualConnections: 3,
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    role: "Local Business Owner",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualConnections: 2,
  },
]

// Sample data for schemes
const schemes = [
  { title: "PM Kisan Samman Nidhi", deadline: "June 30, 2023", isNew: true },
  { title: "Digital Literacy Program", deadline: "Open", isNew: false },
  { title: "Skill India Initiative", deadline: "July 15, 2023", isNew: true },
]

// Sample data for jobs
const jobs = [
  { title: "Digital Marketing Assistant", company: "TechSolutions Ltd", location: "Mumbai", isNew: true },
  { title: "Community Manager", company: "Local Government", location: "Delhi NCR", isNew: true },
  { title: "Data Entry Operator", company: "Public Services", location: "Bangalore", isNew: false },
]

// Sample data for events
const events = [
  { title: "Digital Literacy Workshop", date: "June 15, 2023", location: "Community Center, Sector 15" },
  { title: "Public Hearing on Infrastructure", date: "June 20, 2023", location: "Municipal Hall" },
]

export default function MobileSidebar() {
  const [activeTab, setActiveTab] = useState("connect")

  return (
    <div className="space-y-4">
      <Tabs defaultValue="connect" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4 bg-purple-100 p-1">
          <TabsTrigger
            value="connect"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400 text-xs"
          >
            Connect
          </TabsTrigger>
          <TabsTrigger
            value="schemes"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400 text-xs"
          >
            Schemes
          </TabsTrigger>
          <TabsTrigger
            value="jobs"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400 text-xs"
          >
            Jobs
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400 text-xs"
          >
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connect" className="mt-0">
          <Card className="border-purple-100 shadow-md overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <CardTitle className="text-md flex items-center">
                <Users className="h-4 w-4 mr-2" />
                People to Connect With
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {suggestedConnections.map((connection) => (
                  <div key={connection.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={connection.avatar || "/placeholder.svg"} alt={connection.name} />
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                          {connection.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{connection.name}</p>
                        <p className="text-xs text-gray-500">{connection.role}</p>
                        <p className="text-xs text-purple-600">{connection.mutualConnections} mutual connections</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      <span className="text-xs">Connect</span>
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full mt-2 text-purple-700 hover:bg-purple-50">
                  View More Suggestions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schemes" className="mt-0">
          <Card className="border-purple-100 shadow-md overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <CardTitle className="text-md flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Latest Schemes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {schemes.map((scheme, index) => (
                <SchemeItem key={index} title={scheme.title} deadline={scheme.deadline} isNew={scheme.isNew} />
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Link href="/schemes">View All Schemes</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="mt-0">
          <Card className="border-purple-100 shadow-md overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-green-500 to-teal-500 text-white">
              <CardTitle className="text-md flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Local Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {jobs.map((job, index) => (
                <JobItem
                  key={index}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  isNew={job.isNew}
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-green-200 text-green-700 hover:bg-green-50"
              >
                <Link href="/jobs">View All Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-0">
          <Card className="border-purple-100 shadow-md overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              <CardTitle className="text-md flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {events.map((event, index) => (
                <EventItem key={index} title={event.title} date={event.date} location={event.location} />
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                <Link href="/events">View Calendar</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface SchemeItemProps {
  title: string
  deadline: string
  isNew: boolean
}

function SchemeItem({ title, deadline, isNew }: SchemeItemProps) {
  return (
    <div className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-gray-500">Deadline: {deadline}</p>
        </div>
        {isNew && <Badge className="bg-green-100 text-green-800 text-xs border-0">New</Badge>}
      </div>
    </div>
  )
}

interface JobItemProps {
  title: string
  company: string
  location: string
  isNew: boolean
}

function JobItem({ title, company, location, isNew }: JobItemProps) {
  return (
    <div className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-gray-500">
            {company} • {location}
          </p>
        </div>
        {isNew && <Badge className="bg-green-100 text-green-800 text-xs border-0">New</Badge>}
      </div>
    </div>
  )
}

interface EventItemProps {
  title: string
  date: string
  location: string
}

function EventItem({ title, date, location }: EventItemProps) {
  return (
    <div className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
      <p className="font-medium text-sm">{title}</p>
      <p className="text-xs text-gray-500">{date}</p>
      <p className="text-xs text-gray-500">{location}</p>
    </div>
  )
}
