"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState("")
  const { login, register, loading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let success = false
    if (isRegister) {
      success = await register(name, email, password)
    } else {
      success = await login(email, password)
    }

    if (success) {
      router.push("/") // Redirect to home on successful login/register
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Card className="w-full max-w-md bg-gray-800/50 border-gray-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {isRegister ? "Criar Conta" : "Login"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {isRegister ? "Preencha seus dados para se registrar" : "Entre na sua conta TechStore"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600"
              disabled={loading}
            >
              {loading ? (isRegister ? "Registrando..." : "Entrando...") : isRegister ? "Registrar" : "Entrar"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            {isRegister ? (
              <>
                Já tem uma conta?{" "}
                <Link href="#" onClick={() => setIsRegister(false)} className="text-cyan-400 hover:underline">
                  Faça login
                </Link>
              </>
            ) : (
              <>
                Não tem uma conta?{" "}
                <Link href="#" onClick={() => setIsRegister(true)} className="text-cyan-400 hover:underline">
                  Crie uma
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
