"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { UserCheck, UserX, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface User {
  id: string
  name: string
  email: string
  phone: string
  birth_date: string
  is_admin: boolean
  created_at: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // Por enquanto, vamos simular dados
      setUsers([
        {
          id: "1",
          name: "Administrador",
          email: "luccasavelar@gmail.com",
          phone: "(11) 99999-9999",
          birth_date: "1990-01-01",
          is_admin: true,
          created_at: new Date().toISOString(),
        },
      ])
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciar Usuários</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-lg">{user.name}</CardTitle>
                  {user.is_admin && (
                    <Badge className="bg-cyan-400 text-black">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-300">{user.email}</p>
                  <p className="text-gray-400 text-sm">{user.phone}</p>
                  <p className="text-gray-400 text-sm">Cadastrado em: {formatDate(new Date(user.created_at))}</p>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button size="sm" variant="outline" className="border-green-600 text-green-400">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Ativar
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                    <UserX className="h-4 w-4 mr-2" />
                    Desativar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
