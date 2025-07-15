"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, Users, ShoppingCart, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import ProductManagement from "@/components/admin/product-management"
import OrderManagement from "@/components/admin/order-management"
import UserManagement from "@/components/admin/user-management"
import CouponManagement from "@/components/admin/coupon-management"
import WebhookManagement from "@/components/admin/webhook-management"

export default function AdminPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    if (!isAdmin) {
      router.push("/")
      return
    }
    fetchStats()
  }, [isAdmin, router])

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([fetch("/api/products"), fetch("/api/orders")])

      const products = await productsRes.json()
      const orders = await ordersRes.json()

      setStats({
        totalProducts: products.length,
        totalUsers: 1,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum: number, order: any) => sum + order.total, 0),
      })
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-bold text-white mb-8">Painel Administrativo</h1>

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
            <TabsList className="grid w-full grid-cols-5 bg-gray-800">
              <TabsTrigger value="products" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                Produtos
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                Pedidos
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                Usuários
              </TabsTrigger>
              <TabsTrigger value="coupons" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                Cupons
              </TabsTrigger>
              <TabsTrigger value="webhooks" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                Automações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-6">
              <ProductManagement />
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <OrderManagement />
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <UserManagement />
            </TabsContent>

            <TabsContent value="coupons" className="mt-6">
              <CouponManagement />
            </TabsContent>

            <TabsContent value="webhooks" className="mt-6">
              <WebhookManagement />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
