"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users, IndianRupee, AlertCircle, Train } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"

interface SearchParams {
  fromStation: string
  toStation: string
  date: string
  travelClass: string
  passengers: string
}

interface TrainSearchResultsProps {
  searchParams: SearchParams
  isLoading?: boolean
}

// Station mapping for display
const stationNames: Record<string, string> = {
  NDLS: "New Delhi",
  BCT: "Mumbai Central",
  HWH: "Howrah Junction",
  MAS: "Chennai Central",
  SBC: "Bangalore City",
  PUNE: "Pune Junction",
  JP: "Jaipur Junction",
  LKO: "Lucknow",
  BBS: "Bhubaneswar",
  HYB: "Hyderabad Deccan",
}

export function TrainSearchResults({ searchParams, isLoading = false }: TrainSearchResultsProps) {
  // Use useMemo to prevent regenerating trains on every render
  const trains = useMemo(() => {
    const { fromStation, toStation, travelClass } = searchParams

    const fromName = stationNames[fromStation] || fromStation
    const toName = stationNames[toStation] || toStation

    // Base trains available for all routes
    const allTrains = [
      {
        id: "1",
        trainNumber: "12951",
        trainName: "Rajdhani Express",
        departure: "16:55",
        arrival: "08:35",
        duration: "15h 40m",
        classes: [
          { code: "1A", name: "AC First Class", available: 12, fare: 3500, status: "AVAILABLE" },
          { code: "2A", name: "AC 2 Tier", available: 28, fare: 2200, status: "AVAILABLE" },
          { code: "3A", name: "AC 3 Tier", available: 45, fare: 1650, status: "AVAILABLE" },
        ],
      },
      {
        id: "2",
        trainNumber: "12301",
        trainName: "Superfast Express",
        departure: "14:30",
        arrival: "06:15",
        duration: "15h 45m",
        classes: [
          { code: "SL", name: "Sleeper", available: 32, fare: 450, status: "AVAILABLE" },
          { code: "3A", name: "AC 3 Tier", available: 18, fare: 1200, status: "AVAILABLE" },
          { code: "2A", name: "AC 2 Tier", available: 25, fare: 1800, status: "AVAILABLE" },
        ],
      },
      {
        id: "3",
        trainNumber: "12621",
        trainName: "Mail Express",
        departure: "22:30",
        arrival: "14:25",
        duration: "15h 55m",
        classes: [
          { code: "SL", name: "Sleeper", available: 0, fare: 380, status: "WAITING" },
          { code: "3A", name: "AC 3 Tier", available: 15, fare: 980, status: "AVAILABLE" },
          { code: "CC", name: "Chair Car", available: 8, fare: 750, status: "AVAILABLE" },
        ],
      },
      {
        id: "4",
        trainNumber: "12049",
        trainName: "Gatimaan Express",
        departure: "08:10",
        arrival: "12:25",
        duration: "4h 15m",
        classes: [
          { code: "CC", name: "Chair Car", available: 45, fare: 750, status: "AVAILABLE" },
          { code: "EC", name: "Executive Chair Car", available: 12, fare: 1500, status: "AVAILABLE" },
        ],
      },
    ]

    // Add route information to each train
    let filteredTrains = allTrains.map((train) => ({
      ...train,
      from: `${fromName} (${fromStation})`,
      to: `${toName} (${toStation})`,
    }))

    // Filter by class if specified
    if (travelClass) {
      filteredTrains = filteredTrains.filter((train) => train.classes.some((cls) => cls.code === travelClass))
    }

    return filteredTrains
  }, [searchParams])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800"
      case "WAITING":
        return "bg-yellow-100 text-yellow-800"
      case "UNAVAILABLE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    } catch (error) {
      return "Today"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <LoadingSpinner size="lg" />
            <h3 className="text-lg font-semibold">Searching trains...</h3>
            <p className="text-gray-600">Please wait while we find the best options for you</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Info Header */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-800">
                Search Results: {searchParams.fromStation} → {searchParams.toStation}
              </h2>
              <p className="text-blue-600">
                {formatDate(searchParams.date)} • {searchParams.passengers} passenger(s)
                {searchParams.travelClass && ` • ${searchParams.travelClass} class`}
              </p>
            </div>
            <Badge variant="outline" className="bg-white">
              {trains.length} trains found
            </Badge>
          </div>
        </CardContent>
      </Card>

      {trains.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trains found</h3>
            <p className="text-gray-600 mb-4">No trains available for the selected route and date. Please try:</p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Selecting a different date</li>
              <li>• Checking nearby stations</li>
              <li>• Removing class filter</li>
            </ul>
          </CardContent>
        </Card>
      ) : (
        trains.map((train) => (
          <Card key={train.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-blue-800 flex items-center">
                    <Train className="w-5 h-5 mr-2" />
                    {train.trainNumber} - {train.trainName}
                  </CardTitle>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{train.from}</span>
                    </div>
                    <span>→</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{train.to}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-lg font-semibold">
                    <span>{train.departure}</span>
                    <span>→</span>
                    <span>{train.arrival}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{train.duration}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {train.classes.map((trainClass) => (
                  <div key={trainClass.code} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{trainClass.name}</h4>
                        <p className="text-sm text-gray-600">({trainClass.code})</p>
                      </div>
                      <Badge className={getStatusColor(trainClass.status)}>{trainClass.status}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>Available:</span>
                        </div>
                        <span className="font-semibold">{trainClass.available > 0 ? trainClass.available : "WL"}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <IndianRupee className="w-4 h-4" />
                          <span>Fare:</span>
                        </div>
                        <span className="font-semibold">₹{trainClass.fare}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4"
                      disabled={trainClass.status === "UNAVAILABLE"}
                      variant={trainClass.status === "AVAILABLE" ? "default" : "outline"}
                      onClick={() => {
                        if (trainClass.status === "AVAILABLE") {
                          const bookingParams = new URLSearchParams({
                            train: train.trainNumber,
                            trainName: train.trainName,
                            from: train.from,
                            to: train.to,
                            departure: train.departure,
                            arrival: train.arrival,
                            duration: train.duration,
                            date: searchParams.date,
                            class: trainClass.code,
                            className: trainClass.name,
                            fare: trainClass.fare.toString(),
                            passengers: searchParams.passengers,
                          })
                          window.location.href = `/booking?${bookingParams.toString()}`
                        }
                      }}
                    >
                      {trainClass.status === "AVAILABLE"
                        ? "Book Now"
                        : trainClass.status === "WAITING"
                          ? "Join Waitlist"
                          : "Unavailable"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
