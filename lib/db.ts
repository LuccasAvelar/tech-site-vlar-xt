export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  paymentMethod: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  createdAt: string
  updatedAt: string
}

// Mock data storage
const products: Product[] = [
  {
    id: "1",
    name: "Smartphone Galaxy Pro",
    price: 1299.99,
    description: "Smartphone premium com câmera de 108MP e 256GB de armazenamento",
    image: "/placeholder.svg?height=300&width=300",
    category: "Smartphones",
    stock: 50,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Notebook Gaming Ultra",
    price: 2499.99,
    description: "Notebook gamer com RTX 4060, Intel i7 e 16GB RAM",
    image: "/placeholder.svg?height=300&width=300",
    category: "Notebooks",
    stock: 25,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Fone Bluetooth Premium",
    price: 299.99,
    description: "Fone com cancelamento de ruído ativo e bateria de 30h",
    image: "/placeholder.svg?height=300&width=300",
    category: "Acessórios",
    stock: 100,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Smart TV 55 4K",
    price: 1899.99,
    description: "Smart TV 55 polegadas 4K com HDR e sistema Android TV",
    image: "/placeholder.svg?height=300&width=300",
    category: "TVs",
    stock: 15,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Console PlayStation 5",
    price: 3999.99,
    description: "Console de última geração com SSD ultra-rápido",
    image: "/placeholder.svg?height=300&width=300",
    category: "Games",
    stock: 8,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const orders: Order[] = [
  {
    id: "1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    total: 1299.99,
    status: "completed",
    paymentMethod: "Cartão de Crédito",
    items: [
      {
        productId: "1",
        productName: "Smartphone Galaxy Pro",
        quantity: 1,
        price: 1299.99,
      },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2",
    customerName: "Maria Santos",
    customerEmail: "maria@email.com",
    total: 2799.98,
    status: "processing",
    paymentMethod: "PIX",
    items: [
      {
        productId: "2",
        productName: "Notebook Gaming Ultra",
        quantity: 1,
        price: 2499.99,
      },
      {
        productId: "3",
        productName: "Fone Bluetooth Premium",
        quantity: 1,
        price: 299.99,
      },
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    customerName: "Pedro Costa",
    customerEmail: "pedro@email.com",
    total: 1899.99,
    status: "pending",
    paymentMethod: "Boleto",
    items: [
      {
        productId: "4",
        productName: "Smart TV 55 4K",
        quantity: 1,
        price: 1899.99,
      },
    ],
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
]

// Database functions
export const db = {
  products: {
    findMany: async (): Promise<Product[]> => {
      return [...products]
    },
    findById: async (id: string): Promise<Product | null> => {
      return products.find((p) => p.id === id) || null
    },
    create: async (data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> => {
      const newProduct: Product = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      products.push(newProduct)
      return newProduct
    },
    update: async (id: string, data: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product | null> => {
      const index = products.findIndex((p) => p.id === id)
      if (index === -1) return null

      products[index] = {
        ...products[index],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      return products[index]
    },
    delete: async (id: string): Promise<boolean> => {
      const index = products.findIndex((p) => p.id === id)
      if (index === -1) return false

      products.splice(index, 1)
      return true
    },
  },
  orders: {
    findMany: async (): Promise<Order[]> => {
      return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },
    findById: async (id: string): Promise<Order | null> => {
      return orders.find((o) => o.id === id) || null
    },
    updateStatus: async (id: string, status: Order["status"]): Promise<Order | null> => {
      const index = orders.findIndex((o) => o.id === id)
      if (index === -1) return null

      orders[index] = {
        ...orders[index],
        status,
        updatedAt: new Date().toISOString(),
      }
      return orders[index]
    },
  },
}
