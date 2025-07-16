"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import type { Order, Product } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [productsMap, setProductsMap] = useState<Map<string, Product>>(new Map())

  useEffect(() => {
    fetchOrders()
    fetchProductsMap()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
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

  const fetchProductsMap = async () => {
    try {
      const response = await fetch("/api/products")
      const data: Product[] = await response.json()
      const map = new Map<string, Product>()
      data.forEach((product) => map.set(product.id, product))
      setProductsMap(map)
    } catch (error) {
      console.error("Erro ao carregar produtos para o mapa:", error)
    }
  }

  const getProductDetails = (productId: string) => {
    return productsMap.get(productId) || { name: "Produto Desconhecido", price: 0, image: "/placeholder.png" }
  }

  const getStatusBadgeVariant = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "default" // Green-ish
      case "pending":
        return "secondary" // Yellow-ish
      case "cancelled":
        return "destructive" // Red-ish
      default:
        return "default"
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        // Assuming an API route for single order update
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchOrders() // Refresh orders
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
        }
      } else {
        const errorData = await response.json()
        alert(`Erro ao atualizar status: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error)
      alert("Erro inesperado ao atualizar status do pedido.")
    }
  }

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  if (loading) {
    return <div className="text-white text-center py-8">Carregando pedidos...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Gerenciamento de Pedidos</h2>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-700/70">
              <TableHead className="text-gray-300">ID do Pedido</TableHead>
              <TableHead className="text-gray-300">Usuário</TableHead>
              <TableHead className="text-gray-300">Total</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Data</TableHead>
              <TableHead className="text-gray-300 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="border-gray-700 hover:bg-gray-700/30">
                <TableCell className="font-medium text-white">{order.id}</TableCell>
                <TableCell className="text-gray-400">{order.userId}</TableCell> {/* Could fetch user name */}
                <TableCell className="text-cyan-400">{formatPrice(order.total)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell className="text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openOrderDetails(order)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md md:max-w-lg lg:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-white">Detalhes do Pedido #{selectedOrder?.id}</DialogTitle>
            <DialogDescription className="text-gray-400">Informações detalhadas sobre o pedido.</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4 text-gray-300">
              <div>
                <p>
                  <strong>Usuário ID:</strong> {selectedOrder.userId}
                </p>
                <p>
                  <strong>Endereço:</strong> {selectedOrder.address}
                </p>
                <p>
                  <strong>Método de Pagamento:</strong> {selectedOrder.paymentMethod}{" "}
                  {selectedOrder.installments && `(${selectedOrder.installments}x)`}
                </p>
                <p>
                  <strong>Cupom:</strong> {selectedOrder.couponCode || "Nenhum"}
                </p>
                <p>
                  <strong>Data do Pedido:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-white">Produtos:</h3>
                {selectedOrder.products.map((item, index) => {
                  const product = getProductDetails(item.productId)
                  return (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>
                        {product.name} (x{item.quantity})
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-gray-700 pt-4 flex justify-between items-center text-lg font-bold text-cyan-400">
                <span>Total:</span>
                <span>{formatPrice(selectedOrder.total)}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status-select" className="text-gray-300">
                  Atualizar Status:
                </Label>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value: Order["status"]) => handleStatusChange(selectedOrder.id, value)}
                >
                  <SelectTrigger id="status-select" className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Selecione o Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={() => setIsDialogOpen(false)} className="bg-cyan-500 hover:bg-cyan-600 text-black">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
