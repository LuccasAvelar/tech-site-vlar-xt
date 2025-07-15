import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "tech-store-secret-key-2024"

export function middleware(request: NextRequest) {
  // Proteger rotas admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth-token")?.value
    const fingerprint = request.cookies.get("fingerprint")?.value

    if (!token || !fingerprint) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any

      if (decoded.fingerprint !== fingerprint) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // Verificar se é admin (isso deveria ser validado no banco, mas por simplicidade...)
      // Em produção, você deveria fazer uma consulta ao banco aqui
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
