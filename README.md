# Dashboard Matrícula Creche

Sistema completo de gestão de matrículas para creches, desenvolvido com Next.js, TypeScript, Tailwind CSS e Firebase.

## 🚀 Funcionalidades

- **Autenticação**: Sistema de login seguro para professores e colaboradores
- **Cadastro de Alunos**: Formulário completo com validação de dados
- **Listagem de Alunos**: Visualização com filtros por nome, idade e status
- **Relatórios**: Estatísticas detalhadas e exportação em CSV
- **Interface Responsiva**: Design moderno e adaptável para diferentes dispositivos

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React, TypeScript
- **Estilização**: Tailwind CSS
- **Banco de Dados**: Firebase Firestore
- **Autenticação**: Firebase Auth
- **Validação**: Zod + React Hook Form
- **Ícones**: Lucide React
- **Exportação**: PapaParse (CSV)

## 📋 Pré-requisitos

- Node.js 18+ 
- npm, yarn, pnpm ou bun
- Conta no Firebase

## ⚙️ Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/pecoliveira/DashboardCreche.git
cd DashboardCreche
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure o Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto
3. Ative a Autenticação (Email/Senha)
4. Ative o Firestore Database
5. Copie as credenciais do projeto

### 4. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais do Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### 5. Configure o Firestore

No Firebase Console, crie as seguintes coleções:

#### Coleção `users`
```javascript
{
  email: "string",
  name: "string", 
  role: "professor" | "colaborador",
  createdAt: "timestamp"
}
```

#### Coleção `students`
```javascript
{
  name: "string",
  birthDate: "timestamp",
  age: "number",
  parentName: "string",
  parentPhone: "string", 
  parentEmail: "string",
  address: "string",
  medicalInfo: "string",
  allergies: "array",
  emergencyContact: "string",
  emergencyPhone: "string",
  enrollmentDate: "timestamp",
  status: "active" | "inactive",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### 6. Crie usuários de teste

No Firebase Auth, adicione usuários manualmente ou use o console para criar contas de teste.

## 🚀 Executando o projeto

```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── globals.css         # Estilos globais
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página inicial
├── components/             # Componentes React
│   ├── Dashboard.tsx       # Dashboard principal
│   ├── LoginForm.tsx       # Formulário de login
│   ├── Navbar.tsx          # Barra de navegação
│   ├── Reports.tsx         # Página de relatórios
│   ├── StudentForm.tsx     # Formulário de cadastro
│   └── StudentList.tsx     # Listagem de alunos
├── contexts/               # Contextos React
│   └── AuthContext.tsx     # Contexto de autenticação
├── lib/                    # Utilitários
│   ├── firebase.ts         # Configuração do Firebase
│   ├── utils.ts           # Funções utilitárias
│   └── validations.ts     # Schemas de validação
└── types/                  # Definições TypeScript
    └── index.ts           # Tipos principais
```

## 🎨 Funcionalidades Detalhadas

### Autenticação
- Login seguro com Firebase Auth
- Sessão persistente
- Proteção de rotas

### Cadastro de Alunos
- Formulário completo com validação
- Campos obrigatórios e opcionais
- Cálculo automático de idade
- Validação de email e telefone

### Listagem
- Filtros por nome, idade e status
- Busca em tempo real
- Paginação automática
- Informações organizadas

### Relatórios
- Dashboard com estatísticas
- Gráficos de distribuição por idade
- Exportação para CSV
- Filtros por período

### Interface
- Design responsivo
- Tema moderno e profissional
- Feedback visual para ações
- Loading states

## 🔒 Segurança

- Autenticação obrigatória
- Regras de segurança do Firestore
- Validação no frontend e backend
- Sanitização de dados

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção  
npm run build

# Executar build
npm run start

# Linting
npm run lint
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outros Provedores

O projeto pode ser implantado em qualquer provedor que suporte Next.js:
- Netlify
- Railway
- AWS Amplify
- Google Cloud Platform

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.
