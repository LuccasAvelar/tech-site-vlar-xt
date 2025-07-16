import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { serialize } from "cookie"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here" // Use a strong secret in production

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
  }

  const user = await db.users.findByEmail(email)

  if (!user || user.password !== password) {
    // In a real app, use bcrypt.compare
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
  }

  // Simplified token generation (for mock purposes)
  // In a real app, you'd use a JWT library like 'jsonwebtoken'
  const tokenPayload = { id: user.id, email: user.email, role: user.role }
  const token = btoa(JSON.stringify(tokenPayload)) // Base64 encode for simplicity

  const cookie = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  const { password: _, ...userWithoutPassword } = user // Exclude password from response

  return NextResponse.json(userWithoutPassword, {
    status: 200,
    headers: { "Set-Cookie": cookie },
  })
}
