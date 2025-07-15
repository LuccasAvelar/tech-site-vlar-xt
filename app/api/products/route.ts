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
    const products = await sql`
      SELECT * FROM products 
      WHERE is_active = true 
      ORDER BY created_at DESC
    `

    return NextResponse.json(products || [])
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json([], { status: 200 }) // Retorna array vazio em caso de erro
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { name, description, price, category, stock, image } = await request.json()

    if (!name || !description || !price || !category) {
      return NextResponse.json({ error: "Campos obrigatórios: name, description, price, category" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO products (name, description, price, category, stock, image, is_active)
      VALUES (${name}, ${description}, ${price}, ${category}, ${stock || 0}, ${image || null}, true)
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
