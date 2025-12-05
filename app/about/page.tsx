import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Target,
  Award,
  Heart,
  Building2,
  Handshake,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/footer";

export default function AboutPage() {
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
            About More & More Network
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            The premier social networking platform connecting real estate
            professionals across the United States.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="border-purple-100 dark:border-purple-900 mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Our Mission
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              At More & More Network, we believe that success in real estate
              comes from building meaningful connections. Our mission is to
              empower real estate agents, brokers, and industry professionals by
              providing a dedicated platform where they can network, share
              insights, discover opportunities, and grow their businesses
              together. We're committed to fostering a collaborative community
              that elevates the entire real estate profession.
            </p>
          </CardContent>
        </Card>

        {/* What We Offer Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-purple-100 dark:border-purple-900">
              <CardContent className="p-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mb-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Professional Networking
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Connect with fellow real estate professionals, share
                  referrals, and build lasting relationships that help grow your
                  business across all 50 states.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 dark:border-purple-900">
              <CardContent className="p-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit mb-4">
                  <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Industry Resources
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Access market insights, government housing programs, industry
                  news, and educational content to stay ahead in the competitive
                  real estate market.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 dark:border-purple-900">
              <CardContent className="p-6">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mb-4">
                  <Handshake className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Career Opportunities
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Discover job openings, partnership opportunities, and career
                  advancement resources tailored specifically for real estate
                  professionals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-purple-100 dark:border-purple-900">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Integrity
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  We uphold the highest standards of professional ethics,
                  mirroring the integrity expected in real estate transactions
                  and relationships.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 dark:border-purple-900">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="h-6 w-6 text-red-500" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Community
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  We foster a supportive environment where real estate
                  professionals can learn from each other, celebrate successes,
                  and navigate challenges together.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 dark:border-purple-900">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="h-6 w-6 text-blue-500" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Innovation
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  We continuously evolve our platform with cutting-edge features
                  and tools that help real estate professionals work smarter and
                  more efficiently.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 dark:border-purple-900">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-6 w-6 text-purple-500" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Inclusivity
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  We welcome real estate professionals at every stage of their
                  career, from newly licensed agents to seasoned brokers and
                  industry veterans.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <Card className="border-purple-100 dark:border-purple-900 mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Our Growing Community
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  50+
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  States Covered
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  10K+
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Active Members
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  500+
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Daily Connections
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  1000+
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Job Opportunities
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="border-purple-100 dark:border-purple-900 mb-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Have questions or want to learn more about More & More Network?
              We'd love to hear from you.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Email us at{" "}
              <a
                href="mailto:hello@moreandmore.network"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                hello@moreandmore.network
              </a>
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
