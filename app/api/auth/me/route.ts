import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const authCookie = req.cookies.get("admin-auth")

  if (authCookie?.value === "authenticated") {
    return NextResponse.json({
      authenticated: true,
      user: { email: process.env.ADMIN_EMAIL },
    })
  }

  return NextResponse.json({ authenticated: false }, { status: 401 })
}
