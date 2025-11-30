"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/profile",
      label: "Profile",
      active: pathname === "/profile",
    },
    {
      href: "/notifications",
      label: "Notifications",
      active: pathname === "/notifications",
    },
    {
      href: "/messages",
      label: "Messages",
      active: pathname === "/messages",
    },
    {
      href: "/schemes",
      label: "Government Schemes",
      active: pathname === "/schemes",
    },
    {
      href: "/jobs",
      label: "Jobs & Opportunities",
      active: pathname === "/jobs",
    },
    {
      href: "/events",
      label: "Events",
      active: pathname === "/events",
    },
    {
      href: "/community",
      label: "Community",
      active: pathname === "/community",
    },
    {
      href: "/help",
      label: "Help & Support",
      active: pathname === "/help",
    },
    {
      href: "/settings",
      label: "Settings",
      active: pathname === "/settings",
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85%] sm:w-[350px] pt-10 border-l-purple-200">
        <SheetHeader className="text-left mb-6">
          <SheetTitle className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mr-2">
              <span className="text-white font-bold">CC</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              CivicConnect
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block py-3 px-2 text-sm rounded-md",
                route.active
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950"
          >
            <Link href="/login">Login</Link>
          </Button>

          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
