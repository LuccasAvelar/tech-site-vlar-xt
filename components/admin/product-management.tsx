"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
    stock: 0,
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSaveProduct = async () => {
    try {
      let response
      if (selectedProduct) {
        // Update existing product
        response = await fetch(`/api/products/${selectedProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      } else {
        // Create new product
        response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      }

      if (response.ok) {
        await fetchProducts()
        setIsDialogOpen(false)
        setSelectedProduct(null)
        setForm({ name: "", description: "", price: 0, image: "", category: "", stock: 0 })
      } else {
        const errorData = await response.json()
        alert(`Erro ao salvar produto: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      alert("Erro inesperado ao salvar produto.")
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchProducts()
      } else {
        const errorData = await response.json()
        alert(`Erro ao excluir produto: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Erro ao excluir produto:", error)
      alert("Erro inesperado ao excluir produto.")
    }
  }

  const openDialogForCreate = () => {
    setSelectedProduct(null)
    setForm({ name: "", description: "", price: 0, image: "", category: "", stock: 0 })
    setIsDialogOpen(true)
  }

  const openDialogForEdit = (product: Product) => {
    setSelectedProduct(product)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
    })
    setIsDialogOpen(true)
  }

  if (loading) {
    return <div className="text-white text-center py-8">Carregando produtos...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciamento de Produtos</h2>
        <Button onClick={openDialogForCreate} className="bg-cyan-500 hover:bg-cyan-600 text-black">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </Button>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-700/70">
              <TableHead className="text-gray-300">Nome</TableHead>
              <TableHead className="text-gray-300">Categoria</TableHead>
              <TableHead className="text-gray-300">Preço</TableHead>
              <TableHead className="text-gray-300">Estoque</TableHead>
              <TableHead className="text-gray-300 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-gray-700 hover:bg-gray-700/30">
                <TableCell className="font-medium text-white">{product.name}</TableCell>
                <TableCell className="text-gray-400">{product.category}</TableCell>
                <TableCell className="text-cyan-400">{formatPrice(product.price)}</TableCell>
                <TableCell className="text-gray-300">{product.stock}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openDialogForEdit(product)}>
                      <Edit className="h-4 w-4 text-blue-400" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
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
            <DialogTitle className="text-white">
              {selectedProduct ? "Editar Produto" : "Adicionar Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Nome
              </Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">
                Descrição
              </Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-300">
                  Preço
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-gray-300">
                  Estoque
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image" className="text-gray-300">
                URL da Imagem
              </Label>
              <Input
                id="image"
                name="image"
                value={form.image}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-300">
                Categoria
              </Label>
              <Input
                id="category"
                name="category"
                value={form.category}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-600 text-gray-300">
              Cancelar
            </Button>
            <Button onClick={handleSaveProduct} className="bg-cyan-500 hover:bg-cyan-600 text-black">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
