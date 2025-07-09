# NLW Agents - Backend

Projeto desenvolvido durante o evento NLW da Rocketseat, uma aplicação backend utilizando Node.js com TypeScript e PostgreSQL.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset JavaScript com tipagem estática
- **Fastify** - Framework web performático
- **PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - ORM TypeScript-first
- **Zod** - Validação de schemas
- **Docker** - Containerização do banco de dados

## 📁 Estrutura do Projeto

```
src/
├── db/
│   ├── schema/         # Esquemas do banco de dados
│   ├── migrations/     # Migrações do banco
│   └── connection.ts   # Configuração da conexão
├── http/
│   └── routes/         # Rotas da API
├── env.ts             # Configuração de variáveis de ambiente
└── server.ts          # Servidor principal
```

## 🛠️ Setup do Projeto

### 1. Clonar o repositório
```bash
git clone <url-do-repositorio>
cd server
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3333
DATABASE_URL=postgresql://docker:docker@localhost:5432/agents
```

### 4. Iniciar o banco de dados
```bash
docker-compose up -d
```

### 5. Executar migrações
```bash
npx drizzle-kit migrate
```

### 6. Popular o banco (opcional)
```bash
npm run db:seed
```

### 7. Iniciar o servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📡 Endpoints

- `GET /health` - Health check da aplicação
- `GET /rooms` - Lista todas as salas

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm start` - Inicia o servidor em produção
- `npm run db:seed` - Popula o banco com dados de exemplo

## 🐳 Docker

O projeto utiliza PostgreSQL com a extensão pgvector rodando em Docker. O banco estará disponível em `localhost:5432`.

## 📝 Padrões de Projeto

- **Repository Pattern** - Organização da camada de dados
- **Plugin Pattern** - Estruturação de rotas no Fastify
- **Environment Configuration** - Configuração através de variáveis de ambiente
- **Type Safety** - Validação de tipos com Zod e TypeScript

---

Desenvolvido com 💜 durante o **NLW Agents** da **Rocketseat**
