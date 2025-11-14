# Desafio - Sistema de Gerenciamento de Clientes

Sistema completo para gerenciamento de clientes com frontend, backend e persistência de dados.

## 📋 Requisitos

- Node.js (v18 ou superior)
- Docker e Docker Compose (para MySQL)
- npm ou yarn

## 🚀 Início Rápido

### 1. Banco de Dados

Na pasta `backend`, inicie o MySQL com Docker:

```bash
cd backend
docker-compose up -d
```

O MySQL será iniciado na porta 3306 com as seguintes credenciais:
- **Host**: localhost
- **Porta**: 3306
- **Database**: desafio_db
- **Usuário**: desafio_user
- **Senha**: desafio_password

**Nota**: A string de conexão inclui `allowPublicKeyRetrieval=true` para resolver o erro "Public Key Retrieval is not allowed" do MySQL 8.0.

### 2. Backend

#### 2.1. Configurar Variáveis de Ambiente

Na pasta `backend`, copie o arquivo de exemplo:

```bash
cd backend
cp env.example .env
```

O arquivo `.env` já está pré-configurado com as credenciais corretas do banco de dados.

**Variáveis de ambiente necessárias:**
```env
DATABASE_URL="mysql://desafio_user:desafio_password@localhost:3306/desafio_db?allowPublicKeyRetrieval=true"
PORT=3001
```

#### 2.2. Instalar Dependências

```bash
cd backend
npm install
# ou
yarn install
```

**Nota**: O Prisma Client é gerado automaticamente quando necessário. As migrações são aplicadas automaticamente na inicialização do servidor.

#### 2.3. Executar o Servidor

**Modo desenvolvimento:**
```bash
npm run build
npm start
```

**Modo produção:**
```bash
npm run build
node dist/index.js
```

O servidor estará rodando em `http://localhost:3001`

### 3. Frontend

#### 3.1. Configurar Variáveis de Ambiente
Na pasta `frontend`, copie o arquivo de exemplo:

```bash
cd frontend
cp env.example .env.local
```

Ou crie manualmente um arquivo `.env.local` com:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

**Importante**: No Next.js, variáveis de ambiente usadas no código do cliente devem ter o prefixo `NEXT_PUBLIC_` para serem expostas ao navegador.

#### 3.2. Instalar Dependências

```bash
cd frontend
npm install
# ou
yarn install
```

#### 3.3. Executar o Servidor de Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

#### 3.4. Build para Produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
desafio/
├── backend/              # API REST com Node.js, Express e TypeScript
│   ├── src/
│   │   ├── modules/     # Módulos da aplicação
│   │   │   ├── customer/ # Módulo de clientes
│   │   │   └── health/   # Health check
│   │   ├── database/    # Configuração do Prisma
│   │   ├── common/       # Utilitários e middlewares customizados
│   │   └── index.ts     # Ponto de entrada principal
│   ├── prisma/          # Schema e migrações do Prisma
│   ├── dist/            # Código compilado (gerado)
│   ├── docker-compose.yml
│   ├── env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/            # Aplicação Next.js com TypeScript e Tailwind CSS
│   ├── app/             # Páginas do Next.js App Router
│   ├── components/      # Componentes React
│   ├── lib/             # Funções utilitárias e cliente API
│   ├── types/           # Definições de tipos TypeScript
│   ├── env.example
│   ├── package.json
│   └── next.config.js
└── README.md
```

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Linguagem de programação
- **Prisma.js** - ORM para banco de dados
- **MySQL** - Banco de dados relacional
- **routing-controllers** - Framework para controllers
- **class-validator** - Validação de dados
- **class-transformer** - Transformação de objetos

### Frontend
- **Next.js** (v14) - Framework React
- **TypeScript** - Linguagem de programação
- **React Hook Form** - Gerenciamento de formulários
- **Tailwind CSS** - Framework CSS utilitário

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### Listar Clientes
```bash
GET /customer
```

**Parâmetros de Query:**
- `page` (number, opcional): Número da página (padrão: 1)
- `size` (number, opcional): Itens por página (padrão: 10)
- `name` (string, opcional): Filtrar por nome (busca parcial)
- `email` (string, opcional): Filtrar por email (busca parcial)
- `document` (string, opcional): Filtrar por documento (busca parcial)

**Exemplo:**
```bash
curl "http://localhost:3001/customer?page=1&size=10&name=John"
```

**Resposta:**
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "size": 10,
  "totalPages": 10
}
```

### Obter Cliente por ID
```bash
GET /customer/:id
```

**Exemplo:**
```bash
curl http://localhost:3001/customer/1
```

### Criar Cliente
```bash
POST /customer
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "document": "12345678901",
  "status": "ACTIVE"
}
```

**Exemplo:**
```bash
curl -X POST http://localhost:3001/customer \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "document": "12345678901", "status": "ACTIVE"}'
```

### Atualizar Cliente
```bash
PUT /customer/:id
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "document": "12345678901",
  "status": "ACTIVE"
}
```

**Exemplo:**
```bash
curl -X PUT http://localhost:3001/customer/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Smith", "email": "john.smith@example.com", "document": "12345678901", "status": "ACTIVE"}'
```

### Deletar Cliente (Soft Delete)
```bash
DELETE /customer/:id
```

**Exemplo:**
```bash
curl -X DELETE http://localhost:3001/customer/1
```

**Nota**: A exclusão é um soft delete - os registros não são removidos fisicamente, apenas marcados com `deletedAt`.

## 🎨 Funcionalidades do Frontend

- **Tabela de Clientes**: Tabela paginada exibindo todos os clientes
- **Criar Cliente**: Modal com formulário para criar novos clientes usando React Hook Form
- **Editar Cliente**: Modal com formulário para editar clientes existentes
- **Excluir Cliente**: Funcionalidade de exclusão com diálogo de confirmação
- **Gerenciamento de Status**: Alterar status do cliente (Ativo, Inativo, Bloqueado)
- **Design Responsivo**: Interface amigável para mobile usando Tailwind CSS
- **Type Safety**: Suporte completo a TypeScript

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas:

- **Controller**: Manipula requisições HTTP e retorna respostas
- **Service**: Contém lógica de negócio e validações
- **Repository**: Manipula acesso aos dados usando Prisma ORM

## 📝 Notas Importantes

- As migrações são aplicadas automaticamente na inicialização do servidor
- O Prisma Client é gerado automaticamente quando necessário
- Para criar novas migrações, use `npm run prisma:migrate` no diretório backend
- O projeto usa soft delete (registros não são removidos fisicamente, apenas marcados com `deletedAt`)
- O frontend se comunica com o backend através da variável `NEXT_PUBLIC_BACKEND_URL`

## 🛑 Parar o Banco de Dados

Na pasta `backend`, execute:

```bash
cd backend
docker-compose down
```

Para remover também os volumes (dados do banco):

```bash
docker-compose down -v
```

## 🔧 Comandos Úteis

### Backend
```bash
# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Executar servidor
npm start

# Gerar Prisma Client
npm run prisma:generate

# Criar nova migração
npm run prisma:migrate
```

### Frontend
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start

# Linter
npm run lint
```
