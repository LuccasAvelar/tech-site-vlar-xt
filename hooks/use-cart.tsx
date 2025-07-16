"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import type { CartItem, Product } from "@/types"

interface CartContextType {
  items: CartItem[]
  itemCount: number
  total: number
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on initial mount
  useEffect(() => {
    const storedCart = localStorage.getItem("techstore_cart")
    if (storedCart) {
      setItems(JSON.parse(storedCart))
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("techstore_cart", JSON.stringify(items))
  }, [items])

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        return [...prevItems, { ...product, quantity }]
      }
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.id !== productId)
      }
      return prevItems.map((item) => (item.id === productId ? { ...item, quantity: quantity } : item))
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const itemCount = useMemo(() => items.reduce((count, item) => count + item.quantity, 0), [items])
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items])

  const value = useMemo(
    () => ({
      items,
      itemCount,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [items, itemCount, total, addToCart, removeFromCart, updateQuantity, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
