"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { BookingForm } from "@/components/booking/booking-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Train, MapPin, Clock, Users, IndianRupee } from "lucide-react"

interface BookingDetails {
  trainNumber: string
  trainName: string
  from: string
  to: string
  departure: string
  arrival: string
  duration: string
  date: string
  classCode: string
  className: string
  fare: number
  passengers: number
}

export default function BookingPage() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  // Memoize the formatDate function to prevent recreation
  const formatDate = useMemo(() => {
    return (dateString: string) => {
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      } catch (error) {
        return dateString
      }
    }
  }, [])

  // Memoize the search params to prevent infinite loops
  const memoizedParams = useMemo(() => {
    return {
      trainNumber: searchParams.get("train"),
      trainName: searchParams.get("trainName"),
      from: searchParams.get("from"),
      to: searchParams.get("to"),
      departure: searchParams.get("departure"),
      arrival: searchParams.get("arrival"),
      duration: searchParams.get("duration"),
      date: searchParams.get("date"),
      classCode: searchParams.get("class"),
      className: searchParams.get("className"),
      fare: searchParams.get("fare"),
      passengers: searchParams.get("passengers"),
    }
  }, [searchParams])

  // Extract booking details from URL parameters with stable dependencies
  useEffect(() => {
    const extractDetails = () => {
      try {
        const {
          trainNumber,
          trainName,
          from,
          to,
          departure,
          arrival,
          duration,
          date,
          classCode,
          className,
          fare,
          passengers,
        } = memoizedParams

        if (trainNumber && trainName && from && to && date && classCode && className && fare) {
          const details: BookingDetails = {
            trainNumber,
            trainName,
            from,
            to,
            departure: departure || "",
            arrival: arrival || "",
            duration: duration || "",
            date,
            classCode,
            className,
            fare: Number.parseInt(fare),
            passengers: Number.parseInt(passengers || "1"),
          }

          setBookingDetails(details)
          setError(null)
        } else {
          setError("Missing required booking parameters")
          setBookingDetails(null)
        }
      } catch (err) {
        setError("Failed to load booking details")
        setBookingDetails(null)
        console.error("Booking page error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    extractDetails()
  }, [memoizedParams]) // Use memoized params as dependency

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !bookingDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Booking Request</h2>
            <p className="text-gray-600">
              {error || "Please select a train from the search results to proceed with booking."}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Please fill in passenger details to confirm your train ticket booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Train className="w-5 h-5" />
                  <span>Booking Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-blue-800">
                    {bookingDetails.trainNumber} - {bookingDetails.trainName}
                  </h3>
                  <Badge variant="outline" className="mt-1">
                    {bookingDetails.className} ({bookingDetails.classCode})
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{bookingDetails.from}</p>
                      <p className="text-gray-500">Departure: {bookingDetails.departure}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{bookingDetails.to}</p>
                      <p className="text-gray-500">Arrival: {bookingDetails.arrival}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Journey Date</p>
                      <p className="text-gray-500">{formatDate(bookingDetails.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Passengers</p>
                      <p className="text-gray-500">{bookingDetails.passengers} passenger(s)</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <IndianRupee className="w-4 h-4" />
                      <span className="font-semibold">Total Fare</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">
                      ₹{bookingDetails.fare * bookingDetails.passengers}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{bookingDetails.fare} × {bookingDetails.passengers} passenger(s)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <BookingForm bookingDetails={bookingDetails} />
          </div>
        </div>
      </div>
    </div>
  )
}
