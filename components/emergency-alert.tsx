"use client"

import { useState } from "react"
import { AlertTriangle, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface EmergencyAlertProps {
  title: string
  message: string
  authority: string
  timestamp: string
}

export default function EmergencyAlert({ title, message, authority, timestamp }: EmergencyAlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Card className="border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-red-700 dark:text-red-400">{title}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
                onClick={() => setIsVisible(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{message}</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-red-600 dark:text-red-400">
                Issued by: <span className="font-medium">{authority}</span>
              </p>
              <Badge
                variant="outline"
                className="text-xs border-red-300 dark:border-red-700 text-red-700 dark:text-red-400"
              >
                {timestamp}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
