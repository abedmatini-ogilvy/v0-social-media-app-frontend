import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import LanguageSwitcher from "@/components/language-switcher"

export default function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 flex md:hidden items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2 shadow-sm">
      <Link href="/" className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mr-2">
          <span className="text-white font-bold">CC</span>
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          CivicConnect
        </h1>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Sheet>
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

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Settings</h3>
                <div className="space-y-1">
                  <LanguageSwitcher />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">More</h3>
                <div className="space-y-1">
                  <Link href="/schemes" className="block text-sm py-2 text-purple-600 dark:text-purple-400">
                    Government Schemes
                  </Link>
                  <Link href="/jobs" className="block text-sm py-2 text-purple-600 dark:text-purple-400">
                    Jobs & Opportunities
                  </Link>
                  <Link href="/events" className="block text-sm py-2 text-purple-600 dark:text-purple-400">
                    Events
                  </Link>
                  <Link href="/community" className="block text-sm py-2 text-purple-600 dark:text-purple-400">
                    Community
                  </Link>
                  <Link href="/help" className="block text-sm py-2 text-purple-600 dark:text-purple-400">
                    Help & Support
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <Link href="/settings" className="block text-sm py-2 text-purple-600 dark:text-purple-400">
                  Account Settings
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
