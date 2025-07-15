import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await db.products.findById(params.id)
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar produto" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authCookie = req.cookies.get("admin-auth")
    if (authCookie?.value !== "authenticated") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const data = await req.json()
    const product = await db.products.update(params.id, data)

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authCookie = req.cookies.get("admin-auth")
    if (authCookie?.value !== "authenticated") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const success = await db.products.delete(params.id)

    if (!success) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar produto" }, { status: 500 })
  }
}
