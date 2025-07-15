# TechStore Admin

Sistema de administração para loja de tecnologia.

## 🚀 Funcionalidades

- ✅ Sistema de login seguro
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento completo de produtos (CRUD)
- ✅ Visualização e gerenciamento de pedidos
- ✅ Interface responsiva e moderna

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` com:

\`\`\`env
ADMIN_EMAIL=luccasvelar@gmail.com
ADMIN_PASSWORD=admin123
NODE_ENV=production
\`\`\`

### 2. Instalação

\`\`\`bash
npm install
\`\`\`

### 3. Desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

### 4. Build para Produção

\`\`\`bash
npm run build
npm start
\`\`\`

## 🔐 Acesso

### Login Admin
- **URL:** `/login`
- **Email:** `luccasvelar@gmail.com`
- **Senha:** `admin123`

### Painel Admin
- **URL:** `/admin` (após login)
- Dashboard com estatísticas
- Gerenciamento de produtos
- Visualização de pedidos

## 📁 Estrutura do Projeto

\`\`\`
├── app/
│   ├── admin/          # Painel administrativo
│   ├── api/            # APIs do backend
│   ├── login/          # Página de login
│   └── layout.tsx      # Layout principal
├── components/
│   ├── admin/          # Componentes do admin
│   └── ui/             # Componentes base
├── hooks/              # Hooks customizados
├── lib/                # Utilitários e database mock
└── middleware.ts       # Middleware de autenticação
\`\`\`

## 🔒 Segurança

- Autenticação via cookies HTTP-only
- Middleware para proteção de rotas
- Validação de credenciais no servidor
- Sessões com expiração automática

## 📊 Dados

O sistema utiliza dados mock em memória para demonstração. Em produção, substitua por um banco de dados real.

## 🚀 Deploy

O projeto está otimizado para deploy na Vercel:

1. Configure as variáveis de ambiente no dashboard da Vercel
2. Conecte o repositório
3. Deploy automático

## 📝 Licença

Este projeto é para fins educacionais e demonstração.
