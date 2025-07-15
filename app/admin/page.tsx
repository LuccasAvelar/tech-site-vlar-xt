"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, Users, ShoppingCart, Settings, LogOut } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import ProductManagement from "@/components/admin/product-management"
import OrderManagement from "@/components/admin/order-management"

export default function AdminPage() {
  const { user, isAdmin, logout, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 1,
    totalOrders: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/login")
      return
    }
    if (isAdmin) {
      fetchStats()
    }
  }, [isAdmin, isLoading, router])

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([fetch("/api/products"), fetch("/api/orders")])

      const products = await productsRes.json()
      const orders = await ordersRes.json()

      setStats({
        totalProducts: Array.isArray(products) ? products.length : 0,
        totalUsers: 1,
        totalOrders: Array.isArray(orders) ? orders.length : 0,
        totalRevenue: Array.isArray(orders)
          ? orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0)
          : 0,
      })
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total de Produtos</CardTitle>
                <Package className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total de Pedidos</CardTitle>
                <ShoppingCart className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Receita Total</CardTitle>
                <Settings className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">R$ {stats.totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs de Gerenciamento */}
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="products" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                Produtos
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                Pedidos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-6">
              <ProductManagement />
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <OrderManagement />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
