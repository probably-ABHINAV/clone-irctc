import { NextResponse } from "next/server"
import { getStations } from "@/lib/database"

export async function GET() {
  try {
    const stations = await getStations()
    return NextResponse.json(stations)
  } catch (error) {
    console.error("Error in stations API:", error)
    return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 })
  }
}
