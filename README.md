# 🎓 Portal de Horas Complementares — CIESA

Sistema web completo para gerenciamento de horas complementares dos alunos do CIESA. Os estudantes submetem certificados digitalmente, acompanham o status de aprovação em tempo real e visualizam seu progresso em relação à carga horária exigida pelo curso.

---

## 📑 Sumário

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API — Endpoints](#-api--endpoints)
- [Banco de Dados](#-banco-de-dados)
- [Docker](#-docker)
- [Funcionalidades](#-funcionalidades)

---

## 🎯 Visão Geral

O Portal CIESA resolve o problema de gerenciamento manual de horas complementares, centralizando todo o fluxo em uma única plataforma:

- **Alunos** fazem upload de certificados, acompanham aprovações e visualizam seu progresso.
- **Coordenadores** revisam, aprovam ou rejeitam submissões com feedback detalhado.
- **Administradores** gerenciam usuários, cursos e categorias de atividades.

---

## 🛠 Tecnologias

### Frontend

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React | 18.3 | Interface de usuário |
| Vite | 7.x | Build tool e dev server |
| React Router | 7.x | Roteamento SPA |
| Tailwind CSS | 4.x | Estilização utility-first |
| Radix UI | — | Componentes acessíveis |
| Lucide React | — | Ícones |
| Sonner | — | Notificações toast |
| React Hook Form | — | Gerenciamento de formulários |
| jsPDF + AutoTable | — | Geração de relatórios PDF |
| Framer Motion | — | Animações |

### Backend

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Node.js | 20+ | Runtime |
| Express | 4.x | Framework HTTP |
| TypeScript | 6.x | Tipagem estática |
| Drizzle ORM | — | Mapeamento banco de dados |
| PostgreSQL | — | Banco de dados relacional |
| Multer | — | Upload de arquivos |
| JWT (jsonwebtoken) | — | Autenticação stateless |
| bcryptjs | — | Hash de senhas |
| Helmet + CORS | — | Segurança HTTP |

---

## 🏗 Arquitetura

```
┌─────────────────────────────────────────────┐
│                  Cliente (React)             │
│  React + Vite + Tailwind + Radix UI          │
│  SPA servida estaticamente em produção       │
└──────────────────────┬──────────────────────┘
                       │ HTTP / REST
┌──────────────────────▼──────────────────────┐
│               Servidor (Express)             │
│  Rotas → Middlewares → Controllers           │
│  Auth JWT | Upload Multer | Validação        │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│          Banco de Dados (PostgreSQL)         │
│  Drizzle ORM | Migrations | Relations        │
└─────────────────────────────────────────────┘
```

O backend serve tanto a API REST quanto os arquivos estáticos do frontend em produção — um único processo Node.js.

---

## ✅ Pré-requisitos

- **Node.js** >= 20.0.0
- **pnpm** >= 10.4.1
- **PostgreSQL** >= 14 (local ou remoto, ex: Neon, Supabase)

---

## 🚀 Instalação e Configuração

**1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/portal-ciesa.git
cd portal-ciesa
```

**2. Instale as dependências**

```bash
pnpm install
```

**3. Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais (veja a seção abaixo).

**4. Execute as migrations do banco**

```bash
pnpm drizzle-kit push
```

**5. Inicie em modo desenvolvimento**

```bash
# Terminal 1 — Frontend
pnpm dev

# Terminal 2 — Backend
pnpm dev:server
```

Acesse `http://localhost:5173` (frontend) e `http://localhost:5000` (API).

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
DB_CONNECTION_URL=postgresql://usuario:senha@host:5432/nome_do_banco?sslmode=require

# Autenticação JWT
JWT_SECRET=sua_chave_secreta_longa_e_aleatoria

# Frontend — URL da API
VITE_API_BASE_URL=http://localhost:5000/api

# Servidor
PORT=5000
NODE_ENV=development

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=seu@email.com
EMAIL_HOST_PASSWORD=sua_app_password
```

> **Atenção:** nunca commite o arquivo `.env` no repositório. Ele já está no `.gitignore`.

---

## 📦 Scripts Disponíveis

| Script | Descrição |
|---|---|
| `pnpm dev` | Inicia o frontend (Vite) em modo desenvolvimento |
| `pnpm dev:server` | Inicia o backend (tsx watch) em modo desenvolvimento |
| `pnpm build` | Build completo: frontend + backend para produção |
| `pnpm build:docker` | Build otimizado para container Docker |
| `pnpm start` | Inicia o servidor de produção (`dist/main.mjs`) |
| `pnpm preview` | Preview local da build do frontend |
| `pnpm test` | Executa os testes com Vitest |
| `pnpm check` | Verificação de tipos TypeScript |
| `pnpm format` | Formata o código com Prettier |

---

## 📁 Estrutura do Projeto

```
.
├── client/                   # Frontend React
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── auth/         # ProtectedRoute
│       │   ├── layouts/      # AuthLayout, DashboardLayout
│       │   ├── navigation/   # Header, Sidebar
│       │   └── ui/           # Componentes reutilizáveis (Button, Card, etc.)
│       ├── contexts/
│       │   ├── AppContext.jsx     # Estado global (sidebar, notificações)
│       │   ├── AuthContext.jsx    # Autenticação e sessão
│       │   └── ThemeContext.jsx   # Tema claro/escuro
│       ├── lib/
│       │   ├── auth.js       # Roles e permissões
│       │   └── utils.js      # Funções utilitárias
│       └── pages/
│           ├── auth/         # Login, Recuperação de senha
│           ├── certifications/   # Submissão e listagem de certificados
│           ├── history/      # Histórico de atividades
│           ├── help/         # Central de ajuda e FAQ
│           └── notifications/    # Notificações do sistema
│
├── server/                   # Backend Express + TypeScript
│   ├── main.ts               # Entry point do servidor
│   ├── uploads/              # Certificados enviados pelos alunos
│   └── src/
│       ├── controllers/      # Lógica de negócio
│       │   ├── activityController.ts
│       │   ├── submissionController.ts
│       │   └── userController.ts
│       ├── db/
│       │   ├── index.ts      # Conexão com PostgreSQL (Drizzle)
│       │   └── schema.ts     # Definição de tabelas e relações
│       ├── middlewares/
│       │   ├── auth.ts       # Verificação JWT
│       │   └── upload.ts     # Configuração Multer
│       └── routes/
│           ├── activityRoutes.ts
│           ├── submissionRoutes.ts
│           └── userRoutes.ts
│
├── drizzle.config.ts         # Configuração do Drizzle Kit
├── vite.config.ts            # Configuração do Vite
├── tsconfig.json             # Configuração TypeScript
├── Dockerfile                # Build multi-stage para produção
└── package.json
```

---

## 🔌 API — Endpoints

Todos os endpoints protegidos exigem o header `Authorization: Bearer <token>`.

### Autenticação (`/api/users`)

| Método | Rota | Proteção | Descrição |
|---|---|---|---|
| `GET` | `/api/users` | Pública | Lista todos os usuários |
| `POST` | `/api/users/register` | Pública | Cadastra novo usuário |
| `POST` | `/api/users/login` | Pública | Autentica e retorna JWT |
| `GET` | `/api/users/me` | 🔒 JWT | Retorna o perfil do usuário logado |

**Exemplo de login:**

```json
POST /api/users/login
{
  "email": "aluno@ciesa.com.br",
  "password": "senha123"
}
```

**Resposta:**

```json
{
  "message": "Login efetuado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "uuid", "name": "João", "email": "...", "role": "student" }
}
```

### Certificados (`/api/submissions`)

| Método | Rota | Proteção | Descrição |
|---|---|---|---|
| `GET` | `/api/submissions` | 🔒 JWT | Lista certificados do aluno logado |
| `POST` | `/api/submissions` | 🔒 JWT | Envia novo certificado (multipart/form-data) |

**Upload de certificado:**

```
POST /api/submissions
Content-Type: multipart/form-data

title: "Curso de React Avançado"
hoursClaimed: 40
activityId: "uuid-da-atividade"
certificate: <arquivo PDF/JPG/PNG>
```

### Atividades (`/api/activities`)

| Método | Rota | Proteção | Descrição |
|---|---|---|---|
| `GET` | `/api/activities` | Pública | Lista categorias de atividades |
| `POST` | `/api/activities` | Pública | Cria nova categoria |

---

## 🗄 Banco de Dados

O schema é gerenciado pelo **Drizzle ORM**. As tabelas principais são:

```
courses          → Cursos com carga horária total exigida
users            → Alunos, coordenadores e admins (com bcrypt na senha)
activities       → Categorias de atividades (Palestra, Curso, Extensão...)
submissions      → Certificados enviados pelos alunos
```

**Papéis de usuário (`user_role`):** `student` | `coordinator` | `admin`

**Status de submissão (`submission_status`):** `pending` | `approved` | `rejected`

**Comandos Drizzle:**

```bash
# Gera e aplica migrations automaticamente
pnpm drizzle-kit push

# Abre o Drizzle Studio (interface visual do banco)
pnpm drizzle-kit studio
```

---

## 🐳 Docker

O projeto inclui um `Dockerfile` multi-stage otimizado para produção.

**Build e execução:**

```bash
# Build da imagem
docker build -t portal-ciesa .

# Execução
docker run -p 80:80 \
  -e DB_CONNECTION_URL=postgresql://... \
  -e JWT_SECRET=sua_chave_secreta \
  portal-ciesa
```

O container expõe a porta `80` e serve tanto a API quanto o frontend estático num único processo.

---

## ✨ Funcionalidades

### Para o Aluno
- Cadastro e login com autenticação JWT segura
- Upload de certificados em PDF, JPG ou PNG (até 5 MB)
- Acompanhamento do status de cada submissão (Pendente / Aprovado / Rejeitado)
- Barra de progresso geral e por categoria de atividade
- Exportação do histórico completo em PDF
- Notificações de aprovação e rejeição
- Modo claro e escuro

### Para o Sistema
- Autenticação com JWT e senhas criptografadas com bcrypt
- Controle de acesso baseado em papéis (RBAC)
- Armazenamento de arquivos no servidor com nomes únicos (evita colisões)
- Rate limiting e headers de segurança (Helmet)
- Design responsivo para desktop, tablet e mobile

---

## 🎨 Paleta de Cores

| Token | Hex | Uso |
|---|---|---|
| `ciesa-blue` | `#002d5a` | Cor primária, sidebar, botões |
| `ciesa-teal` | `#009ca6` | Destaque, badges, progresso |

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

<div align="center">
  <p>Desenvolvido para o <strong>CIESA — Centro de Instrução Especializado</strong></p>
  <p>© 2026 CIESA. Todos os direitos reservados.</p>
</div>
