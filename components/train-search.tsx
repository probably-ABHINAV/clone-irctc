"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, ArrowUpDown, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// Mock station data
const stations = [
  { code: "NDLS", name: "New Delhi", city: "Delhi" },
  { code: "BCT", name: "Mumbai Central", city: "Mumbai" },
  { code: "HWH", name: "Howrah Junction", city: "Kolkata" },
  { code: "MAS", name: "Chennai Central", city: "Chennai" },
  { code: "SBC", name: "Bangalore City", city: "Bangalore" },
  { code: "PUNE", name: "Pune Junction", city: "Pune" },
  { code: "JP", name: "Jaipur Junction", city: "Jaipur" },
  { code: "LKO", name: "Lucknow", city: "Lucknow" },
  { code: "BBS", name: "Bhubaneswar", city: "Bhubaneswar" },
  { code: "HYB", name: "Hyderabad Deccan", city: "Hyderabad" },
]

interface TrainSearchProps {
  onSearch?: (params: any) => void
  isSearching?: boolean
  showResults?: boolean
}

export function TrainSearch({ onSearch, isSearching = false, showResults = false }: TrainSearchProps) {
  const [fromStation, setFromStation] = useState("")
  const [toStation, setToStation] = useState("")
  const [date, setDate] = useState<Date>()
  const [travelClass, setTravelClass] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()
  const router = useRouter()

  const handleSwapStations = useCallback(() => {
    const temp = fromStation
    setFromStation(toStation)
    setToStation(temp)
  }, [fromStation, toStation])

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!fromStation.trim()) {
      newErrors.fromStation = "Please select departure station"
    }
    if (!toStation.trim()) {
      newErrors.toStation = "Please select destination station"
    }
    if (fromStation === toStation && fromStation) {
      newErrors.toStation = "Departure and destination stations cannot be the same"
    }
    if (!date) {
      newErrors.date = "Please select journey date"
    } else if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      newErrors.date = "Journey date cannot be in the past"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [fromStation, toStation, date])

  const handleSearch = useCallback(() => {
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check all required fields and try again",
        variant: "destructive",
      })
      return
    }

    const searchParams = {
      fromStation,
      toStation,
      date: date?.toISOString(),
      travelClass,
      passengers,
    }

    console.log("Searching trains with params:", searchParams)

    // If we have an onSearch callback (for search page), use it
    if (onSearch) {
      onSearch(searchParams)
    } else {
      // Otherwise, navigate to search page with parameters
      const params = new URLSearchParams({
        from: fromStation,
        to: toStation,
        date: date?.toISOString() || "",
        class: travelClass,
        passengers,
      })
      router.push(`/search?${params.toString()}`)
    }

    toast({
      title: "Searching trains...",
      description: `Looking for trains from ${fromStation} to ${toStation}`,
    })
  }, [fromStation, toStation, date, travelClass, passengers, validateForm, onSearch, router, toast])

  const formatDate = useCallback((date: Date) => {
    try {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch (error) {
      return date.toDateString()
    }
  }, [])

  const getStationDisplay = useCallback((stationCode: string) => {
    const station = stations.find((s) => s.code === stationCode)
    return station ? `${station.name} (${station.code})` : stationCode
  }, [])

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-blue-800">Search Trains</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from">From Station *</Label>
            <select
              id="from"
              value={fromStation}
              onChange={(e) => setFromStation(e.target.value)}
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.fromStation ? "border-red-500" : ""
              }`}
            >
              <option value="">Select departure station</option>
              {stations.map((station) => (
                <option key={station.code} value={station.code}>
                  {station.name} ({station.code}) - {station.city}
                </option>
              ))}
            </select>
            {errors.fromStation && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.fromStation}
              </p>
            )}
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="to">To Station *</Label>
            <select
              id="to"
              value={toStation}
              onChange={(e) => setToStation(e.target.value)}
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.toStation ? "border-red-500" : ""
              }`}
            >
              <option value="">Select destination station</option>
              {stations.map((station) => (
                <option key={station.code} value={station.code}>
                  {station.name} ({station.code}) - {station.city}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              className="absolute right-2 top-8 bg-transparent z-10"
              onClick={handleSwapStations}
              disabled={!fromStation && !toStation}
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
            {errors.toStation && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.toStation}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Journey Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                    errors.date && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? formatDate(date) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.date}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Class</Label>
            <select
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select class (optional)</option>
              <option value="SL">Sleeper (SL)</option>
              <option value="3A">AC 3 Tier (3A)</option>
              <option value="2A">AC 2 Tier (2A)</option>
              <option value="1A">AC First Class (1A)</option>
              <option value="CC">Chair Car (CC)</option>
              <option value="EC">Executive Chair Car (EC)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Passengers</Label>
            <select
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num.toString()}>
                  {num} {num === 1 ? "Passenger" : "Passengers"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Summary */}
        {fromStation && toStation && date && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Search Summary</h3>
            <div className="text-sm text-blue-700">
              <p>
                <strong>From:</strong> {getStationDisplay(fromStation)}
              </p>
              <p>
                <strong>To:</strong> {getStationDisplay(toStation)}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(date)}
              </p>
              <p>
                <strong>Passengers:</strong> {passengers}
              </p>
              {travelClass && (
                <p>
                  <strong>Class:</strong> {travelClass}
                </p>
              )}
            </div>
          </div>
        )}

        <Button
          onClick={handleSearch}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
          size="lg"
          disabled={isSearching}
        >
          <Search className="w-5 h-5 mr-2" />
          {isSearching ? "Searching..." : "Search Trains"}
        </Button>
      </CardContent>
    </Card>
  )
}
