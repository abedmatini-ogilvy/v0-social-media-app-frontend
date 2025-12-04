"use client";

import EmergencyAlert from "@/components/emergency-alert";
import SocialFeed from "@/components/social-feed";
import MobileHeader from "@/components/mobile-header";
import DesktopHeader from "@/components/desktop-header";
import MobileFooterNav from "@/components/mobile-footer-nav";
import MobileTabs from "@/components/mobile-tabs";
import Sidebar from "@/components/sidebar";
import LeftSidebar from "@/components/left-sidebar";

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

        <div className="flex flex-col lg:flex-row gap-6 w-full mt-4">
          {/* Mobile Tabs - Only visible on mobile */}
          <MobileTabs />

          {/* Left Sidebar - Profile & Navigation (Desktop only) */}
          <aside className="w-64 hidden lg:block shrink-0">
            <div className="sticky top-20">
              <LeftSidebar />
            </div>
          </aside>

          {/* Main Content - Social Feed */}
          <section className="flex-1 min-w-0">
            <SocialFeed />
          </section>

          {/* Right Sidebar - Schemes, Jobs, Events (Desktop only) */}
          <aside className="w-80 hidden lg:block shrink-0">
            <div className="sticky top-20">
              <Sidebar />
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Footer Navigation */}
      <MobileFooterNav />
    </div>
  );
}
