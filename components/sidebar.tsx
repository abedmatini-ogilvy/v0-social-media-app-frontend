"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Briefcase,
  Calendar,
  Users,
  UserPlus,
  UserCheck,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { useConnections } from "@/components/connection-provider";
import {
  getSchemes,
  getJobs,
  getEvents,
  getSuggestedConnections,
} from "@/lib/api-service";
import { getToken } from "@/lib/auth-service";
import type { Scheme, Job, Event, User } from "@/lib/types";

// Fallback data when API is not available
const fallbackConnections = [
  {
    id: "1",
    name: "Amit Patel",
    role: "citizen",
    avatar: null,
    email: "",
    isVerified: false,
    createdAt: "",
  },
  {
    id: "2",
    name: "Neha Singh",
    role: "citizen",
    avatar: null,
    email: "",
    isVerified: false,
    createdAt: "",
  },
  {
    id: "3",
    name: "Rajesh Kumar",
    role: "citizen",
    avatar: null,
    email: "",
    isVerified: false,
    createdAt: "",
  },
];

const fallbackSchemes = [
  {
    id: "1",
    title: "PM Kisan Samman Nidhi",
    deadline: new Date().toISOString(),
    isNew: true,
    description: "",
    eligibility: "",
    documents: [],
    fundingDetails: "",
    applicationProcess: "",
    createdAt: "",
  },
  {
    id: "2",
    title: "Digital Literacy Program",
    deadline: new Date().toISOString(),
    isNew: false,
    description: "",
    eligibility: "",
    documents: [],
    fundingDetails: "",
    applicationProcess: "",
    createdAt: "",
  },
];

const fallbackJobs = [
  {
    id: "1",
    title: "Junior Developer",
    company: "Tech Solutions",
    location: "Mumbai",
    isNew: true,
    description: "",
    requirements: [],
    postedAt: "",
  },
  {
    id: "2",
    title: "Government Clerk",
    company: "State PSC",
    location: "Delhi",
    isNew: true,
    description: "",
    requirements: [],
    postedAt: "",
  },
];

const fallbackEvents = [
  {
    id: "1",
    title: "Digital Literacy Workshop",
    date: new Date().toISOString(),
    location: "Community Center",
    description: "",
    organizer: "",
    attendees: 0,
    createdAt: "",
  },
  {
    id: "2",
    title: "Job Fair 2024",
    date: new Date().toISOString(),
    location: "Town Hall",
    description: "",
    organizer: "",
    attendees: 0,
    createdAt: "",
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
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Sidebar() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  // Use global connection context for synced state
  const { isConnected, connect, isConnecting } = useConnections();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch public data (schemes, jobs, events)
      const [schemesData, jobsData, eventsData] = await Promise.all([
        getSchemes().catch(() => fallbackSchemes),
        getJobs().catch(() => fallbackJobs),
        getEvents().catch(() => fallbackEvents),
      ]);

      setSchemes(schemesData.slice(0, 3));
      setJobs(jobsData.slice(0, 3));
      setEvents(eventsData.slice(0, 2));

      // Fetch suggested connections if logged in
      const token = getToken();
      if (token) {
        try {
          const suggested = await getSuggestedConnections(token);
          setSuggestedUsers(suggested.slice(0, 3));
        } catch {
          setSuggestedUsers(fallbackConnections as User[]);
        }
      } else {
        setSuggestedUsers(fallbackConnections as User[]);
      }
    } catch (error) {
      console.error("Failed to fetch sidebar data:", error);
      setSchemes(fallbackSchemes as Scheme[]);
      setJobs(fallbackJobs as Job[]);
      setEvents(fallbackEvents as Event[]);
      setSuggestedUsers(fallbackConnections as User[]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, isLoggedIn]);

  const handleConnect = async (userId: string, userName: string) => {
    if (!isLoggedIn) {
      return;
    }
    // Use global connection context for synced state
    await connect(userId, userName);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-purple-100 shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* People to Connect With */}
      <Card className="border-purple-100 shadow-md overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <CardTitle className="text-md flex items-center">
            <Users className="h-4 w-4 mr-2" />
            People to Connect With
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className={`h-8 ${
                    isConnected(user.id)
                      ? "bg-purple-100 border-purple-300 text-purple-700"
                      : "border-purple-200 text-purple-700 hover:bg-purple-50"
                  }`}
                  onClick={() => handleConnect(user.id, user.name)}
                  disabled={isConnecting(user.id) || isConnected(user.id)}
                >
                  {isConnecting(user.id) ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : isConnected(user.id) ? (
                    <>
                      <UserCheck className="h-3 w-3 mr-1" />
                      <span className="text-xs">Connected</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3 w-3 mr-1" />
                      <span className="text-xs">Connect</span>
                    </>
                  )}
                </Button>
              </div>
            ))}
            <Link href="/community">
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-purple-700 hover:bg-purple-50"
              >
                View More Suggestions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Latest Schemes */}
      <Card className="border-purple-100 shadow-md overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <CardTitle className="text-md flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Latest Schemes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="border-b border-gray-100 pb-2 last:border-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{scheme.title}</p>
                  <p className="text-xs text-gray-500">
                    Deadline: {formatDeadline(scheme.deadline)}
                  </p>
                </div>
                {scheme.isNew && (
                  <Badge className="bg-green-100 text-green-800 text-xs border-0">
                    New
                  </Badge>
                )}
              </div>
            </div>
          ))}
          <Link href="/schemes">
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              View All Schemes
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Local Opportunities */}
      <Card className="border-purple-100 shadow-md overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-green-500 to-teal-500 text-white">
          <CardTitle className="text-md flex items-center">
            <Briefcase className="h-4 w-4 mr-2" />
            Local Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border-b border-gray-100 pb-2 last:border-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{job.title}</p>
                  <p className="text-xs text-gray-500">
                    {job.company} • {job.location}
                  </p>
                </div>
                {job.isNew && (
                  <Badge className="bg-green-100 text-green-800 text-xs border-0">
                    New
                  </Badge>
                )}
              </div>
            </div>
          ))}
          <Link href="/jobs">
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 border-green-200 text-green-700 hover:bg-green-50"
            >
              View All Jobs
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="border-purple-100 shadow-md overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <CardTitle className="text-md flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border-b border-gray-100 pb-2 last:border-0 last:pb-0"
            >
              <p className="font-medium text-sm">{event.title}</p>
              <p className="text-xs text-gray-500">
                {formatEventDate(event.date)}
              </p>
              <p className="text-xs text-gray-500">{event.location}</p>
            </div>
          ))}
          <Link href="/events">
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              View Calendar
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
