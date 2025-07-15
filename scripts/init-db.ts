import { sql } from "../lib/db"

async function initDatabase() {
  try {
    console.log("🚀 Iniciando configuração do banco de dados...")

    // Criar tabela de produtos
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        stock INTEGER DEFAULT 0,
        image TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Criar tabela de pedidos
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        products JSONB NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        installments VARCHAR(10) DEFAULT '1x',
        address TEXT NOT NULL,
        coupon_code VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    console.log("✅ Tabelas criadas com sucesso!")

    // Verificar se já existem produtos
    const existingProducts = await sql`SELECT COUNT(*) as count FROM products`
    const productCount = Number.parseInt(existingProducts[0].count)

    if (productCount === 0) {
      console.log("📦 Inserindo produtos de exemplo...")

      const sampleProducts = [
        {
          name: "Smartphone Galaxy Pro",
          description:
            "Smartphone de última geração com câmera de 108MP, 256GB de armazenamento e tela AMOLED de 6.7 polegadas.",
          price: 2499.99,
          category: "Smartphones",
          stock: 15,
          image: "/placeholder.svg?height=300&width=300",
        },
        {
          name: "Notebook Gamer Ultra",
          description: "Notebook gamer com processador Intel i7, 16GB RAM, SSD 512GB e placa de vídeo RTX 4060.",
          price: 4999.99,
          category: "Notebooks",
          stock: 8,
          image: "/placeholder.svg?height=300&width=300",
        },
        {
          name: "Fone Bluetooth Premium",
          description: "Fone de ouvido sem fio com cancelamento de ruído ativo, bateria de 30h e qualidade Hi-Fi.",
          price: 599.99,
          category: "Áudio",
          stock: 25,
          image: "/placeholder.svg?height=300&width=300",
        },
        {
          name: 'Smart TV 4K 55"',
          description: "Smart TV LED 4K de 55 polegadas com Android TV, HDR10+ e som Dolby Atmos.",
          price: 2199.99,
          category: "TVs",
          stock: 12,
          image: "/placeholder.svg?height=300&width=300",
        },
        {
          name: "Console Next-Gen",
          description: "Console de videogame de nova geração com SSD ultra-rápido e suporte a 4K/120fps.",
          price: 3499.99,
          category: "Games",
          stock: 6,
          image: "/placeholder.svg?height=300&width=300",
        },
        {
          name: 'Tablet Pro 12"',
          description: "Tablet profissional com tela de 12 polegadas, processador M2 e suporte à Apple Pencil.",
          price: 1899.99,
          category: "Tablets",
          stock: 10,
          image: "/placeholder.svg?height=300&width=300",
        },
      ]

      for (const product of sampleProducts) {
        await sql`
          INSERT INTO products (name, description, price, category, stock, image, is_active)
          VALUES (${product.name}, ${product.description}, ${product.price}, ${product.category}, ${product.stock}, ${product.image}, true)
        `
      }

      console.log("✅ Produtos de exemplo inseridos!")
    } else {
      console.log(`ℹ️  Já existem ${productCount} produtos no banco de dados.`)
    }

    console.log("🎉 Configuração do banco de dados concluída!")
    console.log("\n📋 Próximos passos:")
    console.log("1. Configure as variáveis de ambiente no arquivo .env")
    console.log("2. Execute 'npm run dev' para iniciar o servidor")
    console.log("3. Acesse /login com as credenciais do .env")
    console.log("4. Gerencie produtos em /admin")
  } catch (error) {
    console.error("❌ Erro ao configurar banco de dados:", error)
    process.exit(1)
  }
}

initDatabase()
