"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Search, Bell, User, MessageCircle } from "lucide-react"

export default function MobileFooterNav() {
  const pathname = usePathname()
  const [notificationCount, setNotificationCount] = useState(3)
  const [isScrollingUp, setIsScrollingUp] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Handle scroll direction to hide/show the footer nav
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        setIsScrollingUp(true)
      } else {
        setIsScrollingUp(currentScrollY < lastScrollY)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navItems = [
    {
      icon: Home,
      label: "Home",
      href: "/",
      active: pathname === "/",
    },
    {
      icon: Search,
      label: "Explore",
      href: "/search",
      active: pathname === "/search",
    },
    {
      icon: MessageCircle,
      label: "Messages",
      href: "/messages",
      active: pathname === "/messages",
    },
    {
      icon: Bell,
      label: "Alerts",
      href: "/notifications",
      active: pathname === "/notifications",
      badge: notificationCount,
    },
    {
      icon: User,
      label: "Profile",
      href: "/profile",
      active: pathname === "/profile",
    },
  ]

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden transition-transform duration-300",
        !isScrollingUp && "translate-y-full",
      )}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-full h-full">
            <div className="relative">
              <item.icon
                className={cn(
                  "h-6 w-6",
                  item.active ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400",
                )}
              />
              {item.badge && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span
              className={cn(
                "text-xs mt-1",
                item.active ? "text-purple-600 dark:text-purple-400 font-medium" : "text-gray-500 dark:text-gray-400",
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
