import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Database,
  Share2,
  Bell,
  Trash2,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/footer";

export default function PrivacyPage() {
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
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last updated: January 1, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              At More & More Network ("we," "us," or "our"), we are committed to
              protecting your privacy and ensuring the security of your personal
              information. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our social
              networking platform designed for real estate professionals in the
              United States. By using More & More Network, you agree to the
              collection and use of information in accordance with this policy.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Information We Collect
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Personal Information
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  When you create an account, we collect information that you
                  provide directly, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                  <li>Full name and professional title</li>
                  <li>Email address and phone number</li>
                  <li>Mailing address and service areas</li>
                  <li>Real estate license number and state of licensure</li>
                  <li>Brokerage affiliation and professional certifications</li>
                  <li>Profile photo and biographical information</li>
                  <li>Payment information for premium services</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Usage Information
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  We automatically collect certain information when you use our
                  platform:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                  <li>Device information (type, operating system, browser)</li>
                  <li>IP address and general location data</li>
                  <li>Pages visited and features used</li>
                  <li>Time spent on the platform and interaction patterns</li>
                  <li>Referral sources and search queries</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Content You Create
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  We store content you post on our platform, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                  <li>Posts, comments, and messages</li>
                  <li>Photos and documents you upload</li>
                  <li>Connections and professional network data</li>
                  <li>Job applications and listings</li>
                  <li>Reviews and recommendations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                How We Use Your Information
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use the information we collect for the following purposes:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Platform Operations
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Create and manage your account</li>
                  <li>• Enable networking features</li>
                  <li>• Process transactions</li>
                  <li>• Provide customer support</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Personalization
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Recommend connections</li>
                  <li>• Customize content feed</li>
                  <li>• Suggest relevant opportunities</li>
                  <li>• Improve user experience</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Communication
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Send service notifications</li>
                  <li>• Deliver marketing updates</li>
                  <li>• Share platform news</li>
                  <li>• Respond to inquiries</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Security & Legal
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Protect against fraud</li>
                  <li>• Enforce our terms</li>
                  <li>• Comply with laws</li>
                  <li>• Verify professional credentials</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Share2 className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Information Sharing
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We do not sell your personal information. We may share your
              information in the following circumstances:
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  With Other Members
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Information in your public profile is visible to other
                  platform members. You control visibility settings for contact
                  information and activity.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Service Providers
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We work with trusted third parties who help us operate our
                  platform, including hosting providers, payment processors,
                  email services, and analytics providers. These parties are
                  contractually obligated to protect your data.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Legal Requirements
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We may disclose information when required by law, subpoena, or
                  legal process, or when we believe disclosure is necessary to
                  protect our rights, your safety, or the safety of others.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Business Transfers
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  If More & More Network is involved in a merger, acquisition,
                  or sale of assets, your information may be transferred as part
                  of that transaction.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Data Security
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We implement robust security measures to protect your information:
            </p>

            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>SSL/TLS encryption for all data transmission</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Encrypted storage for sensitive data at rest</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Regular security audits and penetration testing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Two-factor authentication option for accounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Access controls limiting employee data access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Secure data centers with physical security measures</span>
              </li>
            </ul>

            <p className="text-gray-600 dark:text-gray-300 mt-4">
              While we strive to protect your information, no method of
              transmission over the Internet is 100% secure. We encourage you to
              use strong passwords and enable two-factor authentication.
            </p>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Privacy Rights
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Depending on your state of residence, you may have the following
              rights regarding your personal information:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Access & Portability
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Request a copy of the personal information we have about you
                  in a portable format.
                </p>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Correction
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Request correction of inaccurate or incomplete personal
                  information.
                </p>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Deletion
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Request deletion of your personal information, subject to
                  certain exceptions.
                </p>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Opt-Out
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Opt out of marketing communications and certain data
                  processing activities.
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mt-4">
              To exercise these rights, please contact us at{" "}
              <a
                href="mailto:privacy@moreandmore.network"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                privacy@moreandmore.network
              </a>
              . We will respond to your request within 45 days.
            </p>
          </CardContent>
        </Card>

        {/* California Privacy Rights */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              California Privacy Rights (CCPA)
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you are a California resident, you have additional rights under
              the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>
                Right to know what personal information is collected, used,
                shared, or sold
              </li>
              <li>Right to delete personal information held by businesses</li>
              <li>
                Right to opt-out of the sale of personal information (we do not
                sell your data)
              </li>
              <li>
                Right to non-discrimination for exercising your CCPA rights
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Cookies & Tracking
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use cookies and similar tracking technologies to enhance your
              experience. These include:
            </p>

            <ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-4">
              <li>
                <strong>Essential Cookies:</strong> Required for basic platform
                functionality
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how users
                interact with our platform
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your settings and
                preferences
              </li>
              <li>
                <strong>Marketing Cookies:</strong> Used to deliver relevant
                advertisements
              </li>
            </ul>

            <p className="text-gray-600 dark:text-gray-300">
              You can manage cookie preferences through your browser settings.
              Note that disabling certain cookies may affect platform
              functionality.
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="h-6 w-6 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Data Retention
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300">
              We retain your personal information for as long as your account is
              active or as needed to provide you services. If you request
              account deletion, we will delete or anonymize your information
              within 30 days, except where we are required to retain it for
              legal, accounting, or security purposes. Backup copies may persist
              for up to 90 days before being permanently deleted.
            </p>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              More & More Network is not intended for individuals under the age
              of 18. We do not knowingly collect personal information from
              children. If you are a parent or guardian and believe your child
              has provided us with personal information, please contact us
              immediately at{" "}
              <a
                href="mailto:privacy@moreandmore.network"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                privacy@moreandmore.network
              </a>
              , and we will take steps to delete such information.
            </p>
          </CardContent>
        </Card>

        {/* Updates to Policy */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Changes to This Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or for legal, operational, or regulatory
              reasons. We will notify you of any material changes by posting the
              updated policy on this page and updating the "Last updated" date.
              For significant changes, we may also send you an email
              notification. We encourage you to review this policy periodically.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-purple-100 dark:border-purple-900 mb-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you have questions about this Privacy Policy or our privacy
              practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:privacy@moreandmore.network"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  privacy@moreandmore.network
                </a>
              </p>
              <p>
                <strong>Mail:</strong> More & More Network, Privacy Team
                <br />
                123 Real Estate Plaza, Suite 500
                <br />
                Los Angeles, CA 90001
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
