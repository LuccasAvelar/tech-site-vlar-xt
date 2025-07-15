import { initDatabase } from "../lib/db"

async function main() {
  console.log("🚀 Inicializando banco de dados...")

  const success = await initDatabase()

  if (success) {
    console.log("✅ Banco de dados inicializado com sucesso!")
    console.log("📧 Admin criado: admin@techstore.com / admin123")
  } else {
    console.log("❌ Falha ao inicializar banco de dados")
    process.exit(1)
  }
}

main().catch(console.error)
