import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Basic health check
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        api: "operational",
        database: process.env.DATABASE_URL ? "configured" : "not_configured",
        supabase: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "not_configured",
      },
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
