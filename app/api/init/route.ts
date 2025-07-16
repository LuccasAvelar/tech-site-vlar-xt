import { NextResponse } from "next/server"
import { resetMockDb } from "@/lib/db"

export async function GET() {
  try {
    resetMockDb() // Reset mock data
    return NextResponse.json({ message: "Mock database initialized/reset successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error initializing mock database:", error)
    return NextResponse.json({ message: "Failed to initialize mock database" }, { status: 500 })
  }
}
