import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // For now, we'll disable middleware-based auth protection
  // This will be re-enabled once Supabase is properly configured

  const protectedRoutes = ["/profile", "/bookings", "/booking"]
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Skip auth check for now - will be implemented after Supabase setup
  if (isProtectedRoute) {
    // TODO: Add proper auth check once Supabase is configured
    console.log("Accessing protected route:", req.nextUrl.pathname)
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
