"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type AccessibilityContextType = {
  highContrast: boolean
  toggleHighContrast: () => void
  largeText: boolean
  toggleLargeText: () => void
  screenReader: boolean
  toggleScreenReader: () => void
  readText: (text: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [screenReader, setScreenReader] = useState(false)

  // Load settings from localStorage on client side
  useEffect(() => {
    const savedHighContrast = localStorage.getItem("highContrast") === "true"
    const savedLargeText = localStorage.getItem("largeText") === "true"
    const savedScreenReader = localStorage.getItem("screenReader") === "true"

    setHighContrast(savedHighContrast)
    setLargeText(savedLargeText)
    setScreenReader(savedScreenReader)

    // Apply settings to document
    if (savedHighContrast) {
      document.documentElement.classList.add("high-contrast")
    }
    if (savedLargeText) {
      document.documentElement.classList.add("large-text")
    }
  }, [])

  const toggleHighContrast = () => {
    const newValue = !highContrast
    setHighContrast(newValue)
    localStorage.setItem("highContrast", String(newValue))

    if (newValue) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }

  const toggleLargeText = () => {
    const newValue = !largeText
    setLargeText(newValue)
    localStorage.setItem("largeText", String(newValue))

    if (newValue) {
      document.documentElement.classList.add("large-text")
    } else {
      document.documentElement.classList.remove("large-text")
    }
  }

  const toggleScreenReader = () => {
    const newValue = !screenReader
    setScreenReader(newValue)
    localStorage.setItem("screenReader", String(newValue))
  }

  const readText = (text: string) => {
    if (screenReader && typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast,
        largeText,
        toggleLargeText,
        screenReader,
        toggleScreenReader,
        readText,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}

export default AccessibilityProvider
