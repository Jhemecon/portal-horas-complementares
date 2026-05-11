# 🎓 Portal de Horas Complementares - Ciesa

Sistema web para gerenciamento de horas complementares e atividades acadêmicas dos alunos do Colégio Século.

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Credenciais de Teste](#-credenciais-de-teste)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **Portal do Aluno** é uma plataforma web desenvolvida para facilitar o gerenciamento de horas complementares dos estudantes do Colégio Século. O sistema permite que os alunos cadastrem suas atividades extracurriculares, acompanhem o progresso de aprovação e visualizem estatísticas completas de suas horas complementares.

### Problema que Resolve

- ✅ Centralização do gerenciamento de horas complementares
- ✅ Transparência no processo de aprovação de atividades
- ✅ Acompanhamento em tempo real do progresso do aluno
- ✅ Redução de processos manuais e burocráticos
- ✅ Histórico completo e exportação de relatórios

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com usuário e senha
- Recuperação de senha
- Autenticação simulada (mock) para desenvolvimento

### 📊 Dashboard de Horas Complementares
- **Visualização de progresso**: Barra de progresso geral e por categoria
- **Estatísticas em tempo real**: Horas aprovadas, pendentes, enviadas
- **Cards informativos**: Resumo visual do status das atividades

### 📁 Gerenciamento de Certificados
- **Cadastro de atividades**: Formulário completo com validação
- **Upload de arquivos**: Suporte para PDF, JPG, PNG (até 10MB)
- **Categorização**: 7 categorias de atividades complementares
  - Curso Online/Presencial
  - Palestra/Seminário
  - Workshop/Oficina
  - Extensão Universitária
  - Voluntariado/Social
  - Evento Acadêmico
  - Outros
- **Filtros avançados**: Por status, categoria e busca textual
- **Preview de certificados**: Visualização rápida dos documentos

### 📜 Histórico Completo
- Visualização detalhada de todas as solicitações
- Status de cada atividade (Pendente, Em Revisão, Aprovado, Rejeitado)
- Justificativas de aprovação/rejeição
- Informações do avaliador responsável
- **Exportação em PDF**: Geração de relatórios completos

### 🔔 Sistema de Notificações
- Notificações em tempo real
- Filtros por status (lidas/não lidas)
- Marcação individual ou em massa
- Histórico completo de notificações

### 💡 Central de Ajuda
- FAQ completo sobre horas complementares
- Descrição detalhada de cada categoria
- Requisitos para validação de atividades
- Informações de contato e suporte

### 🎨 Tema e Personalização
- **Modo claro/escuro**: Alternância automática ou manual
- **Design responsivo**: Otimizado para desktop, tablet e mobile
- **Cores institucionais**: Paleta baseada na identidade do Colégio Século
  - Azul primário: `#022b56`
  - Amarelo secundário: `#f3c83e`

---

## 🛠 Tecnologias

### Frontend Core
- **React 18.3**: Biblioteca JavaScript para interfaces
- **Vite 6.0**: Build tool e dev server ultrarrápido
- **React Router 7.0**: Roteamento e navegação SPA

### Estilização
- **Tailwind CSS 3.4**: Framework CSS utility-first
- **Radix UI**: Componentes acessíveis e unstyled
- **Lucide React**: Biblioteca de ícones moderna
- **class-variance-authority**: Variantes de componentes tipadas

### Gerenciamento de Estado
- **React Context API**: Contextos para Auth, App e Theme
- **React Hook Form**: Gerenciamento de formulários

### Utilitários
- **Sonner**: Toast notifications elegantes
- **jsPDF**: Geração de PDFs do lado do cliente
- **jsPDF-AutoTable**: Tabelas automáticas em PDFs
- **date-fns** (implícito): Manipulação de datas

### Desenvolvimento
- **ESLint**: Linting de código
- **PostCSS**: Processamento de CSS
- **Autoprefixer**: Prefixos CSS automáticos

---

## 📁 Estrutura do Projeto

```
client/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── navigation/
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   └── ui/
│   │       ├── accordion.jsx
│   │       ├── badge.jsx
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── dropdown-menu.jsx
│   │       ├── file-upload.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       ├── progress.jsx
│   │       ├── progress-bar.jsx
│   │       └── sonner.jsx
│   ├── contexts/
│   │   ├── AppContext.jsx       # Estado global da aplicação
│   │   ├── AuthContext.jsx      # Autenticação e autorização
│   │   └── ThemeContext.jsx     # Tema claro/escuro
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── ForgotPasswordPage.jsx
│   │   ├── certifications/
│   │   │   └── Certifications.jsx
│   │   ├── help/
│   │   │   └── HelpPage.jsx
│   │   ├── history/
│   │   │   └── HistoryPage.jsx
│   │   └── notifications/
│   │       └── NotificationsPage.jsx
│   ├── lib/
│   │   └── utils.js             # Funções utilitárias
│   ├── App.jsx                  # Componente raiz
│   ├── main.jsx                 # Entry point
│   └── index.css                # Estilos globais
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Instalação

### Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 ou **yarn** >= 1.22.0

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/portal-aluno-seculo.git
   cd portal-aluno-seculo
   ```

2. **Instale as dependências**
   ```bash
   cd client
   npm install
   ```

3. **Configure as variáveis de ambiente** (opcional)
   ```bash
   cp .env.example .env
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:5173
   ```

---

## 💻 Uso

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Linting
npm run lint
```

### Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Cria build otimizado para produção |
| `npm run preview` | Preview local da build de produção |
| `npm run lint` | Executa linting do código |

---

## 🔑 Credenciais de Teste

O sistema possui autenticação mock para desenvolvimento:

### Perfil Administrador
- **Usuário**: `admin`
- **Senha**: `admin123`

### Perfil Professor
- **Usuário**: `professor`
- **Senha**: `prof123`

> ⚠️ **Nota**: Estas credenciais são apenas para ambiente de desenvolvimento. Em produção, integre com um backend real.

---

## 🗺 Roadmap

### ✅ Versão 1.0 (Atual)
- [x] Sistema de autenticação mock
- [x] Gerenciamento completo de certificados
- [x] Histórico e filtros
- [x] Sistema de notificações
- [x] Tema claro/escuro
- [x] Exportação de relatórios em PDF
- [x] Design responsivo

### 🔄 Versão 1.1 (Próxima)
- [ ] Integração com backend real
- [ ] Upload de múltiplos arquivos
- [ ] Assinatura digital de documentos
- [ ] Chat de suporte integrado
- [ ] Notificações push

### 🔮 Versão 2.0 (Futuro)
- [ ] App mobile (React Native)
- [ ] Gamificação (badges, rankings)
- [ ] Integração com Google Drive
- [ ] Analytics e relatórios avançados
- [ ] Sistema de recomendação de atividades
- [ ] API pública para integrações

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <p>Feito com ❤️ pela equipe do Colégio Século</p>
  <p>© 2026 Colégio Século. Todos os direitos reservados.</p>
</div>
