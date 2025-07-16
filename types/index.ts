export interface Product {
  id: string
  name: string
  description: string
  price: number
  image?: string
  category: string
  stock: number
  isActive?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  birthDate: string
  avatar?: string
  isAdmin: boolean
  needsPasswordChange?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem extends Product {
  quantity: number
}

export interface Order {
  id: string
  userId: string
  products: CartItem[]
  total: number
  paymentMethod: string
  installments: string
  address: string
  couponCode?: string
  status: "pending" | "confirmed" | "delivered" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface Coupon {
  id: string
  code: string
  discount: number
  type: "percentage" | "fixed"
  isActive: boolean
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface WebhookConfig {
  id: string
  url: string
  events: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
