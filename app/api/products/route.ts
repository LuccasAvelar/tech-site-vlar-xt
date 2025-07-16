import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const products = await db.products.findMany()
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const authCookie = req.cookies.get("admin-auth")
    if (authCookie?.value !== "authenticated") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const data = await req.json()
    const product = await db.products.create(data)
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 })
  }
}
