"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Percent, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Coupon {
  id: string
  code: string
  discount: number
  type: "percentage" | "fixed"
  isActive: boolean
  expiresAt?: string
}

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    type: "percentage" as "percentage" | "fixed",
    expiresAt: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: formData.code.toUpperCase(),
      discount: Number.parseFloat(formData.discount),
      type: formData.type,
      isActive: true,
      expiresAt: formData.expiresAt || undefined,
    }

    setCoupons([...coupons, newCoupon])
    setIsDialogOpen(false)
    setFormData({
      code: "",
      discount: "",
      type: "percentage",
      expiresAt: "",
    })
  }

  const handleDelete = (couponId: string) => {
    setCoupons(coupons.filter((c) => c.id !== couponId))
  }

  const toggleActive = (couponId: string) => {
    setCoupons(coupons.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c)))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciar Cupons</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cupom
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Criar Novo Cupom</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código do Cupom</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                  placeholder="DESCONTO10"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">Desconto</Label>
                  <Input
                    id="discount"
                    type="number"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "percentage" | "fixed") => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                      <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Data de Expiração (Opcional)</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-gray-600"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600"
                >
                  Criar Cupom
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {coupons.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-white mb-4">Nenhum cupom criado</h3>
          <p className="text-gray-400">Crie cupons de desconto para seus clientes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon, index) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-lg">{coupon.code}</CardTitle>
                    <Badge variant={coupon.isActive ? "default" : "secondary"}>
                      {coupon.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-cyan-400 font-bold text-xl">
                      {coupon.type === "percentage" ? (
                        <Percent className="h-5 w-5 mr-1" />
                      ) : (
                        <DollarSign className="h-5 w-5 mr-1" />
                      )}
                      {coupon.discount}
                      {coupon.type === "percentage" ? "%" : ""}
                    </div>
                    {coupon.expiresAt && (
                      <p className="text-gray-400 text-sm">
                        Expira em: {new Date(coupon.expiresAt).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(coupon.id)}
                      className="border-gray-600"
                    >
                      {coupon.isActive ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(coupon.id)}
                      className="border-red-600 text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
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
