import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if accessing admin routes
  if (pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("admin-auth")

    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirect to admin if already authenticated and trying to access login
  if (pathname === "/login") {
    const authCookie = request.cookies.get("admin-auth")

    if (authCookie && authCookie.value === "authenticated") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
}
