import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "tech-store-secret-key-2024"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")?.value
    const fingerprint = cookieStore.get("fingerprint")?.value

    if (!token || !fingerprint) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Verificar fingerprint
    if (decoded.fingerprint !== fingerprint) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const users = await sql`
      SELECT id, name, email, phone, birth_date, avatar, is_admin, created_at, updated_at
      FROM users WHERE id = ${decoded.userId}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json(users[0])
  } catch (error) {
    console.error("Erro na verificação:", error)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  }
}
