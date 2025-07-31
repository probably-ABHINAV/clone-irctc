import { type NextRequest, NextResponse } from "next/server"
import { getPNRStatus } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { pnr: string } }) {
  try {
    const pnr = params.pnr

    if (!pnr || pnr.length !== 10) {
      return NextResponse.json({ error: "Invalid PNR number" }, { status: 400 })
    }

    const booking = await getPNRStatus(pnr)

    if (!booking) {
      return NextResponse.json({ error: "PNR not found" }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error in PNR API:", error)
    return NextResponse.json({ error: "Failed to fetch PNR status" }, { status: 500 })
  }
}
