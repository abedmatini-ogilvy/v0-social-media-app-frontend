"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, MapPin, Users, Clock, ChevronLeft, ChevronRight, CalendarDays, List } from "lucide-react"
import MobileHeader from "@/components/mobile-header"
import DesktopHeader from "@/components/desktop-header"
import MobileFooterNav from "@/components/mobile-footer-nav"
import { useAuth } from "@/components/auth-provider"
import { getEvents, attendEvent, getMyEvents } from "@/lib/api-service"
import { getToken } from "@/lib/auth-service"
import type { Event } from "@/lib/types"
import { toast } from "sonner"

function formatEventDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { 
    weekday: "long",
    month: "long", 
    day: "numeric", 
    year: "numeric" 
  })
}

function formatEventTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", { 
    hour: "numeric", 
    minute: "2-digit",
    hour12: true
  })
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDay = firstDay.getDay()
  
  const days: (number | null)[] = []
  
  // Add empty slots for days before the first day of the month
  for (let i = 0; i < startingDay; i++) {
    days.push(null)
  }
  
  // Add the days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }
  
  return days
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [myEventIds, setMyEventIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [attendingEventId, setAttendingEventId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list")
  const [currentDate, setCurrentDate] = useState(new Date())
  const { isLoggedIn } = useAuth()

  const fetchEvents = useCallback(async () => {
    setIsLoading(true)
    try {
      const eventsData = await getEvents()
      setEvents(eventsData)

      // Fetch user's registered events if logged in
      const token = getToken()
      if (token) {
        try {
          const myEvents = await getMyEvents(token)
          setMyEventIds(new Set(myEvents.map((e: any) => e.event?.id || e.id)))
        } catch {
          // User might not have any events
        }
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
      toast.error("Failed to load events")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleAttendEvent = async (eventId: string) => {
    const token = getToken()
    if (!token) {
      toast.error("Please login to register for events")
      return
    }

    setAttendingEventId(eventId)
    try {
      await attendEvent(eventId, token)
      setMyEventIds(prev => new Set([...prev, eventId]))
      // Update attendee count locally
      setEvents(prev => prev.map(e => 
        e.id === eventId ? { ...e, attendees: e.attendees + 1 } : e
      ))
      toast.success("Successfully registered for event!")
    } catch (error: any) {
      if (error?.message?.includes("Already attending")) {
        toast.info("You're already registered for this event")
        setMyEventIds(prev => new Set([...prev, eventId]))
      } else {
        toast.error("Failed to register for event")
      }
    } finally {
      setAttendingEventId(null)
    }
  }

  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      )
    })
  }

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const days = getMonthDays(currentDate.getFullYear(), currentDate.getMonth())
  const today = new Date()
  const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const upcomingEvents = sortedEvents.filter(e => new Date(e.date) >= new Date())
  const pastEvents = sortedEvents.filter(e => new Date(e.date) < new Date())

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 pb-16 md:pb-0">
      <DesktopHeader />
      <MobileHeader />

      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
              Events & Calendar
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Discover and join community events near you
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className={viewMode === "calendar" ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendar
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : viewMode === "calendar" ? (
          /* Calendar View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={goToToday}>
                      Today
                    </Button>
                    <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {WEEKDAYS.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    const dayEvents = day ? getEventsForDay(day) : []
                    const isToday = isCurrentMonth && day === today.getDate()
                    
                    return (
                      <div
                        key={index}
                        className={`min-h-[80px] p-1 border rounded-lg ${
                          day ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"
                        } ${isToday ? "ring-2 ring-orange-500" : ""}`}
                      >
                        {day && (
                          <>
                            <div className={`text-sm font-medium mb-1 ${
                              isToday ? "text-orange-600" : "text-gray-700 dark:text-gray-300"
                            }`}>
                              {day}
                            </div>
                            <div className="space-y-1">
                              {dayEvents.slice(0, 2).map(event => (
                                <div
                                  key={event.id}
                                  className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded px-1 py-0.5 truncate cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-900/50"
                                  title={event.title}
                                >
                                  {event.title}
                                </div>
                              ))}
                              {dayEvents.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{dayEvents.length - 2} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Events for Selected Month */}
            <Card>
              <CardHeader className="pb-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
                <CardTitle className="text-lg">Events This Month</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 max-h-[500px] overflow-y-auto">
                {events.filter(e => {
                  const eventDate = new Date(e.date)
                  return eventDate.getMonth() === currentDate.getMonth() && 
                         eventDate.getFullYear() === currentDate.getFullYear()
                }).length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No events this month</p>
                ) : (
                  <div className="space-y-3">
                    {events
                      .filter(e => {
                        const eventDate = new Date(e.date)
                        return eventDate.getMonth() === currentDate.getMonth() && 
                               eventDate.getFullYear() === currentDate.getFullYear()
                      })
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map(event => (
                        <div key={event.id} className="border-b pb-3 last:border-0">
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {formatEventDate(event.date)}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* List View */
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                Upcoming Events
                <Badge className="bg-orange-100 text-orange-800 border-0">{upcomingEvents.length}</Badge>
              </h2>
              
              {upcomingEvents.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No upcoming events at the moment
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingEvents.map(event => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          {myEventIds.has(event.id) && (
                            <Badge className="bg-green-100 text-green-800 border-0">Registered</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span>{formatEventDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span>{formatEventTime(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-orange-500" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-orange-500" />
                            <span>{event.attendees} attending</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {event.description}
                        </p>
                        
                        <div className="text-xs text-gray-500">
                          Organized by: {event.organizer}
                        </div>

                        {isLoggedIn && !myEventIds.has(event.id) && (
                          <Button
                            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                            onClick={() => handleAttendEvent(event.id)}
                            disabled={attendingEventId === event.id}
                          >
                            {attendingEventId === event.id ? "Registering..." : "Register to Attend"}
                          </Button>
                        )}
                        
                        {!isLoggedIn && (
                          <Button
                            variant="outline"
                            className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                            onClick={() => toast.info("Please login to register for events")}
                          >
                            Login to Register
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-500">
                  <Calendar className="h-5 w-5" />
                  Past Events
                  <Badge variant="outline">{pastEvents.length}</Badge>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-75">
                  {pastEvents.map(event => (
                    <Card key={event.id} className="bg-gray-50 dark:bg-gray-800/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-gray-600 dark:text-gray-400">{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatEventDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{event.attendees} attended</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <MobileFooterNav />
    </div>
  )
}
