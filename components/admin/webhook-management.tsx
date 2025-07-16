"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Webhook } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function WebhookManagement() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [form, setForm] = useState<Omit<Webhook, "id">>({
    event: "",
    url: "",
    isActive: true,
    secret: "",
  })

  useEffect(() => {
    fetchWebhooks()
  }, [])

  const fetchWebhooks = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/webhooks") // Assuming /api/webhooks route exists
      const data = await response.json()
      setWebhooks(data)
    } catch (error) {
      console.error("Erro ao carregar webhooks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveWebhook = async () => {
    try {
      let response
      if (selectedWebhook) {
        response = await fetch(`/api/webhooks/${selectedWebhook.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      } else {
        response = await fetch("/api/webhooks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      }

      if (response.ok) {
        await fetchWebhooks()
        setIsDialogOpen(false)
        setSelectedWebhook(null)
        setForm({ event: "", url: "", isActive: true, secret: "" })
      } else {
        const errorData = await response.json()
        alert(`Erro ao salvar webhook: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Erro ao salvar webhook:", error)
      alert("Erro inesperado ao salvar webhook.")
    }
  }

  const handleDeleteWebhook = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este webhook?")) return

    try {
      const response = await fetch(`/api/webhooks/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchWebhooks()
      } else {
        const errorData = await response.json()
        alert(`Erro ao excluir webhook: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Erro ao excluir webhook:", error)
      alert("Erro inesperado ao excluir webhook.")
    }
  }

  const openDialogForCreate = () => {
    setSelectedWebhook(null)
    setForm({ event: "", url: "", isActive: true, secret: "" })
    setIsDialogOpen(true)
  }

  const openDialogForEdit = (webhook: Webhook) => {
    setSelectedWebhook(webhook)
    setForm({
      event: webhook.event,
      url: webhook.url,
      isActive: webhook.isActive,
      secret: webhook.secret || "", // Don't expose real secret if it's sensitive
    })
    setIsDialogOpen(true)
  }

  if (loading) {
    return <div className="text-white text-center py-8">Carregando webhooks...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciamento de Webhooks</h2>
        <Button onClick={openDialogForCreate} className="bg-cyan-500 hover:bg-cyan-600 text-black">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Webhook
        </Button>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-700/70">
              <TableHead className="text-gray-300">Evento</TableHead>
              <TableHead className="text-gray-300">URL</TableHead>
              <TableHead className="text-gray-300">Ativo</TableHead>
              <TableHead className="text-gray-300 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooks.map((webhook) => (
              <TableRow key={webhook.id} className="border-gray-700 hover:bg-gray-700/30">
                <TableCell className="font-medium text-white">{webhook.event}</TableCell>
                <TableCell className="text-gray-400">{webhook.url}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${webhook.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                  >
                    {webhook.isActive ? "Sim" : "Não"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openDialogForEdit(webhook)}>
                      <Edit className="h-4 w-4 text-blue-400" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteWebhook(webhook.id)}>
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
              {selectedWebhook ? "Editar Webhook" : "Adicionar Novo Webhook"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event" className="text-gray-300">
                Evento
              </Label>
              <Select value={form.event} onValueChange={(value) => handleSelectChange("event", value)}>
                <SelectTrigger id="event" className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Selecione o Evento" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="order.created">Pedido Criado</SelectItem>
                  <SelectItem value="product.updated">Produto Atualizado</SelectItem>
                  <SelectItem value="user.registered">Usuário Registrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url" className="text-gray-300">
                URL
              </Label>
              <Input
                id="url"
                name="url"
                type="url"
                value={form.url}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secret" className="text-gray-300">
                Segredo (Opcional)
              </Label>
              <Input
                id="secret"
                name="secret"
                type="text"
                value={form.secret}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Chave secreta para verificação"
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
            <Button onClick={handleSaveWebhook} className="bg-cyan-500 hover:bg-cyan-600 text-black">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
