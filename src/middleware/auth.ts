import type { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '../env.ts';

export async function authenticateToken(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Buscar token no header Authorization ou x-auth-token
  const token = 
    request.headers.authorization?.replace('Bearer ', '') || 
    request.headers['x-auth-token'];
  
  // Verificar se token existe
  if (!token) {
    return reply.status(401).send({
      error: 'Token obrigatório',
      message: 'Use o header: Authorization: Bearer <token> ou x-auth-token: <token>'
    });
  }

  // Verificar se token é válido
  if (token !== env.AUTH_TOKEN) {
    return reply.status(401).send({
      error: 'Token inválido',
      message: 'O token fornecido não é válido'
    });
  }

  // ✅ Token válido, continuar
}
