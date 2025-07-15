# TechStore - E-commerce de Tecnologia

Sistema completo de e-commerce desenvolvido com Next.js 14, focado em produtos de tecnologia.

## 🚀 Funcionalidades

- ✅ Catálogo de produtos com filtros
- ✅ Carrinho de compras
- ✅ Sistema de autenticação
- ✅ Painel administrativo completo
- ✅ Gerenciamento de pedidos
- ✅ Sistema de cupons
- ✅ Integração com WhatsApp
- ✅ Design responsivo e moderno

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de dados**: PostgreSQL (Neon)
- **Autenticação**: JWT + Cookies
- **UI**: shadcn/ui + Radix UI
- **Animações**: Framer Motion

## 📦 Instalação

1. Clone o repositório:
\`\`\`bash
git clone <repository-url>
cd techstore
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Configure as variáveis de ambiente:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edite o arquivo `.env.local` com suas configurações:
\`\`\`env
DATABASE_URL="postgresql://username:password@hostname:5432/database_name"
JWT_SECRET="your-super-secret-jwt-key-here"
EMAIL_USER="your-email@gmail.com" # Opcional
EMAIL_PASS="your-app-password" # Opcional
NEXT_PUBLIC_WHATSAPP_NUMBER="5511999999999" # Opcional
\`\`\`

4. Inicialize o banco de dados:
\`\`\`bash
npm run init-db
\`\`\`

5. Execute o projeto:
\`\`\`bash
npm run dev
\`\`\`

## 🔐 Acesso Administrativo

Após inicializar o banco, use as credenciais:
- **Email**: admin@techstore.com
- **Senha**: admin123

## 📁 Estrutura do Projeto

\`\`\`
├── app/                    # App Router do Next.js
│   ├── admin/             # Painel administrativo
│   ├── api/               # API Routes
│   ├── carrinho/          # Página do carrinho
│   ├── contato/           # Página de contato
│   └── login/             # Página de login
├── components/            # Componentes React
│   ├── admin/             # Componentes do admin
│   └── ui/                # Componentes base (shadcn)
├── hooks/                 # Custom hooks
├── lib/                   # Utilitários e configurações
├── scripts/               # Scripts de setup
└── types/                 # Definições TypeScript
\`\`\`

## 🗄️ Banco de Dados

O sistema utiliza PostgreSQL com as seguintes tabelas:
- `users` - Usuários do sistema
- `products` - Catálogo de produtos
- `orders` - Pedidos realizados
- `order_items` - Itens dos pedidos
- `coupons` - Cupons de desconto

## 🚀 Deploy

1. Configure as variáveis de ambiente na plataforma de deploy
2. Execute o build:
\`\`\`bash
npm run build
\`\`\`
3. Inicie a aplicação:
\`\`\`bash
npm start
\`\`\`

## 📧 Configuração de Email (Opcional)

Para receber notificações de pedidos por email, configure:
1. `EMAIL_USER` - Seu email Gmail
2. `EMAIL_PASS` - Senha de app do Gmail

## 📱 WhatsApp (Opcional)

Configure `NEXT_PUBLIC_WHATSAPP_NUMBER` com seu número no formato internacional.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
