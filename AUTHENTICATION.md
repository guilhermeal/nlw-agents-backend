# 🔐 Autenticação Simples

## Como usar a autenticação

### 🔑 Token de Autenticação

O projeto usa um sistema simples de autenticação por token fixo. Para acessar rotas protegidas, você deve incluir o token no header da requisição.

### 📊 Rotas Públicas (sem token)

- `GET /health` - Health check
- `GET /rooms` - Listar todas as salas

### 🔐 Rotas Protegidas (com token)

- `GET /rooms/:id` - Detalhes de uma sala
- `POST /rooms` - Criar nova sala
- `GET /rooms/:id/questions` - Questões de uma sala
- `POST /rooms/:id/questions` - Criar questão em uma sala
- `POST /rooms/:id/audio` - Upload de áudio para uma sala

### 💻 Como enviar o token

#### Opção 1: Header Authorization (Bearer)
```bash
curl -H "Authorization: Bearer nlw-agents-secret-token-2025" \
     http://localhost:3333/rooms
```

#### Opção 2: Header x-auth-token
```bash
curl -H "x-auth-token: nlw-agents-secret-token-2025" \
     http://localhost:3333/rooms
```

#### Opção 3: JavaScript/TypeScript
```javascript
fetch('http://localhost:3333/rooms', {
  headers: {
    'Authorization': 'Bearer nlw-agents-secret-token-2025'
  }
});
```

### ⚙️ Configuração

O token é configurado na variável de ambiente `AUTH_TOKEN` no arquivo `.env`:

```env
AUTH_TOKEN="nlw-agents-secret-token-2025"
```

### 🚨 Respostas de Erro

#### 401 - Token ausente
```json
{
  "error": "Token obrigatório",
  "message": "Use o header: Authorization: Bearer <token> ou x-auth-token: <token>"
}
```

#### 401 - Token inválido
```json
{
  "error": "Token inválido",
  "message": "O token fornecido não é válido"
}
```

### 🛡️ Segurança

- **Desenvolvimento**: Use o token padrão para testes
- **Produção**: Altere o `AUTH_TOKEN` para um valor complexo e seguro
- **HTTPS**: Sempre use HTTPS em produção para proteger o token em trânsito
