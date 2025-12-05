import Link from "next/link";
import {
  ArrowLeft,
  Search,
  MessageCircle,
  UserPlus,
  Settings,
  Shield,
  Bell,
  Briefcase,
  HelpCircle,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="flex items-center text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Home</span>
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Find answers to your questions and learn how to get the most out of
            More & More Network.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for help articles..."
              className="pl-10 py-6 text-lg border-purple-200 dark:border-purple-900"
            />
          </div>
        </div>

        {/* Quick Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Browse by Topic
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-purple-100 dark:border-purple-900 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mx-auto mb-3">
                  <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Getting Started
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Account setup & basics
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 dark:border-purple-900 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit mx-auto mb-3">
                  <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Networking
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Connections & messaging
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 dark:border-purple-900 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mx-auto mb-3">
                  <Briefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Jobs & Careers
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Opportunities & listings
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 dark:border-purple-900 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full w-fit mx-auto mb-3">
                  <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Privacy & Security
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Protect your account
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="border-purple-100 dark:border-purple-900 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-purple-600" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  How do I create an account on More & More Network?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Creating an account is easy! Click the "Sign Up" button on our
                  homepage, enter your email address, create a password, and
                  fill in your basic profile information including your real
                  estate license details. You'll receive a verification email to
                  confirm your account. Once verified, you can complete your
                  professional profile and start connecting with other real
                  estate professionals.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  Is More & More Network only for licensed real estate agents?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  While our platform is primarily designed for licensed real
                  estate professionals, we welcome all industry participants
                  including brokers, property managers, mortgage professionals,
                  home inspectors, appraisers, real estate attorneys, and those
                  pursuing their real estate license. Our goal is to create a
                  comprehensive network for the entire real estate ecosystem.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  How do I connect with other real estate professionals?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  You can connect with others by visiting their profile and
                  clicking the "Connect" button. You can also discover
                  professionals through our search feature, community
                  discussions, or recommendations based on your location and
                  specializations. Once connected, you can message each other
                  directly, share referrals, and collaborate on opportunities.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  How do I post content or share updates?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  From your home feed, you'll see a "Create Post" section at the
                  top. Click on it to share text updates, photos of listings,
                  market insights, or industry news. You can also share
                  articles, tag other members, and add relevant hashtags to
                  increase visibility. Your posts will appear in the feeds of
                  your connections and may be featured in our community
                  sections.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  How do I update my profile information?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Navigate to your profile by clicking on your avatar or name.
                  Click the "Edit Profile" button to update your information
                  including your bio, specializations, license details, service
                  areas, contact information, and profile photo. Keeping your
                  profile updated helps other professionals find and connect
                  with you for relevant opportunities.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">
                  How can I search for job opportunities?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Visit the "Jobs & Opportunities" section from the main
                  navigation. You can filter listings by location, position type
                  (agent, broker, property manager, etc.), experience level, and
                  compensation structure. Save searches to receive notifications
                  when new matching opportunities are posted. You can also post
                  job openings if you're a brokerage looking to hire.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left">
                  What government programs and schemes are available?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Our "Government Schemes" section provides information about
                  federal and state housing programs including FHA loans, VA
                  loans, USDA rural housing programs, down payment assistance
                  programs, first-time homebuyer initiatives, and more. We
                  regularly update this section with the latest program changes
                  and eligibility requirements to help you better serve your
                  clients.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left">
                  How do I change my notification settings?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Go to Settings from the menu, then select "Notifications." You
                  can customize which notifications you receive via email, push
                  notifications, or SMS. Options include connection requests,
                  messages, post engagement, job alerts, market updates, and
                  community activity. We recommend keeping important
                  notifications enabled to stay connected with opportunities.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger className="text-left">
                  Is my information secure on More & More Network?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Yes, we take security seriously. We use industry-standard
                  encryption to protect your data, implement secure
                  authentication practices, and never sell your personal
                  information to third parties. You have full control over your
                  privacy settings, including who can view your profile and
                  contact information. We also offer two-factor authentication
                  for additional account security.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10">
                <AccordionTrigger className="text-left">
                  How do I report inappropriate content or behavior?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  If you encounter content or behavior that violates our
                  community guidelines, click the three-dot menu on any post or
                  profile and select "Report." Describe the issue and our
                  moderation team will review it within 24-48 hours. We maintain
                  a professional environment and take all reports seriously. You
                  can also block users who engage in unwanted contact.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Help Topics Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Popular Help Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-purple-100 dark:border-purple-900">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Settings className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Account Settings
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Manage your profile, password, email preferences, and
                      connected accounts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100 dark:border-purple-900">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Notification Preferences
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Customize how and when you receive alerts about activity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100 dark:border-purple-900">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Privacy Controls
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Control who sees your information and how your data is
                      used.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100 dark:border-purple-900">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Posting Guidelines
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Best practices for sharing content and engaging with the
                      community.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Support Section */}
        <Card className="border-purple-100 dark:border-purple-900 mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Still Need Help?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              Our support team is here to assist you. Reach out through any of
              the following channels.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mx-auto mb-3">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Email Support
                </h3>
                <a
                  href="mailto:support@moreandmore.network"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  support@moreandmore.network
                </a>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Response within 24 hours
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mx-auto mb-3">
                  <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Phone Support
                </h3>
                <a
                  href="tel:+18005551234"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  1-800-555-1234
                </a>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Mon-Fri, 9AM-6PM EST
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit mx-auto mb-3">
                  <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Live Chat
                </h3>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Start Chat
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Available 24/7
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
