"use client"

import EmergencyAlert from "@/components/emergency-alert"
import SocialFeed from "@/components/social-feed"
import MobileHeader from "@/components/mobile-header"
import DesktopHeader from "@/components/desktop-header"
import MobileFooterNav from "@/components/mobile-footer-nav"
import MobileTabs from "@/components/mobile-tabs"
import Sidebar from "@/components/sidebar"

export default function HomePage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 pb-16 md:pb-0">
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Header */}
      <MobileHeader />

      <main className="container mx-auto px-4 py-4">
        {/* Emergency Alert - Fetches active alerts from API */}
        <EmergencyAlert />

        <div className="flex flex-col md:flex-row gap-6 w-full mt-4">
          {/* Mobile Tabs - Only visible on mobile */}
          <MobileTabs />

          {/* Main Content - Social Feed */}
          <div className="flex-1 order-2 md:order-1 mt-6 md:mt-0">
            <SocialFeed />
          </div>

          {/* Desktop Sidebar - Only visible on desktop */}
          <div className="md:w-80 w-full order-1 md:order-2 hidden md:block">
            <div className="space-y-6 md:sticky md:top-20">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Footer Navigation */}
      <MobileFooterNav />
    </div>
  )
}
