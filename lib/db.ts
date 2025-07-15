import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined")
}

const sql = neon(process.env.DATABASE_URL)

export { sql }

// Função para inicializar o banco
export async function initDatabase() {
  try {
    // Criar tabela de usuários
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        birth_date DATE,
        avatar TEXT,
        is_admin BOOLEAN DEFAULT FALSE,
        needs_password_change BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Criar tabela de produtos
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image TEXT,
        category VARCHAR(100),
        stock INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Criar tabela de pedidos
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50),
        installments INTEGER DEFAULT 1,
        address TEXT,
        coupon_code VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Criar tabela de itens do pedido
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Criar tabela de cupons
    await sql`
      CREATE TABLE IF NOT EXISTS coupons (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount DECIMAL(5,2) NOT NULL,
        type VARCHAR(20) DEFAULT 'percentage',
        is_active BOOLEAN DEFAULT TRUE,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Inserir usuário admin padrão se não existir
    const adminExists = await sql`
      SELECT id FROM users WHERE email = 'admin@techstore.com'
    `

    if (adminExists.length === 0) {
      const bcrypt = await import("bcryptjs")
      const hashedPassword = await bcrypt.hash("admin123", 10)

      await sql`
        INSERT INTO users (name, email, password, phone, birth_date, is_admin)
        VALUES (
          'Administrador',
          'admin@techstore.com',
          ${hashedPassword},
          '(11) 99999-9999',
          '1990-01-01',
          TRUE
        )
      `
    }

    // Inserir produtos de exemplo se não existirem
    const productsExist = await sql`SELECT id FROM products LIMIT 1`

    if (productsExist.length === 0) {
      const sampleProducts = [
        {
          name: "SSD NVMe 1TB Samsung 980 PRO",
          description:
            "SSD de alta performance com velocidades de leitura de até 7.000 MB/s. Ideal para gaming e aplicações profissionais.",
          price: 599.99,
          category: "storage",
          stock: 15,
          image: "/placeholder.svg?height=300&width=300",
        },
        {
          name: "Placa de Vídeo RTX 4070 Ti",
          description: "Placa de vídeo de última geração com Ray Tracing e DLSS 3.0. Perfeita para jogos em 4K.",
          price: 3299.99,
          category: "gpu",
          stock: 8,
          image: "/placeholder.svg?height=300&width=300",
        },
        {
          name: "Processador Intel Core i7-13700K",
          description: "Processador de 13ª geração com 16 núcleos e 24 threads. Excelente para gaming e produtividade.",
          price: 1899.99,
          category: "cpu",
          stock: 12,
          image: "/placeholder.svg?height=300&width=300",
        },
        {
          name: "Memória RAM DDR5 32GB (2x16GB)",
          description: "Kit de memória DDR5 de alta velocidade, 5600MHz. Ideal para sistemas de alta performance.",
          price: 899.99,
          category: "memory",
          stock: 20,
          image: "/placeholder.svg?height=300&width=300",
        },
        {
          name: 'Monitor Gamer 27" 144Hz',
          description:
            "Monitor curvo com taxa de atualização de 144Hz e tempo de resposta de 1ms. Perfeito para e-sports.",
          price: 1299.99,
          category: "monitor",
          stock: 6,
          image: "/placeholder.svg?height=300&width=300",
        },
        {
          name: "Teclado Mecânico RGB",
          description: "Teclado mecânico com switches Cherry MX e iluminação RGB personalizável.",
          price: 399.99,
          category: "peripherals",
          stock: 25,
          image: "/placeholder.svg?height=300&width=300",
        },
      ]

      for (const product of sampleProducts) {
        await sql`
          INSERT INTO products (name, description, price, category, stock, image)
          VALUES (${product.name}, ${product.description}, ${product.price}, ${product.category}, ${product.stock}, ${product.image})
        `
      }
    }

    console.log("✅ Banco de dados inicializado com sucesso!")
    return true
  } catch (error) {
    console.error("❌ Erro ao inicializar banco:", error)
    return false
  }
}
