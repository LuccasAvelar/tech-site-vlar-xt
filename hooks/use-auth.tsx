"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { User } from "@/types"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData: User = await response.json()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Failed to fetch user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const userData: User = await response.json()
        setUser(userData)
        router.push("/") // Redirect to home or dashboard
        return true
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Login failed")
        setUser(null)
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("An unexpected error occurred during login.")
      setUser(null)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        const userData: User = await response.json()
        setUser(userData)
        router.push("/") // Redirect to home or dashboard
        return true
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Registration failed")
        setUser(null)
        return false
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert("An unexpected error occurred during registration.")
      setUser(null)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      if (response.ok) {
        setUser(null)
        router.push("/login") // Redirect to login page
      } else {
        alert("Logout failed")
      }
    } catch (error) {
      console.error("Logout error:", error)
      alert("An unexpected error occurred during logout.")
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
