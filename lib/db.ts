export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
  active: boolean
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  createdAt: string
}

// Mock data
const products: Product[] = [
  {
    id: "1",
    name: "Smartphone Galaxy Pro",
    price: 1299.99,
    description: "Smartphone premium com câmera de 108MP",
    image: "/placeholder.svg?height=300&width=300",
    category: "Smartphones",
    stock: 50,
    active: true,
  },
  {
    id: "2",
    name: "Notebook Gaming Ultra",
    price: 2499.99,
    description: "Notebook gamer com RTX 4060 e 16GB RAM",
    image: "/placeholder.svg?height=300&width=300",
    category: "Notebooks",
    stock: 25,
    active: true,
  },
  {
    id: "3",
    name: "Fone Bluetooth Premium",
    price: 299.99,
    description: "Fone com cancelamento de ruído ativo",
    image: "/placeholder.svg?height=300&width=300",
    category: "Acessórios",
    stock: 100,
    active: true,
  },
]

const orders: Order[] = [
  {
    id: "1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    total: 1299.99,
    status: "completed",
    items: [
      {
        productId: "1",
        productName: "Smartphone Galaxy Pro",
        quantity: 1,
        price: 1299.99,
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    customerName: "Maria Santos",
    customerEmail: "maria@email.com",
    total: 2799.98,
    status: "processing",
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
    createdAt: new Date().toISOString(),
  },
]

// Database functions
export const db = {
  products: {
    findMany: async (): Promise<Product[]> => {
      return products
    },
    findById: async (id: string): Promise<Product | null> => {
      return products.find((p) => p.id === id) || null
    },
    create: async (data: Omit<Product, "id">): Promise<Product> => {
      const newProduct: Product = {
        ...data,
        id: Date.now().toString(),
      }
      products.push(newProduct)
      return newProduct
    },
    update: async (id: string, data: Partial<Product>): Promise<Product | null> => {
      const index = products.findIndex((p) => p.id === id)
      if (index === -1) return null

      products[index] = { ...products[index], ...data }
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
      return orders
    },
    findById: async (id: string): Promise<Order | null> => {
      return orders.find((o) => o.id === id) || null
    },
  },
}
