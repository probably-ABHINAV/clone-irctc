"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Train, Users, Download, X, AlertCircle } from "lucide-react"

// Mock booking data
const mockBookings = [
  {
    id: "1",
    pnr: "1234567890",
    trainNumber: "12951",
    trainName: "Mumbai Rajdhani Express",
    from: "Mumbai Central (BCT)",
    to: "New Delhi (NDLS)",
    journeyDate: "2024-01-15",
    bookingDate: "2024-01-10",
    status: "CONFIRMED",
    passengers: 2,
    totalFare: 4400,
    class: "AC 2 Tier (2A)",
  },
  {
    id: "2",
    pnr: "9876543210",
    trainNumber: "12301",
    trainName: "Howrah Rajdhani Express",
    from: "Howrah Junction (HWH)",
    to: "New Delhi (NDLS)",
    journeyDate: "2024-01-20",
    bookingDate: "2024-01-12",
    status: "WAITING",
    passengers: 1,
    totalFare: 2400,
    class: "AC 2 Tier (2A)",
  },
  {
    id: "3",
    pnr: "5555666677",
    trainNumber: "12621",
    trainName: "Tamil Nadu Express",
    from: "Chennai Central (MAS)",
    to: "New Delhi (NDLS)",
    journeyDate: "2023-12-25",
    bookingDate: "2023-12-20",
    status: "COMPLETED",
    passengers: 3,
    totalFare: 3600,
    class: "AC 3 Tier (3A)",
  },
]

export function BookingHistory() {
  const [bookings, setBookings] = useState(mockBookings)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [error, setError] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "WAITING":
        return "bg-yellow-100 text-yellow-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filterBookings = (status: string) => {
    if (status === "all") return bookings
    if (status === "upcoming") {
      return bookings.filter((booking) => new Date(booking.journeyDate) >= new Date() && booking.status !== "CANCELLED")
    }
    if (status === "past") {
      return bookings.filter((booking) => new Date(booking.journeyDate) < new Date() || booking.status === "COMPLETED")
    }
    return bookings.filter((booking) => booking.status === status.toUpperCase())
  }

  const handleCancelBooking = (bookingId: string) => {
    // TODO: Implement booking cancellation
    console.log("Cancelling booking:", bookingId)
  }

  const handleDownloadTicket = (bookingId: string) => {
    // TODO: Implement ticket download
    console.log("Downloading ticket:", bookingId)
  }

  const filteredBookings = filterBookings(activeTab)

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Bookings</h3>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => setError(null)} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Train className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600">
                  {activeTab === "all" ? "You haven't made any bookings yet." : `No ${activeTab} bookings found.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-blue-800">
                        {booking.trainNumber} - {booking.trainName}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">PNR: {booking.pnr}</p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{booking.from}</p>
                        <p className="text-xs text-gray-500">From</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{booking.to}</p>
                        <p className="text-xs text-gray-500">To</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{new Date(booking.journeyDate).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">Journey Date</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{booking.passengers} Passengers</p>
                        <p className="text-xs text-gray-500">{booking.class}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-lg font-bold text-gray-900">₹{booking.totalFare}</p>
                      <p className="text-xs text-gray-500">
                        Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      {booking.status === "CONFIRMED" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadTicket(booking.id)}
                            className="bg-transparent"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="bg-transparent text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === "WAITING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="bg-transparent text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                      {booking.status === "COMPLETED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadTicket(booking.id)}
                          className="bg-transparent"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
