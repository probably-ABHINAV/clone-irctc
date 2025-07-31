"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Share, Train, Calendar, MapPin, Users } from "lucide-react"
import Link from "next/link"

export default function BookingConfirmationPage() {
  const [pnr, setPnr] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const pnrParam = searchParams.get("pnr")
    if (pnrParam) {
      setPnr(pnrParam)
    }
  }, [searchParams])

  if (!pnr) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Confirmation</h2>
            <p className="text-gray-600">No booking confirmation found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your train ticket has been successfully booked</p>
        </div>

        {/* PNR Card */}
        <Card className="mb-8 bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Your PNR Number</h2>
            <div className="text-3xl font-bold text-green-600 mb-2">{pnr}</div>
            <p className="text-sm text-green-700">
              Please save this PNR number for future reference and ticket checking
            </p>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Train className="w-5 h-5" />
              <span>Booking Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mock booking details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Train Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Train:</span> 12951 - Rajdhani Express
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Class:</span> AC 2 Tier (2A)
                    </p>
                    <Badge className="bg-green-100 text-green-800">CONFIRMED</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Journey Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>New Delhi (NDLS) → Mumbai Central (BCT)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Journey Date: {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>1 Passenger</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Passenger Details</h3>
                  <div className="border rounded-lg p-3">
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-600">Age: 30, Male</p>
                    <p className="text-sm text-blue-600">Seat: A1-25 (Confirmed)</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Total Fare:</span> ₹2,200
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Payment Method:</span> Credit Card
                    </p>
                    <Badge className="bg-blue-100 text-blue-800">PAID</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download E-Ticket</span>
          </Button>

          <Button variant="outline" size="lg" className="flex items-center space-x-2 bg-transparent">
            <Share className="w-4 h-4" />
            <span>Share Booking</span>
          </Button>

          <Link href="/bookings">
            <Button variant="outline" size="lg" className="w-full bg-transparent">
              View All Bookings
            </Button>
          </Link>
        </div>

        {/* Important Notes */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-800 mb-3">Important Notes</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Please carry a valid photo ID proof during your journey</li>
              <li>• Arrive at the station at least 30 minutes before departure</li>
              <li>• E-ticket and ID proof are mandatory for travel</li>
              <li>• Check your PNR status before traveling</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
