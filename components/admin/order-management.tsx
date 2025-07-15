"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface Order {
  id: string
  products: any[]
  total: number
  payment_method: string
  installments: string
  address: string
  coupon_code?: string
  status: string
  created_at: string
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/orders")
      const data = await response.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "confirmed":
        return "bg-blue-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente"
      case "confirmed":
        return "Confirmado"
      case "delivered":
        return "Entregue"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  if (isLoading) {
    return <div className="text-white">Carregando pedidos...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Gerenciar Pedidos</h2>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center text-gray-400 py-8">Nenhum pedido encontrado.</div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white">Pedido #{order.id.slice(-8)}</CardTitle>
                  <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-gray-400 text-sm">Total:</span>
                    <p className="text-cyan-400 font-semibold text-lg">R$ {order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Pagamento:</span>
                    <p className="text-white">{order.payment_method}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Parcelas:</span>
                    <p className="text-white">{order.installments}</p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">Endereço:</span>
                  <p className="text-white">{order.address}</p>
                </div>

                {order.coupon_code && (
                  <div>
                    <span className="text-gray-400 text-sm">Cupom:</span>
                    <p className="text-green-400">{order.coupon_code}</p>
                  </div>
                )}

                <div>
                  <span className="text-gray-400 text-sm">Data:</span>
                  <p className="text-white">{new Date(order.created_at).toLocaleString("pt-BR")}</p>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">Produtos:</span>
                  <div className="mt-2 space-y-2">
                    {Array.isArray(order.products) ? (
                      order.products.map((product: any, index: number) => (
                        <div key={index} className="bg-gray-700/50 p-3 rounded flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">{product.name}</p>
                            <p className="text-gray-400 text-sm">Quantidade: {product.quantity}</p>
                          </div>
                          <p className="text-cyan-400">R$ {(product.price * product.quantity).toFixed(2)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">Produtos não disponíveis</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
