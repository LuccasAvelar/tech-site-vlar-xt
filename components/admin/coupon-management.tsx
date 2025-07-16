"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Coupon } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { formatPrice } from "@/lib/utils"

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [form, setForm] = useState<Omit<Coupon, "id">>({
    code: "",
    discount: 0,
    type: "percentage",
    expiresAt: "",
    isActive: true,
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/coupons") // Assuming /api/coupons route exists
      const data = await response.json()
      setCoupons(data)
    } catch (error) {
      console.error("Erro ao carregar cupons:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "discount" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveCoupon = async () => {
    try {
      let response
      const payload = {
        ...form,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      }

      if (selectedCoupon) {
        response = await fetch(`/api/coupons/${selectedCoupon.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch("/api/coupons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      if (response.ok) {
        await fetchCoupons()
        setIsDialogOpen(false)
        setSelectedCoupon(null)
        setForm({ code: "", discount: 0, type: "percentage", expiresAt: "", isActive: true })
      } else {
        const errorData = await response.json()
        alert(`Erro ao salvar cupom: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Erro ao salvar cupom:", error)
      alert("Erro inesperado ao salvar cupom.")
    }
  }

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cupom?")) return

    try {
      const response = await fetch(`/api/coupons/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchCoupons()
      } else {
        const errorData = await response.json()
        alert(`Erro ao excluir cupom: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Erro ao excluir cupom:", error)
      alert("Erro inesperado ao excluir cupom.")
    }
  }

  const openDialogForCreate = () => {
    setSelectedCoupon(null)
    setForm({ code: "", discount: 0, type: "percentage", expiresAt: "", isActive: true })
    setIsDialogOpen(true)
  }

  const openDialogForEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setForm({
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type,
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split("T")[0] : "", // Format for input type="date"
      isActive: coupon.isActive,
    })
    setIsDialogOpen(true)
  }

  if (loading) {
    return <div className="text-white text-center py-8">Carregando cupons...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciamento de Cupons</h2>
        <Button onClick={openDialogForCreate} className="bg-cyan-500 hover:bg-cyan-600 text-black">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Cupom
        </Button>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-700/70">
              <TableHead className="text-gray-300">Código</TableHead>
              <TableHead className="text-gray-300">Desconto</TableHead>
              <TableHead className="text-gray-300">Tipo</TableHead>
              <TableHead className="text-gray-300">Expira Em</TableHead>
              <TableHead className="text-gray-300">Ativo</TableHead>
              <TableHead className="text-gray-300 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id} className="border-gray-700 hover:bg-gray-700/30">
                <TableCell className="font-medium text-white">{coupon.code}</TableCell>
                <TableCell className="text-cyan-400">
                  {coupon.type === "percentage" ? `${coupon.discount}%` : formatPrice(coupon.discount)}
                </TableCell>
                <TableCell className="text-gray-400">{coupon.type}</TableCell>
                <TableCell className="text-gray-400">
                  {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Nunca"}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${coupon.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                  >
                    {coupon.isActive ? "Sim" : "Não"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openDialogForEdit(coupon)}>
                      <Edit className="h-4 w-4 text-blue-400" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCoupon(coupon.id)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedCoupon ? "Editar Cupom" : "Adicionar Novo Cupom"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-gray-300">
                Código
              </Label>
              <Input
                id="code"
                name="code"
                value={form.code}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount" className="text-gray-300">
                Desconto
              </Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                step="0.01"
                value={form.discount}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-gray-300">
                Tipo
              </Label>
              <Select value={form.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger id="type" className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Selecione o Tipo" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="percentage">Porcentagem</SelectItem>
                  <SelectItem value="fixed">Valor Fixo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt" className="text-gray-300">
                Expira Em
              </Label>
              <Input
                id="expiresAt"
                name="expiresAt"
                type="date"
                value={form.expiresAt}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                name="isActive"
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked as boolean }))}
              />
              <Label htmlFor="isActive" className="text-gray-300">
                Ativo
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-600 text-gray-300">
              Cancelar
            </Button>
            <Button onClick={handleSaveCoupon} className="bg-cyan-500 hover:bg-cyan-600 text-black">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
