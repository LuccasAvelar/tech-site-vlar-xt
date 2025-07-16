import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const authCookie = req.cookies.get("admin-auth")
    if (authCookie?.value !== "authenticated") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const orders = await db.orders.findMany()
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 })
  }
}
