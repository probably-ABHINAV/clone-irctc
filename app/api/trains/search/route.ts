import { type NextRequest, NextResponse } from "next/server"

// Mock train data for API
const mockTrainData = [
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
      { code: "SL", name: "Sleeper", available: 0, fare: 450, status: "WAITING" },
      { code: "3A", name: "AC 3 Tier", available: 18, fare: 1200, status: "AVAILABLE" },
      { code: "2A", name: "AC 2 Tier", available: 25, fare: 1800, status: "AVAILABLE" },
    ],
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fromStation, toStation, journeyDate, travelClass } = body

    // Validate required parameters
    if (!fromStation || !toStation || !journeyDate) {
      return NextResponse.json(
        { error: "Missing required parameters: fromStation, toStation, journeyDate" },
        { status: 400 },
      )
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Filter trains by class if specified
    let trains = mockTrainData
    if (travelClass) {
      trains = trains.filter((train) => train.classes.some((cls) => cls.code === travelClass))
    }

    // Add route information to each train
    const trainsWithRoute = trains.map((train) => ({
      ...train,
      from: `${fromStation}`,
      to: `${toStation}`,
      journeyDate,
    }))

    return NextResponse.json({
      success: true,
      data: trainsWithRoute,
      searchParams: { fromStation, toStation, journeyDate, travelClass },
    })
  } catch (error) {
    console.error("Error in train search API:", error)
    return NextResponse.json({ error: "Failed to search trains" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Train search API endpoint. Use POST method with search parameters.",
    requiredParams: ["fromStation", "toStation", "journeyDate"],
    optionalParams: ["travelClass", "passengers"],
  })
}
