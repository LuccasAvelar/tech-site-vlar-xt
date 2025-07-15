import { type NextRequest, NextResponse } from "next/server"

// Mock data para pedidos
const mockOrders = [
  {
    id: "1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    total: 7999.99,
    status: "pending",
    items: [
      {
        productId: "1",
        productName: "iPhone 15 Pro",
        quantity: 1,
        price: 7999.99,
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    customerName: "Maria Santos",
    customerEmail: "maria@email.com",
    total: 15499.98,
    status: "completed",
    items: [
      {
        productId: "2",
        productName: "MacBook Air M2",
        quantity: 1,
        price: 12999.99,
      },
      {
        productId: "3",
        productName: "AirPods Pro",
        quantity: 1,
        price: 2499.99,
      },
    ],
    createdAt: new Date().toISOString(),
  },
]

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(mockOrders)
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
