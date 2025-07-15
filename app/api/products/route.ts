import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock data para produtos
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
  {
    id: "2",
    name: "MacBook Air M2",
    description: 'Notebook Apple MacBook Air 13" M2 256GB',
    price: 12999.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Notebooks",
    stock: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "AirPods Pro",
    description: "Fones de ouvido Apple AirPods Pro 2ª geração",
    price: 2499.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Acessórios",
    stock: 15,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
]

function isAuthenticated(req: NextRequest): boolean {
  const cookieStore = cookies()
  const session = cookieStore.get("admin-session")
  return session?.value === "authenticated"
}

export async function GET(req: NextRequest) {
  try {
    // Para GET, não precisa de autenticação (produtos públicos)
    return NextResponse.json(mockProducts)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const productData = await req.json()

    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date().toISOString(),
      isActive: true,
    }

    mockProducts.push(newProduct)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
