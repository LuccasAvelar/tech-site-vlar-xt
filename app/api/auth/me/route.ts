import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1]

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  try {
    // Simplified token verification (for mock purposes)
    // In a real app, you'd verify the JWT signature and expiration
    const tokenPayload = JSON.parse(atob(token))
    const userId = tokenPayload.id

    const user = await db.users.findUnique(userId)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const { password, ...userWithoutPassword } = user // Exclude password from response

    return NextResponse.json(userWithoutPassword, { status: 200 })
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }
}
