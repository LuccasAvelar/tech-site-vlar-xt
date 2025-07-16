"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import ProductManagement from "@/components/admin/product-management"
import OrderManagement from "@/components/admin/order-management"
import UserManagement from "@/components/admin/user-management"
import CouponManagement from "@/components/admin/coupon-management"
import WebhookManagement from "@/components/admin/webhook-management"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("products")

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/") // Redirect non-admins to home page
    }
  }, [loading, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Or a message like "Access Denied"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Painel Administrativo
          </h1>
          <p className="text-gray-300 text-xl">Gerencie sua loja TechStore</p>
        </motion.div>

        <Tabs defaultValue="products" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 bg-gray-800/50 border-gray-700">
            <TabsTrigger
              value="products"
              className="text-gray-300 data-[state=active]:bg-cyan-500 data-[state=active]:text-black"
            >
              Produtos
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="text-gray-300 data-[state=active]:bg-cyan-500 data-[state=active]:text-black"
            >
              Pedidos
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="text-gray-300 data-[state=active]:bg-cyan-500 data-[state=active]:text-black"
            >
              Usuários
            </TabsTrigger>
            <TabsTrigger
              value="coupons"
              className="text-gray-300 data-[state=active]:bg-cyan-500 data-[state=active]:text-black"
            >
              Cupons
            </TabsTrigger>
            <TabsTrigger
              value="webhooks"
              className="text-gray-300 data-[state=active]:bg-cyan-500 data-[state=active]:text-black"
            >
              Webhooks
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
      </main>
    </div>
  )
}
