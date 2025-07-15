# TechStore - E-commerce Admin

Sistema de e-commerce com painel administrativo desenvolvido em Next.js 14, TypeScript e Tailwind CSS.

## 🚀 Características

- ✅ **Autenticação Simples**: Sistema de login baseado em variáveis de ambiente (sem JWT)
- ✅ **Painel Admin**: Gerenciamento completo de produtos e pedidos
- ✅ **Design Responsivo**: Interface moderna e futurista
- ✅ **Banco PostgreSQL**: Integração com Neon Database
- ✅ **TypeScript**: Tipagem completa para maior segurança
- ✅ **Tailwind CSS**: Estilização moderna e responsiva

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Framer Motion
- **Database**: PostgreSQL (Neon Database)
- **Authentication**: Cookie-based session (sem JWT)

## ⚡ Instalação Rápida

### 1. Clone e instale dependências
\`\`\`bash
git clone <seu-repositorio>
cd techstore
npm install
\`\`\`

### 2. Configure variáveis de ambiente
Crie um arquivo `.env` baseado no `.env.example`:

\`\`\`env
# Database (obrigatório)
DATABASE_URL="postgresql://username:password@hostname:5432/database_name"

# Admin Authentication (obrigatório)
ADMIN_EMAIL="admin@techstore.com"
ADMIN_PASSWORD="admin123"

# Opcionais
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
NEXT_PUBLIC_WHATSAPP_NUMBER="5511999999999"
\`\`\`

### 3. Configure o banco de dados
\`\`\`bash
npm run init-db
\`\`\`

### 4. Execute o projeto
\`\`\`bash
npm run dev
\`\`\`

## 🔐 Acesso Admin

1. Acesse: `http://localhost:3000/login`
2. Use as credenciais configuradas no `.env`:
   - **Email**: valor de `ADMIN_EMAIL`
   - **Senha**: valor de `ADMIN_PASSWORD`

## 📁 Estrutura do Projeto

\`\`\`
├── app/
│   ├── admin/              # Painel administrativo
│   ├── api/               # API Routes
│   │   ├── auth/          # Autenticação
│   │   ├── products/      # CRUD de produtos
│   │   └── orders/        # Gerenciamento de pedidos
│   ├── login/             # Página de login
│   └── page.tsx           # Página inicial
├── components/
│   ├── admin/             # Componentes do admin
│   └── ui/                # Componentes base (shadcn/ui)
├── hooks/
│   └── use-auth.tsx       # Hook de autenticação
├── lib/
│   └── db.ts              # Configuração do banco
└── scripts/
    └── init-db.ts         # Script de inicialização
\`\`\`

## 🗄️ Banco de Dados

### Tabelas Principais

**products**
- `id` (UUID, PK)
- `name` (VARCHAR)
- `description` (TEXT)
- `price` (DECIMAL)
- `category` (VARCHAR)
- `stock` (INTEGER)
- `image` (TEXT)
- `is_active` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

**orders**
- `id` (UUID, PK)
- `products` (JSONB)
- `total` (DECIMAL)
- `payment_method` (VARCHAR)
- `installments` (VARCHAR)
- `address` (TEXT)
- `coupon_code` (VARCHAR)
- `status` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

## 🔧 Scripts Disponíveis

\`\`\`bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # Verificar código
npm run init-db      # Inicializar banco de dados
\`\`\`

## 🌐 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Variáveis de Ambiente para Produção

\`\`\`env
DATABASE_URL="sua-string-de-conexao-postgresql"
ADMIN_EMAIL="seu-email-admin"
ADMIN_PASSWORD="sua-senha-segura"
\`\`\`

## 🔒 Segurança

- ✅ Autenticação baseada em cookies HTTP-only
- ✅ Middleware para proteção de rotas admin
- ✅ Validação de dados nas APIs
- ✅ Sanitização de inputs
- ✅ CORS configurado adequadamente

## 🐛 Solução de Problemas

### Erro de conexão com banco
\`\`\`bash
# Verifique se a DATABASE_URL está correta
echo $DATABASE_URL

# Teste a conexão
npm run init-db
\`\`\`

### Erro de autenticação
\`\`\`bash
# Verifique se as variáveis estão definidas
echo $ADMIN_EMAIL
echo $ADMIN_PASSWORD
\`\`\`

### Produtos não aparecem
\`\`\`bash
# Execute novamente a inicialização
npm run init-db
\`\`\`

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console
2. Confirme as variáveis de ambiente
3. Execute `npm run init-db` novamente

---

**Desenvolvido com ❤️ usando Next.js 14 e TypeScript**
\`\`\`
