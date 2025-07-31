"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Train, Calendar, MapPin, Users } from "lucide-react"

// Mock PNR data
const mockPNRData = {
  pnr: "1234567890",
  trainNumber: "12951",
  trainName: "Mumbai Rajdhani Express",
  journeyDate: "2024-01-15",
  from: "Mumbai Central (BCT)",
  to: "New Delhi (NDLS)",
  class: "AC 2 Tier (2A)",
  bookingStatus: "CONFIRMED",
  passengers: [
    { name: "John Doe", age: 35, gender: "Male", seatNumber: "A1-25", status: "CONFIRMED" },
    { name: "Jane Doe", age: 32, gender: "Female", seatNumber: "A1-26", status: "CONFIRMED" },
  ],
  totalFare: 4400,
  bookingDate: "2024-01-10",
}

export function PNRStatusChecker() {
  const [pnr, setPnr] = useState("")
  const [pnrData, setPnrData] = useState<typeof mockPNRData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCheckPNR = async () => {
    if (!pnr) {
      setError("Please enter a PNR number")
      return
    }

    if (pnr.length !== 10 || !/^\d{10}$/.test(pnr)) {
      setError("Please enter a valid 10-digit PNR number")
      return
    }

    setLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      if (pnr === "1234567890") {
        setPnrData(mockPNRData)
      } else {
        setError("PNR not found. Please check your PNR number.")
        setPnrData(null)
      }
      setLoading(false)
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "WAITING":
        return "bg-yellow-100 text-yellow-800"
      case "RAC":
        return "bg-blue-100 text-blue-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Enter PNR Number</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pnr">PNR Number</Label>
            <Input
              id="pnr"
              placeholder="Enter 10-digit PNR number"
              value={pnr}
              onChange={(e) => setPnr(e.target.value.replace(/\D/g, "").slice(0, 10))}
              maxLength={10}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <Button onClick={handleCheckPNR} className="w-full" disabled={loading}>
            {loading ? "Checking..." : "Check PNR Status"}
          </Button>
          <p className="text-xs text-gray-500 text-center">Try PNR: 1234567890 for demo</p>
        </CardContent>
      </Card>

      {pnrData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Train className="w-5 h-5" />
                <span>Booking Details</span>
              </CardTitle>
              <Badge className={getStatusColor(pnrData.bookingStatus)}>{pnrData.bookingStatus}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Train Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Train Details</h4>
                  <p className="text-sm text-gray-600">
                    {pnrData.trainNumber} - {pnrData.trainName}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Journey Date: {new Date(pnrData.journeyDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>
                    {pnrData.from} → {pnrData.to}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Booking Information</h4>
                  <p className="text-sm text-gray-600">PNR: {pnrData.pnr}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Class:</span> {pnrData.class}
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Total Fare:</span> ₹{pnrData.totalFare}
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Booked on:</span> {new Date(pnrData.bookingDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Passenger Details</span>
              </h4>
              <div className="space-y-3">
                {pnrData.passengers.map((passenger, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">{passenger.name}</h5>
                        <p className="text-sm text-gray-600">
                          {passenger.age} years, {passenger.gender}
                        </p>
                        {passenger.seatNumber && (
                          <p className="text-sm text-blue-600 font-medium">Seat: {passenger.seatNumber}</p>
                        )}
                      </div>
                      <Badge className={getStatusColor(passenger.status)}>{passenger.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4 border-t">
              <Button variant="outline" className="flex-1 bg-transparent">
                Download Ticket
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Cancel Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
