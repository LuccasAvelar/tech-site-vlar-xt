import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "tech-store-secret-key-2024"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, birthDate } = await request.json()

    // Verificar se email já existe
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar novo usuário
    const result = await sql`
      INSERT INTO users (name, email, password, phone, birth_date)
      VALUES (${name}, ${email}, ${hashedPassword}, ${phone}, ${birthDate})
      RETURNING id, name, email, phone, birth_date, is_admin, created_at, updated_at
    `

    const newUser = result[0]

    // Criar fingerprint
    const userAgent = request.headers.get("user-agent") || ""
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || ""
    const fingerprint = Buffer.from(`${ip}:${userAgent}`).toString("base64")

    // Criar JWT
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        fingerprint,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    // Configurar cookies
    const cookieStore = cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    })

    cookieStore.set("fingerprint", fingerprint, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("Erro no registro:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
