# 🤖 NLW Agents

> **Sistema inteligente de Q&A com RAG (Retrieval-Augmented Generation)** desenvolvido durante o evento **NLW da Rocketseat**, utilizando embeddings vetoriais e IA generativa para responder perguntas baseadas em conteúdo de áudio transcrito.

## 🎯 **Sobre o Projeto**

O **NLW Agents** é uma aplicação backend que implementa um sistema de **Retrieval-Augmented Generation (RAG)** para criar assistentes virtuais inteligentes. O sistema processa áudio, transcreve automaticamente, gera embeddings semânticos e responde perguntas contextualizadas usando **Google Gemini AI**.

### 🔥 **Principais Funcionalidades**

- 🎙️ **Transcrição automática** de áudio com IA
- 🧠 **Busca semântica** usando embeddings vetoriais (768 dimensões)
- 🤖 **Respostas contextualizadas** com RAG pattern
- 📊 **Similaridade coseno** para recuperação de contexto relevante
- 🏢 **Salas organizadas** para diferentes contextos/projetos
- ⚡ **API REST** performática com validação rigorosa

## 🛠️ **Stack Tecnológica**

### **Core**
- **Node.js 22+** - Runtime JavaScript moderno
- **TypeScript** - Superset com tipagem estática
- **Fastify** - Framework web ultra-performático
- **PostgreSQL + pgvector** - Banco vetorial para embeddings

### **IA & Embeddings**
- **Google Gemini 2.5 Flash** - Transcrição e geração de respostas
- **text-embedding-004** - Modelo de embeddings (768d)
- **Busca por similaridade coseno** - Recuperação semântica

### **ORM & Validação**
- **Drizzle ORM** - ORM TypeScript-first com SQL builder
- **Zod** - Schema validation runtime-safe
- **Drizzle-Kit** - Migrations e introspection

### **DevOps & Ferramentas**
- **Docker Compose** - Containerização do PostgreSQL
- **ESM + --experimental-strip-types** - TypeScript nativo
- **Environment Variables** - Configuração por variáveis

## 🏗️ **Arquitetura & Padrões**

```
src/
├── 🗄️ db/
│   ├── schema/           # Esquemas Drizzle (rooms, questions, audio_chunks)
│   ├── migrations/       # SQL migrations versionadas
│   └── connection.ts     # Pool de conexões PostgreSQL
├── 🌐 http/
│   └── routes/           # Rotas REST organizadas por domínio
├── 🤖 services/
│   └── gemini.ts         # Integração com Google AI
├── ⚙️ env.ts             # Configuração type-safe com Zod
└── 🚀 server.ts          # Bootstrap da aplicação
```

### **Padrões Implementados**
- **🔌 Plugin Pattern** - Organização modular de rotas
- **🎯 Repository Pattern** - Abstração da camada de dados  
- **🛡️ Type Safety** - Validação end-to-end com Zod
- **📊 RAG Pattern** - Retrieval-Augmented Generation
- **🔍 Vector Search** - Busca semântica com embeddings

## 🚀 **Setup & Configuração**

### **1. Clone e Dependências**
```bash
git clone <repository-url>
cd server
npm install
```

### **2. Variáveis de Ambiente**
```bash
cp .env.example .env
```

```env
# HTTP Server
PORT=3333
HOST=localhost

# PostgreSQL + pgvector
DATABASE_URL="postgresql://docker:docker@localhost:5432/agents"

# Google AI Platform
GEMINI_API_KEY="your-gemini-api-key"
```

### **3. Infraestrutura (PostgreSQL + pgvector)**
```bash
# Subir PostgreSQL com extensão vector
docker-compose up -d

# Executar migrations
npm run db:migrate

# Seed inicial (opcional)
npm run db:seed
```

### **4. Desenvolvimento**
```bash
# Modo desenvolvimento (hot-reload)
npm run dev

# Produção
npm start
```

## 📡 **API Endpoints**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/health` | Health check |
| `GET` | `/rooms` | Lista salas com contadores |
| `GET` | `/rooms/:id` | Detalhes da sala + questões |
| `POST` | `/rooms` | Criar nova sala |
| `GET` | `/rooms/:id/questions` | Questões da sala |
| `POST` | `/rooms/:id/questions` | **RAG**: Criar pergunta com IA |
| `POST` | `/rooms/:id/audio` | Upload e transcrição de áudio |

### **Exemplo: RAG Query**
```bash
POST /rooms/{roomId}/questions
Content-Type: application/json

{
  "question": "Quais são os principais conceitos de React?"
}
```

**Resposta:**
```json
{
  "questionId": "uuid",
  "answer": "Com base no conteúdo da aula, os principais conceitos..."
}
```

## 🧬 **Fluxo RAG (Retrieval-Augmented Generation)**

1. **📝 Upload de Áudio** → Transcrição com Gemini 2.5
2. **🔢 Geração de Embeddings** → Vector 768D com text-embedding-004  
3. **💾 Armazenamento Vetorial** → PostgreSQL + pgvector
4. **❓ Pergunta do Usuário** → Embedding da query
5. **🔍 Busca Semântica** → Similaridade coseno (threshold: 0.75)
6. **🤖 Geração Contextual** → Resposta com contexto recuperado

## 🔧 **Scripts Disponíveis**

```bash
npm run dev          # Desenvolvimento com hot-reload
npm start            # Produção
npm run db:generate  # Gerar migrations
npm run db:migrate   # Executar migrations  
npm run db:seed      # Popular dados de exemplo
```

## 🌟 **Diferenciais Técnicos**

- ✅ **TypeScript nativo** sem transpilação (--experimental-strip-types)
- ✅ **Busca vetorial** com PostgreSQL + pgvector  
- ✅ **RAG implementado** para contexto inteligente
- ✅ **Type safety** end-to-end com Zod
- ✅ **Migrations versionadas** com Drizzle
- ✅ **Docker-ready** para deploy
- ✅ **Performance** otimizada com Fastify

## 📊 **Métricas de Qualidade**

- 🎯 **Precisão RAG**: Threshold de similaridade 0.75
- ⚡ **Performance**: <100ms para queries simples  
- 🛡️ **Type Safety**: 100% tipado com Zod + TypeScript
- 🔒 **Validação**: Schema validation em todas as rotas

---

<div align="center">

**Desenvolvido com 💜 durante o NLW Agents da [Rocketseat](https://rocketseat.com.br)**

*Demonstrando expertise em IA, RAG, TypeScript e arquitetura backend moderna*