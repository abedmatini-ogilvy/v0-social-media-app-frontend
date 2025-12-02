"use client"

import { useState, useEffect, useCallback } from "react"
import { AlertTriangle, X, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getUrgentAnnouncements, type PublicAnnouncement } from "@/lib/api-service"

interface UrgentAlertDisplay {
  id: string
  title: string
  message: string
  department: string
  publishedAt: string
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffHours < 1) return "Just now"
  if (diffHours < 24) return `${diffHours} hours ago`
  return date.toLocaleDateString()
}

export default function EmergencyAlertComponent() {
  const [alerts, setAlerts] = useState<UrgentAlertDisplay[]>([])
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  const fetchAlerts = useCallback(async () => {
    setIsLoading(true)
    try {
      const urgentAnnouncements = await getUrgentAnnouncements()
      // Transform announcements to alert display format
      const transformedAlerts: UrgentAlertDisplay[] = urgentAnnouncements.map((announcement: PublicAnnouncement) => ({
        id: announcement.id,
        title: announcement.title,
        message: announcement.content,
        department: announcement.department || "Government Authority",
        publishedAt: announcement.publishedAt || new Date().toISOString(),
      }))
      setAlerts(transformedAlerts)
    } catch {
      setAlerts([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]))
  }

  // Filter out dismissed alerts
  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id))

  if (isLoading) {
    return (
      <Card className="border-gray-200 bg-gray-50 shadow-sm">
        <CardContent className="p-4 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
          <span className="text-sm text-gray-500">Checking for alerts...</span>
        </CardContent>
      </Card>
    )
  }

  if (visibleAlerts.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {visibleAlerts.map(alert => (
        <Card key={alert.id} className="border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-red-700 dark:text-red-400">{alert.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
                    onClick={() => handleDismiss(alert.id)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{alert.message}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Issued by: <span className="font-medium">{alert.department}</span>
                  </p>
                  <Badge
                    variant="outline"
                    className="text-xs border-red-300 dark:border-red-700 text-red-700 dark:text-red-400"
                  >
                    {formatTimestamp(alert.publishedAt)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
