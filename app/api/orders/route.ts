import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { cookies } from "next/headers"

// Função para verificar autenticação admin
function isAuthenticated() {
  const cookieStore = cookies()
  const session = cookieStore.get("admin-session")
  return session?.value === "authenticated"
}

export async function GET() {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const orders = await sql`
      SELECT * FROM orders 
      ORDER BY created_at DESC
    `

    return NextResponse.json(orders || [])
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { products, total, paymentMethod, installments, address, couponCode } = await request.json()

    if (!products || !total || !paymentMethod || !address) {
      return NextResponse.json(
        { error: "Campos obrigatórios: products, total, paymentMethod, address" },
        { status: 400 },
      )
    }

    const result = await sql`
      INSERT INTO orders (products, total, payment_method, installments, address, coupon_code, status)
      VALUES (${JSON.stringify(products)}, ${total}, ${paymentMethod}, ${installments || "1x"}, ${address}, ${couponCode || null}, 'pending')
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
