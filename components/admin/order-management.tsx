"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"

interface Order {
  id: string
  user_name: string
  user_email: string
  user_phone: string
  total: number
  payment_method: string
  installments: number
  address: string
  status: string
  created_at: string
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Pendente", variant: "secondary" as const },
      confirmed: { label: "Confirmado", variant: "default" as const },
      delivered: { label: "Entregue", variant: "default" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
    }

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending

    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciar Pedidos</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-white mb-4">Nenhum pedido encontrado</h3>
          <p className="text-gray-400">Os pedidos aparecerão aqui quando forem realizados</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg">Pedido #{order.id}</CardTitle>
                      <p className="text-gray-400 text-sm">{formatDate(new Date(order.created_at))}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Cliente</h4>
                      <p className="text-gray-300">{order.user_name}</p>
                      <p className="text-gray-400 text-sm">{order.user_email}</p>
                      <p className="text-gray-400 text-sm">{order.user_phone}</p>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Pedido</h4>
                      <p className="text-cyan-400 font-bold text-lg">{formatPrice(order.total)}</p>
                      <p className="text-gray-400 text-sm">
                        {order.payment_method} - {order.installments}x
                      </p>
                      <p className="text-gray-400 text-sm mt-2">{order.address}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline" className="border-gray-600">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Button size="sm" variant="outline" className="border-green-600 text-green-400">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmar
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
