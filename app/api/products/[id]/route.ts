import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock data (em produção seria do banco)
const mockProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    description: "Smartphone Apple iPhone 15 Pro 128GB",
    price: 7999.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Smartphones",
    stock: 10,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
]

function isAuthenticated(): boolean {
  const cookieStore = cookies()
  const session = cookieStore.get("admin-session")
  return session?.value === "authenticated"
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = mockProducts.find((p) => p.id === params.id)

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const productIndex = mockProducts.findIndex((p) => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    const updateData = await req.json()
    mockProducts[productIndex] = { ...mockProducts[productIndex], ...updateData }

    return NextResponse.json(mockProducts[productIndex])
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const productIndex = mockProducts.findIndex((p) => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    mockProducts.splice(productIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar produto:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
