import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  Scale,
  UserCheck,
  Ban,
  Shield,
  RefreshCw,
  Gavel,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/footer";

export default function TermsPage() {
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
              <FileText className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last updated: January 1, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Welcome to More & More Network. These Terms of Service ("Terms")
              govern your access to and use of our website, mobile application,
              and services (collectively, the "Platform"). By creating an
              account or using our Platform, you agree to be bound by these
              Terms. If you do not agree to these Terms, please do not use our
              Platform.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
              More & More Network is operated by More & More Network, Inc.
              ("Company," "we," "us," or "our"), a Delaware corporation. These
              Terms constitute a legally binding agreement between you and the
              Company.
            </p>
          </CardContent>
        </Card>

        {/* Eligibility */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Eligibility
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To use More & More Network, you must:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Be at least 18 years of age</li>
              <li>
                Be a legal resident of the United States or its territories
              </li>
              <li>Have the legal capacity to enter into a binding agreement</li>
              <li>
                Not be prohibited from using our services under applicable law
              </li>
              <li>Provide accurate and complete registration information</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              While our Platform is designed for real estate professionals, we
              welcome all industry participants who meet these eligibility
              requirements. You may be asked to verify your professional
              credentials, including your real estate license, for certain
              features.
            </p>
          </CardContent>
        </Card>

        {/* Account Registration */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Account Registration & Security
            </h2>

            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Account Creation:</strong> To access most features of
                our Platform, you must create an account by providing accurate,
                current, and complete information. You agree to update your
                information as necessary to maintain its accuracy.
              </p>
              <p>
                <strong>Account Security:</strong> You are responsible for
                maintaining the confidentiality of your login credentials and
                for all activities that occur under your account. You agree to
                immediately notify us of any unauthorized use of your account or
                any other security breach.
              </p>
              <p>
                <strong>One Account Per Person:</strong> You may maintain only
                one personal account on our Platform. Creating multiple accounts
                or sharing account access is prohibited.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Acceptable Use */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Acceptable Use Policy
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You agree to use our Platform only for lawful purposes and in
              accordance with these Terms. When using More & More Network, you
              agree to:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">
                  ✓ Acceptable Conduct
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Provide accurate professional information</li>
                  <li>• Respect other users and their content</li>
                  <li>• Engage in professional networking</li>
                  <li>• Report violations of these Terms</li>
                  <li>• Comply with all applicable laws</li>
                  <li>• Maintain professional standards</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">
                  ✗ Prohibited Conduct
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Harassment or discriminatory behavior</li>
                  <li>• Posting false or misleading information</li>
                  <li>• Spamming or unauthorized advertising</li>
                  <li>• Impersonating others or misrepresenting credentials</li>
                  <li>• Sharing confidential client information</li>
                  <li>• Violating real estate licensing laws</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prohibited Activities */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Ban className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Prohibited Activities
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The following activities are strictly prohibited on our Platform:
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Fraudulent Activity
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Engaging in fraud, including but not limited to real estate
                  fraud, wire fraud schemes, phishing attempts, or
                  misrepresentation of property information.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Intellectual Property Violations
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Posting content that infringes on copyrights, trademarks, or
                  other intellectual property rights of others, including MLS
                  photos and listing descriptions you don't have rights to use.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Data Harvesting
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Using automated means to scrape, collect, or harvest user
                  information, or circumventing any access controls or rate
                  limits on our Platform.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Malicious Software
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Uploading or transmitting viruses, malware, or any code
                  designed to interfere with the proper functioning of our
                  Platform or any user's device.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Fair Housing Violations
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Posting content that violates the Fair Housing Act, including
                  discriminatory statements or preferences based on race, color,
                  religion, sex, national origin, familial status, or
                  disability.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Content */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              User Content
            </h2>

            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Your Content:</strong> You retain ownership of content
                you post on our Platform. By posting content, you grant us a
                non-exclusive, worldwide, royalty-free license to use, display,
                reproduce, and distribute your content in connection with
                operating and promoting our Platform.
              </p>
              <p>
                <strong>Content Standards:</strong> All content you post must
                comply with our Community Guidelines and these Terms. We reserve
                the right to remove any content that violates these standards
                without notice.
              </p>
              <p>
                <strong>Accuracy:</strong> You represent that content you post,
                particularly regarding real estate listings, professional
                credentials, and market information, is accurate and not
                misleading.
              </p>
              <p>
                <strong>Third-Party Content:</strong> Our Platform may contain
                content from other users and third parties. We do not endorse or
                guarantee the accuracy of such content.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Privacy
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300">
              Your privacy is important to us. Our collection and use of
              personal information is governed by our{" "}
              <Link
                href="/privacy"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference. By using
              our Platform, you consent to our collection and use of your
              information as described in the Privacy Policy.
            </p>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Intellectual Property Rights
            </h2>

            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Our Platform:</strong> More & More Network, including
                its design, features, functionality, and content (excluding
                user-generated content), is owned by the Company and protected
                by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                <strong>Trademarks:</strong> "More & More Network" and our logo
                are trademarks of the Company. You may not use our trademarks
                without prior written permission.
              </p>
              <p>
                <strong>Limited License:</strong> We grant you a limited,
                non-exclusive, non-transferable license to access and use our
                Platform for personal, non-commercial networking purposes in
                accordance with these Terms.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Disclaimers
              </h2>
            </div>

            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="uppercase font-semibold">
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
                LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                <strong>No Professional Advice:</strong> Information on our
                Platform, including government housing programs and market
                information, is for informational purposes only and does not
                constitute legal, financial, or real estate advice. You should
                consult appropriate professionals for specific advice.
              </p>
              <p>
                <strong>User Interactions:</strong> We do not verify the
                credentials, background, or conduct of users. Any interactions
                or transactions between users are solely between those users. We
                are not responsible for disputes between users.
              </p>
              <p>
                <strong>Third-Party Services:</strong> Our Platform may contain
                links to third-party websites or services. We do not endorse or
                assume responsibility for third-party content or services.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Limitation of Liability
            </h2>

            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="uppercase">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE COMPANY SHALL NOT BE
                LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS,
                DATA, USE, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF
                OUR PLATFORM.
              </p>
              <p>
                Our total liability for any claims arising from or related to
                these Terms or our Platform shall not exceed the amount you paid
                to us, if any, in the twelve (12) months preceding the claim.
              </p>
              <p>
                Some jurisdictions do not allow the exclusion or limitation of
                certain damages, so some of the above limitations may not apply
                to you.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Indemnification */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Indemnification
            </h2>

            <p className="text-gray-600 dark:text-gray-300">
              You agree to indemnify, defend, and hold harmless the Company and
              its officers, directors, employees, agents, and affiliates from
              and against any claims, liabilities, damages, losses, costs, and
              expenses (including reasonable attorneys' fees) arising out of or
              related to: (a) your use of our Platform; (b) your violation of
              these Terms; (c) your violation of any third-party rights,
              including intellectual property rights; or (d) your content.
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Termination
              </h2>
            </div>

            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>By You:</strong> You may terminate your account at any
                time by contacting us or using the account deletion feature in
                your settings. Upon termination, your right to use the Platform
                will immediately cease.
              </p>
              <p>
                <strong>By Us:</strong> We may suspend or terminate your account
                and access to the Platform at any time, with or without cause,
                and with or without notice. Reasons for termination may include
                violation of these Terms, fraudulent activity, extended
                inactivity, or at our sole discretion.
              </p>
              <p>
                <strong>Effect of Termination:</strong> Upon termination,
                sections of these Terms that by their nature should survive
                (including disclaimers, limitations of liability, and
                indemnification) shall continue to apply.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dispute Resolution */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Gavel className="h-6 w-6 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dispute Resolution
              </h2>
            </div>

            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Informal Resolution:</strong> Before filing a formal
                dispute, you agree to first contact us at{" "}
                <a
                  href="mailto:legal@moreandmore.network"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  legal@moreandmore.network
                </a>{" "}
                to attempt to resolve the dispute informally.
              </p>
              <p>
                <strong>Arbitration:</strong> Any dispute that cannot be
                resolved informally shall be resolved by binding arbitration
                administered by the American Arbitration Association (AAA) in
                accordance with its Consumer Arbitration Rules. The arbitration
                shall be conducted in Los Angeles, California, unless otherwise
                agreed.
              </p>
              <p>
                <strong>Class Action Waiver:</strong> You agree that any
                disputes will be resolved on an individual basis and not as part
                of a class, consolidated, or representative action.
              </p>
              <p>
                <strong>Governing Law:</strong> These Terms shall be governed by
                and construed in accordance with the laws of the State of
                California, without regard to its conflict of law provisions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Modifications */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Modifications to Terms
            </h2>

            <p className="text-gray-600 dark:text-gray-300">
              We reserve the right to modify these Terms at any time. If we make
              material changes, we will notify you by email or by posting a
              notice on our Platform at least 30 days before the changes take
              effect. Your continued use of the Platform after the effective
              date constitutes your acceptance of the modified Terms. If you do
              not agree to the modified Terms, you must stop using the Platform
              and terminate your account.
            </p>
          </CardContent>
        </Card>

        {/* General Provisions */}
        <Card className="border-purple-100 dark:border-purple-900 mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              General Provisions
            </h2>

            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Entire Agreement:</strong> These Terms, together with
                our Privacy Policy and any additional terms you agree to,
                constitute the entire agreement between you and the Company
                regarding the Platform.
              </p>
              <p>
                <strong>Severability:</strong> If any provision of these Terms
                is found to be unenforceable, the remaining provisions shall
                continue in full force and effect.
              </p>
              <p>
                <strong>Waiver:</strong> Our failure to enforce any right or
                provision of these Terms shall not constitute a waiver of such
                right or provision.
              </p>
              <p>
                <strong>Assignment:</strong> You may not assign or transfer
                these Terms or your rights under them without our prior written
                consent. We may assign our rights and obligations without
                restriction.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-purple-100 dark:border-purple-900 mb-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:legal@moreandmore.network"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  legal@moreandmore.network
                </a>
              </p>
              <p>
                <strong>Mail:</strong> More & More Network, Inc.
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
