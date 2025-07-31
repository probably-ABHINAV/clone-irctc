import Link from "next/link"
import { Train, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Train className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold">RailBook</span>
            </div>
            <p className="text-gray-400">
              Your trusted partner for train ticket booking with real-time availability and secure payments.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@railbook.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/search" className="block text-gray-400 hover:text-white transition-colors">
                Search Trains
              </Link>
              <Link href="/pnr-status" className="block text-gray-400 hover:text-white transition-colors">
                PNR Status
              </Link>
              <Link href="/bookings" className="block text-gray-400 hover:text-white transition-colors">
                My Bookings
              </Link>
              <Link href="/test" className="block text-gray-400 hover:text-white transition-colors">
                System Health
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <div className="space-y-2">
              <span className="block text-gray-400">Train Schedule</span>
              <span className="block text-gray-400">Seat Availability</span>
              <span className="block text-gray-400">Fare Enquiry</span>
              <span className="block text-gray-400">Station Information</span>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+91 1234567890</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@railbook.com</span>
              </div>
              <div className="flex items-start space-x-2 text-gray-400">
                <MapPin className="w-4 h-4 mt-1" />
                <span>
                  123 Railway Station Road
                  <br />
                  New Delhi, India
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 RailBook. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}
