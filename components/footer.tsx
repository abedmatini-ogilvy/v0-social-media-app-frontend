import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-10 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">CivicConnect</h3>
            <p className="text-sm text-gray-300 mb-4">
              Empowering citizens and government officials with a unified platform for better civic engagement and
              governance.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="text-gray-300 hover:text-white">
                  Government Schemes
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-gray-300 hover:text-white">
                  Jobs & Opportunities
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-300 hover:text-white">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-gray-300 hover:text-white">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-300" />
                <a href="mailto:support@civicconnect.in" className="text-gray-300 hover:text-white">
                  support@civicconnect.in
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-300" />
                <a href="tel:+911234567890" className="text-gray-300 hover:text-white">
                  +91 1234 567 890
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Download Our App</h4>
              <div className="flex space-x-2">
                <Link href="#" className="bg-white text-blue-900 text-xs px-3 py-1 rounded">
                  Google Play
                </Link>
                <Link href="#" className="bg-white text-blue-900 text-xs px-3 py-1 rounded">
                  App Store
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>© 2023 CivicConnect. All rights reserved.</p>
          <p className="mt-1">Made in India for India</p>
        </div>
      </div>
    </footer>
  )
}
