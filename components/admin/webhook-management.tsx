"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Webhook, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface WebhookConfig {
  id: string
  url: string
  events: string[]
  isActive: boolean
}

const availableEvents = [
  { id: "new_order", label: "Novo Pedido", description: "Disparado quando um pedido é criado" },
  { id: "new_user", label: "Novo Cadastro", description: "Disparado quando um usuário se cadastra" },
  { id: "birthday", label: "Aniversariantes", description: "Disparado diariamente com aniversariantes" },
  { id: "abandoned_cart", label: "Carrinho Abandonado", description: "Disparado após 5 dias sem compra" },
]

export default function WebhookManagement() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    url: "",
    events: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newWebhook: WebhookConfig = {
      id: Date.now().toString(),
      url: formData.url,
      events: formData.events,
      isActive: true,
    }

    setWebhooks([...webhooks, newWebhook])
    setIsDialogOpen(false)
    setFormData({
      url: "",
      events: [],
    })
  }

  const handleEventChange = (eventId: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, events: [...formData.events, eventId] })
    } else {
      setFormData({ ...formData, events: formData.events.filter((e) => e !== eventId) })
    }
  }

  const handleDelete = (webhookId: string) => {
    setWebhooks(webhooks.filter((w) => w.id !== webhookId))
  }

  const toggleActive = (webhookId: string) => {
    setWebhooks(webhooks.map((w) => (w.id === webhookId ? { ...w, isActive: !w.isActive } : w)))
  }

  const getEventLabel = (eventId: string) => {
    return availableEvents.find((e) => e.id === eventId)?.label || eventId
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Automações (Webhooks)</h2>
          <p className="text-gray-400 text-sm">Configure URLs para receber notificações automáticas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Nova Automação
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Configurar Nova Automação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL do Webhook</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                  placeholder="https://seu-site.com/webhook"
                  required
                />
                <p className="text-gray-400 text-xs">URL que receberá as notificações automáticas</p>
              </div>

              <div className="space-y-3">
                <Label>Eventos para Monitorar</Label>
                {availableEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded">
                    <Checkbox
                      id={event.id}
                      checked={formData.events.includes(event.id)}
                      onCheckedChange={(checked) => handleEventChange(event.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={event.id} className="text-white font-medium">
                        {event.label}
                      </Label>
                      <p className="text-gray-400 text-sm">{event.description}</p>
                    </div>
                  </div>
                ))}
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
                  disabled={formData.events.length === 0}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600"
                >
                  Criar Automação
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {webhooks.length === 0 ? (
        <div className="text-center py-12">
          <Webhook className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-4">Nenhuma automação configurada</h3>
          <p className="text-gray-400">Configure webhooks para receber notificações automáticas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook, index) => (
            <motion.div
              key={webhook.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg flex items-center">
                        <Webhook className="h-5 w-5 mr-2" />
                        Automação #{webhook.id}
                      </CardTitle>
                      <p className="text-gray-400 text-sm break-all">{webhook.url}</p>
                    </div>
                    <Badge variant={webhook.isActive ? "default" : "secondary"} className="flex items-center">
                      {webhook.isActive ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {webhook.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-white font-medium mb-2">Eventos Monitorados:</h4>
                      <div className="flex flex-wrap gap-2">
                        {webhook.events.map((eventId) => (
                          <Badge key={eventId} variant="outline" className="border-cyan-400 text-cyan-400">
                            {getEventLabel(eventId)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActive(webhook.id)}
                        className="border-gray-600"
                      >
                        {webhook.isActive ? "Desativar" : "Ativar"}
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(webhook.id)}
                        className="border-red-600 text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    </div>
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
