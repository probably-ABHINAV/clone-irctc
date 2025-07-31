import { type NextRequest, NextResponse } from "next/server"
import { searchTrains } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fromStation, toStation, journeyDate } = body

    if (!fromStation || !toStation || !journeyDate) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const trains = await searchTrains({
      fromStation,
      toStation,
      journeyDate,
    })

    return NextResponse.json(trains)
  } catch (error) {
    console.error("Error in search API:", error)
    return NextResponse.json({ error: "Failed to search trains" }, { status: 500 })
  }
}
