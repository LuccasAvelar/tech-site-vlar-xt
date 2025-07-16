"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { User } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [form, setForm] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    password: "", // Password will not be displayed/edited directly for security
    role: "user",
    avatar: "",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/users") // Assuming /api/users route exists
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveUser = async () => {
    try {
      let response
      if (selectedUser) {
        // Update existing user
        // Note: Password update should be handled separately and securely
        const { password, ...updateData } = form // Don't send password if not explicitly changed
        response = await fetch(`/api/users/${selectedUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        })
      } else {
        // Create new user
        response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      }

      if (response.ok) {
        await fetchUsers()
        setIsDialogOpen(false)
        setSelectedUser(null)
        setForm({ name: "", email: "", password: "", role: "user", avatar: "" })
      } else {
        const errorData = await response.json()
        alert(`Erro ao salvar usuário: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Erro ao salvar usuário:", error)
      alert("Erro inesperado ao salvar usuário.")
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchUsers()
      } else {
        const errorData = await response.json()
        alert(`Erro ao excluir usuário: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error)
      alert("Erro inesperado ao excluir usuário.")
    }
  }

  const openDialogForCreate = () => {
    setSelectedUser(null)
    setForm({ name: "", email: "", password: "", role: "user", avatar: "" })
    setIsDialogOpen(true)
  }

  const openDialogForEdit = (user: User) => {
    setSelectedUser(user)
    setForm({
      name: user.name,
      email: user.email,
      password: "", // Never pre-fill password for security
      role: user.role,
      avatar: user.avatar || "",
    })
    setIsDialogOpen(true)
  }

  if (loading) {
    return <div className="text-white text-center py-8">Carregando usuários...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciamento de Usuários</h2>
        <Button onClick={openDialogForCreate} className="bg-cyan-500 hover:bg-cyan-600 text-black">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-700/70">
              <TableHead className="text-gray-300">Nome</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Função</TableHead>
              <TableHead className="text-gray-300 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-gray-700 hover:bg-gray-700/30">
                <TableCell className="font-medium text-white">{user.name}</TableCell>
                <TableCell className="text-gray-400">{user.email}</TableCell>
                <TableCell className="text-gray-300">{user.role}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openDialogForEdit(user)}>
                      <Edit className="h-4 w-4 text-blue-400" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
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
              {selectedUser ? "Editar Usuário" : "Adicionar Novo Usuário"}
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
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            {!selectedUser && ( // Only show password field for new user creation
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-300">
                Função
              </Label>
              <Select value={form.role} onValueChange={(value) => handleSelectChange("role", value)}>
                <SelectTrigger id="role" className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Selecione a Função" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar" className="text-gray-300">
                URL do Avatar (Opcional)
              </Label>
              <Input
                id="avatar"
                name="avatar"
                value={form.avatar}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-600 text-gray-300">
              Cancelar
            </Button>
            <Button onClick={handleSaveUser} className="bg-cyan-500 hover:bg-cyan-600 text-black">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
