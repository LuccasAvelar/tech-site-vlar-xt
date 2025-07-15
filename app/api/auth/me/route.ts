import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get("admin-session")

    if (!session || session.value !== "authenticated") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const adminEmail = process.env.ADMIN_EMAIL

    return NextResponse.json({
      id: "admin",
      name: "Administrador",
      email: adminEmail,
      isAdmin: true,
    })
  } catch (error) {
    console.error("Erro na verificação:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
