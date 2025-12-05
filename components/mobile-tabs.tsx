"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Briefcase,
  Calendar,
  Users,
  UserPlus,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  getSchemes,
  getJobs,
  getEvents,
  getSuggestedConnections,
} from "@/lib/api-service";
import { getToken } from "@/lib/auth-service";
import type { Scheme, Job, Event, User } from "@/lib/types";

// Fallback data
const fallbackConnections = [
  {
    id: "1",
    name: "Amit Patel",
    role: "Urban Planner",
    avatar: null,
    mutualConnections: 5,
  },
  {
    id: "2",
    name: "Neha Singh",
    role: "Community Organizer",
    avatar: null,
    mutualConnections: 3,
  },
  {
    id: "3",
    name: "Rajesh Kumar",
    role: "Local Business Owner",
    avatar: null,
    mutualConnections: 2,
  },
];

const fallbackSchemes = [
  {
    id: "1",
    title: "PM Kisan Samman Nidhi",
    deadline: new Date().toISOString(),
    isNew: true,
  },
  {
    id: "2",
    title: "Digital Literacy Program",
    deadline: new Date().toISOString(),
    isNew: false,
  },
];

const fallbackJobs = [
  {
    id: "1",
    title: "Digital Marketing Assistant",
    company: "TechSolutions Ltd",
    location: "Mumbai",
    isNew: true,
  },
  {
    id: "2",
    title: "Community Manager",
    company: "Local Government",
    location: "Delhi NCR",
    isNew: true,
  },
];

const fallbackEvents = [
  {
    id: "1",
    title: "Digital Literacy Workshop",
    date: new Date().toISOString(),
    location: "Community Center",
  },
  {
    id: "2",
    title: "Public Hearing",
    date: new Date().toISOString(),
    location: "Municipal Hall",
  },
];

function formatDeadline(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MobileTabs() {
  const [activeTab, setActiveTab] = useState("schemes");
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [suggestedConnections, setSuggestedConnections] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [schemesData, jobsData, eventsData] = await Promise.all([
        getSchemes().catch(() => fallbackSchemes),
        getJobs().catch(() => fallbackJobs),
        getEvents().catch(() => fallbackEvents),
      ]);

      setSchemes(schemesData.slice(0, 3) as Scheme[]);
      setJobs(jobsData.slice(0, 3) as Job[]);
      setEvents(eventsData.slice(0, 2) as Event[]);

      const token = getToken();
      if (token) {
        try {
          const suggested = await getSuggestedConnections(token);
          setSuggestedConnections(suggested.slice(0, 3));
        } catch {
          setSuggestedConnections(fallbackConnections);
        }
      } else {
        setSuggestedConnections(fallbackConnections);
      }
    } catch {
      setSchemes(fallbackSchemes as Scheme[]);
      setJobs(fallbackJobs as Job[]);
      setEvents(fallbackEvents as Event[]);
      setSuggestedConnections(fallbackConnections);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="md:hidden">
      <Tabs
        defaultValue="schemes"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-4 mb-4 bg-purple-100 dark:bg-gray-800 p-1">
          <TabsTrigger
            value="schemes"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
          >
            Schemes
          </TabsTrigger>
          <TabsTrigger
            value="jobs"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
          >
            Jobs
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
          >
            Events
          </TabsTrigger>
          <TabsTrigger
            value="people"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
          >
            People
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schemes" className="space-y-4">
          <Card className="border-purple-100 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
              <CardTitle className="text-md flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Latest Schemes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {schemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{scheme.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Deadline: {formatDeadline(scheme.deadline)}
                      </p>
                    </div>
                    {scheme.isNew && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs border-0">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              <Link
                href="/schemes"
                className="flex items-center justify-center w-full mt-2 text-sm text-purple-600 dark:text-purple-400 font-medium"
              >
                View All Schemes
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card className="border-purple-100 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="text-md flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Local Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{job.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {job.company} • {job.location}
                      </p>
                    </div>
                    {job.isNew && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs border-0">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              <Link
                href="/jobs"
                className="flex items-center justify-center w-full mt-2 text-sm text-green-600 dark:text-green-400 font-medium"
              >
                View All Jobs
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card className="border-purple-100 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
              <CardTitle className="text-md flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0 last:pb-0"
                >
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatEventDate(event.date)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {event.location}
                  </p>
                </div>
              ))}
              <Link
                href="/events"
                className="flex items-center justify-center w-full mt-2 text-sm text-orange-600 dark:text-orange-400 font-medium"
              >
                View Calendar
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="people" className="space-y-4">
          <Card className="border-purple-100 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="text-md flex items-center">
                <Users className="h-4 w-4 mr-2" />
                People to Connect With
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {suggestedConnections.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={connection.avatar || "/placeholder.svg"}
                          alt={connection.name}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                          {connection.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{connection.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {connection.role}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          {connection.mutualConnections} mutual connections
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      <span className="text-xs">Connect</span>
                    </Button>
                  </div>
                ))}
                <Link
                  href="/community"
                  className="flex items-center justify-center w-full mt-2 text-sm text-purple-600 dark:text-purple-400 font-medium"
                >
                  View More People
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
