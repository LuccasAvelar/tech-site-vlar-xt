import type { Product, User, Order, Coupon, Webhook } from "@/types"

// Mock data for development purposes
// In a real application, this would connect to a database (e.g., Supabase, Neon, MongoDB)

let mockProducts: Product[] = [
  {
    id: "prod1",
    name: "Smartphone X",
    description: "O mais novo smartphone com câmera de 108MP e tela AMOLED.",
    price: 2999.99,
    image: "/placeholder.png?height=200&width=200",
    category: "Smartphones",
    stock: 50,
  },
  {
    id: "prod2",
    name: "Notebook Gamer Pro",
    description: "Potência e desempenho para seus jogos e trabalho.",
    price: 7500.0,
    image: "/placeholder.png?height=200&width=200",
    category: "Notebooks",
    stock: 20,
  },
  {
    id: "prod3",
    name: "Smartwatch Fit",
    description: "Monitore sua saúde e receba notificações no seu pulso.",
    price: 899.5,
    image: "/placeholder.png?height=200&width=200",
    category: "Wearables",
    stock: 100,
  },
  {
    id: "prod4",
    name: "Fone de Ouvido Bluetooth",
    description: "Áudio imersivo e bateria de longa duração.",
    price: 350.0,
    image: "/placeholder.png?height=200&width=200",
    category: "Áudio",
    stock: 150,
  },
  {
    id: "prod5",
    name: "Teclado Mecânico RGB",
    description: "Experiência de digitação superior com iluminação personalizável.",
    price: 499.9,
    image: "/placeholder.png?height=200&width=200",
    category: "Periféricos",
    stock: 75,
  },
]

let mockUsers: User[] = [
  {
    id: "user1",
    name: "João Silva",
    email: "joao@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "user",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "admin1",
    name: "Admin Tech",
    email: "admin@example.com",
    password: "adminpassword", // In a real app, this would be hashed
    role: "admin",
    avatar: "/placeholder-user.jpg",
  },
]

let mockOrders: Order[] = [
  {
    id: "order1",
    userId: "user1",
    products: [{ productId: "prod1", quantity: 1, price: 2999.99 }],
    total: 2999.99,
    status: "completed",
    paymentMethod: "credit",
    installments: "3",
    address: "Rua A, 123, Cidade, Estado",
    createdAt: new Date().toISOString(),
  },
  {
    id: "order2",
    userId: "user1",
    products: [{ productId: "prod4", quantity: 2, price: 350.0 }],
    total: 700.0,
    status: "pending",
    paymentMethod: "pix",
    address: "Rua B, 456, Cidade, Estado",
    createdAt: new Date().toISOString(),
  },
]

let mockCoupons: Coupon[] = [
  {
    id: "coupon1",
    code: "DESCONTO10",
    discount: 10,
    type: "percentage",
    expiresAt: "2025-12-31T23:59:59Z",
    isActive: true,
  },
  {
    id: "coupon2",
    code: "FRETEGRATIS",
    discount: 0,
    type: "fixed", // Represents free shipping, discount amount is 0
    expiresAt: "2024-07-31T23:59:59Z",
    isActive: true,
  },
]

let mockWebhooks: Webhook[] = [
  {
    id: "webhook1",
    event: "order.created",
    url: "https://example.com/webhook-receiver",
    isActive: true,
    secret: "webhook_secret_123",
  },
]

export const db = {
  products: {
    findMany: async (): Promise<Product[]> => {
      return JSON.parse(JSON.stringify(mockProducts))
    },
    findUnique: async (id: string): Promise<Product | undefined> => {
      return JSON.parse(JSON.stringify(mockProducts.find((p) => p.id === id)))
    },
    create: async (product: Omit<Product, "id">): Promise<Product> => {
      const newProduct = { id: `prod${mockProducts.length + 1}`, ...product }
      mockProducts.push(newProduct)
      return JSON.parse(JSON.stringify(newProduct))
    },
    update: async (id: string, data: Partial<Product>): Promise<Product | undefined> => {
      const index = mockProducts.findIndex((p) => p.id === id)
      if (index > -1) {
        mockProducts[index] = { ...mockProducts[index], ...data }
        return JSON.parse(JSON.stringify(mockProducts[index]))
      }
      return undefined
    },
    delete: async (id: string): Promise<Product | undefined> => {
      const index = mockProducts.findIndex((p) => p.id === id)
      if (index > -1) {
        const [deletedProduct] = mockProducts.splice(index, 1)
        return JSON.parse(JSON.stringify(deletedProduct))
      }
      return undefined
    },
  },
  users: {
    findMany: async (): Promise<User[]> => {
      return JSON.parse(JSON.stringify(mockUsers.map(({ password, ...user }) => user))) // Exclude password
    },
    findUnique: async (id: string): Promise<User | undefined> => {
      const user = mockUsers.find((u) => u.id === id)
      return user ? JSON.parse(JSON.stringify({ password: user.password, ...user })) : undefined // Include password for internal use
    },
    findByEmail: async (email: string): Promise<User | undefined> => {
      const user = mockUsers.find((u) => u.email === email)
      return user ? JSON.parse(JSON.stringify({ password: user.password, ...user })) : undefined // Include password for internal use
    },
    create: async (user: Omit<User, "id">): Promise<User> => {
      const newUser = { id: `user${mockUsers.length + 1}`, ...user }
      mockUsers.push(newUser)
      return JSON.parse(JSON.stringify(newUser))
    },
    update: async (id: string, data: Partial<User>): Promise<User | undefined> => {
      const index = mockUsers.findIndex((u) => u.id === id)
      if (index > -1) {
        mockUsers[index] = { ...mockUsers[index], ...data }
        return JSON.parse(JSON.stringify(mockUsers[index]))
      }
      return undefined
    },
    delete: async (id: string): Promise<User | undefined> => {
      const index = mockUsers.findIndex((u) => u.id === id)
      if (index > -1) {
        const [deletedUser] = mockUsers.splice(index, 1)
        return JSON.parse(JSON.stringify(deletedUser))
      }
      return undefined
    },
  },
  orders: {
    findMany: async (): Promise<Order[]> => {
      return JSON.parse(JSON.stringify(mockOrders))
    },
    findUnique: async (id: string): Promise<Order | undefined> => {
      return JSON.parse(JSON.stringify(mockOrders.find((o) => o.id === id)))
    },
    create: async (order: Omit<Order, "id" | "createdAt">): Promise<Order> => {
      const newOrder = { id: `order${mockOrders.length + 1}`, createdAt: new Date().toISOString(), ...order }
      mockOrders.push(newOrder)
      return JSON.parse(JSON.stringify(newOrder))
    },
    update: async (id: string, data: Partial<Order>): Promise<Order | undefined> => {
      const index = mockOrders.findIndex((o) => o.id === id)
      if (index > -1) {
        mockOrders[index] = { ...mockOrders[index], ...data }
        return JSON.parse(JSON.stringify(mockOrders[index]))
      }
      return undefined
    },
    delete: async (id: string): Promise<Order | undefined> => {
      const index = mockOrders.findIndex((o) => o.id === id)
      if (index > -1) {
        const [deletedOrder] = mockOrders.splice(index, 1)
        return JSON.parse(JSON.stringify(deletedOrder))
      }
      return undefined
    },
  },
  coupons: {
    findMany: async (): Promise<Coupon[]> => {
      return JSON.parse(JSON.stringify(mockCoupons))
    },
    findUnique: async (id: string): Promise<Coupon | undefined> => {
      return JSON.parse(JSON.stringify(mockCoupons.find((c) => c.id === id)))
    },
    findByCode: async (code: string): Promise<Coupon | undefined> => {
      return JSON.parse(JSON.stringify(mockCoupons.find((c) => c.code === code)))
    },
    create: async (coupon: Omit<Coupon, "id">): Promise<Coupon> => {
      const newCoupon = { id: `coupon${mockCoupons.length + 1}`, ...coupon }
      mockCoupons.push(newCoupon)
      return JSON.parse(JSON.stringify(newCoupon))
    },
    update: async (id: string, data: Partial<Coupon>): Promise<Coupon | undefined> => {
      const index = mockCoupons.findIndex((c) => c.id === id)
      if (index > -1) {
        mockCoupons[index] = { ...mockCoupons[index], ...data }
        return JSON.parse(JSON.stringify(mockCoupons[index]))
      }
      return undefined
    },
    delete: async (id: string): Promise<Coupon | undefined> => {
      const index = mockCoupons.findIndex((c) => c.id === id)
      if (index > -1) {
        const [deletedCoupon] = mockCoupons.splice(index, 1)
        return JSON.parse(JSON.stringify(deletedCoupon))
      }
      return undefined
    },
  },
  webhooks: {
    findMany: async (): Promise<Webhook[]> => {
      return JSON.parse(JSON.stringify(mockWebhooks))
    },
    findUnique: async (id: string): Promise<Webhook | undefined> => {
      return JSON.parse(JSON.stringify(mockWebhooks.find((w) => w.id === id)))
    },
    create: async (webhook: Omit<Webhook, "id">): Promise<Webhook> => {
      const newWebhook = { id: `webhook${mockWebhooks.length + 1}`, ...webhook }
      mockWebhooks.push(newWebhook)
      return JSON.parse(JSON.stringify(newWebhook))
    },
    update: async (id: string, data: Partial<Webhook>): Promise<Webhook | undefined> => {
      const index = mockWebhooks.findIndex((w) => w.id === id)
      if (index > -1) {
        mockWebhooks[index] = { ...mockWebhooks[index], ...data }
        return JSON.parse(JSON.stringify(mockWebhooks[index]))
      }
      return undefined
    },
    delete: async (id: string): Promise<Webhook | undefined> => {
      const index = mockWebhooks.findIndex((w) => w.id === id)
      if (index > -1) {
        const [deletedWebhook] = mockWebhooks.splice(index, 1)
        return JSON.parse(JSON.stringify(deletedWebhook))
      }
      return undefined
    },
  },
}

// Function to reset mock data (useful for testing or re-initialization)
export const resetMockDb = () => {
  mockProducts = [
    {
      id: "prod1",
      name: "Smartphone X",
      description: "O mais novo smartphone com câmera de 108MP e tela AMOLED.",
      price: 2999.99,
      image: "/placeholder.png?height=200&width=200",
      category: "Smartphones",
      stock: 50,
    },
    {
      id: "prod2",
      name: "Notebook Gamer Pro",
      description: "Potência e desempenho para seus jogos e trabalho.",
      price: 7500.0,
      image: "/placeholder.png?height=200&width=200",
      category: "Notebooks",
      stock: 20,
    },
    {
      id: "prod3",
      name: "Smartwatch Fit",
      description: "Monitore sua saúde e receba notificações no seu pulso.",
      price: 899.5,
      image: "/placeholder.png?height=200&width=200",
      category: "Wearables",
      stock: 100,
    },
    {
      id: "prod4",
      name: "Fone de Ouvido Bluetooth",
      description: "Áudio imersivo e bateria de longa duração.",
      price: 350.0,
      image: "/placeholder.png?height=200&width=200",
      category: "Áudio",
      stock: 150,
    },
    {
      id: "prod5",
      name: "Teclado Mecânico RGB",
      description: "Experiência de digitação superior com iluminação personalizável.",
      price: 499.9,
      image: "/placeholder.png?height=200&width=200",
      category: "Periféricos",
      stock: 75,
    },
  ]

  mockUsers = [
    {
      id: "user1",
      name: "João Silva",
      email: "joao@example.com",
      password: "password123",
      role: "user",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "admin1",
      name: "Admin Tech",
      email: "admin@example.com",
      password: "adminpassword",
      role: "admin",
      avatar: "/placeholder-user.jpg",
    },
  ]

  mockOrders = [
    {
      id: "order1",
      userId: "user1",
      products: [{ productId: "prod1", quantity: 1, price: 2999.99 }],
      total: 2999.99,
      status: "completed",
      paymentMethod: "credit",
      installments: "3",
      address: "Rua A, 123, Cidade, Estado",
      createdAt: new Date().toISOString(),
    },
    {
      id: "order2",
      userId: "user1",
      products: [{ productId: "prod4", quantity: 2, price: 350.0 }],
      total: 700.0,
      status: "pending",
      paymentMethod: "pix",
      address: "Rua B, 456, Cidade, Estado",
      createdAt: new Date().toISOString(),
    },
  ]

  mockCoupons = [
    {
      id: "coupon1",
      code: "DESCONTO10",
      discount: 10,
      type: "percentage",
      expiresAt: "2025-12-31T23:59:59Z",
      isActive: true,
    },
    {
      id: "coupon2",
      code: "FRETEGRATIS",
      discount: 0,
      type: "fixed",
      expiresAt: "2024-07-31T23:59:59Z",
      isActive: true,
    },
  ]

  mockWebhooks = [
    {
      id: "webhook1",
      event: "order.created",
      url: "https://example.com/webhook-receiver",
      isActive: true,
      secret: "webhook_secret_123",
    },
  ]
}
