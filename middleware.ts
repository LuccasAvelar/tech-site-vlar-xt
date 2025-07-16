import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  // Allow access to public routes
  if (pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // If no token and trying to access a protected route, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Verify token and user role for protected routes
  try {
    const response = await fetch(new URL("/api/auth/me", request.url), {
      headers: {
        Cookie: `token=${token}`,
      },
    })

    if (!response.ok) {
      // Token invalid or expired, redirect to login
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const user = await response.json()

    // Admin route protection
    if (pathname.startsWith("/admin") && user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url)) // Redirect non-admins from admin page
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware authentication error:", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|placeholder.svg|placeholder-logo.png|placeholder-logo.svg|placeholder.jpg|placeholder-user.jpg).*)",
  ],
}
