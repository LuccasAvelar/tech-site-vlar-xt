import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validação simples com variáveis de ambiente
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      console.error("ADMIN_EMAIL ou ADMIN_PASSWORD não configurados no .env")
      return NextResponse.json({ error: "Configuração do servidor incompleta" }, { status: 500 })
    }

    if (email === adminEmail && password === adminPassword) {
      // Definir cookie simples para sessão
      const cookieStore = cookies()
      cookieStore.set("admin-session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60, // 24 horas
      })

      return NextResponse.json({
        success: true,
        user: {
          id: "admin",
          name: "Administrador",
          email: adminEmail,
          isAdmin: true,
        },
      })
    } else {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
