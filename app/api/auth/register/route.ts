import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { serialize } from "cookie"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here" // Use a strong secret in production

export async function POST(request: Request) {
  const { name, email, password } = await request.json()

  if (!name || !email || !password) {
    return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
  }

  const existingUser = await db.users.findByEmail(email)
  if (existingUser) {
    return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
  }

  // In a real app, hash the password before saving
  const newUser = await db.users.create({
    name,
    email,
    password, // In a real app, this would be hashed
    role: "user", // Default role for new registrations
  })

  // Simplified token generation (for mock purposes)
  const tokenPayload = { id: newUser.id, email: newUser.email, role: newUser.role }
  const token = btoa(JSON.stringify(tokenPayload)) // Base64 encode for simplicity

  const cookie = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  const { password: _, ...userWithoutPassword } = newUser // Exclude password from response

  return NextResponse.json(userWithoutPassword, {
    status: 201,
    headers: { "Set-Cookie": cookie },
  })
}
