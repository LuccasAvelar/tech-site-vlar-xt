import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Proteger rotas admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const session = request.cookies.get("admin-session")

    if (!session || session.value !== "authenticated") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
