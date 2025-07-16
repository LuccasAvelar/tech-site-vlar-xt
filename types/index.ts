export type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
}

export type User = {
  id: string
  name: string
  email: string
  password?: string // Optional for client-side, never send to client
  role: "user" | "admin"
  avatar?: string
}

export type CartItem = Product & {
  quantity: number
}

export type Order = {
  id: string
  userId: string
  products: { productId: string; quantity: number; price: number }[]
  total: number
  status: "pending" | "completed" | "cancelled"
  paymentMethod: string
  installments?: string
  address: string
  couponCode?: string
  createdAt: string
}

export type Coupon = {
  id: string
  code: string
  discount: number // percentage or fixed amount
  type: "percentage" | "fixed"
  expiresAt: string
  isActive: boolean
}

export type Webhook = {
  id: string
  event: string // e.g., 'order.created', 'product.updated'
  url: string
  isActive: boolean
  secret?: string
}
