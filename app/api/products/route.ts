import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const products = await sql`
      SELECT * FROM products 
      WHERE is_active = true
      ORDER BY created_at DESC
    `

    return NextResponse.json(products)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, price, category, stock, image } = body

    // Validação básica
    if (!name || !description || !price || !category) {
      return NextResponse.json({ error: "Campos obrigatórios não preenchidos" }, { status: 400 })
    }

    if (price <= 0) {
      return NextResponse.json({ error: "Preço deve ser maior que zero" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO products (name, description, price, category, stock, image)
      VALUES (${name}, ${description}, ${price}, ${category}, ${stock || 0}, ${image || null})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
