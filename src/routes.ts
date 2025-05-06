import type { FastifyInstance } from 'fastify'

import { ListOrdersController } from './controllers/ListOrdersController'
import { SignInController } from './controllers/SignInController'
import { SignUpController } from './controllers/SignUpController'
import { authMiddleware } from './middlewares/authMiddleware'
import { RefreshTokenController } from './controllers/RefreshTokenController'

export async function publicRoutes(fastify: FastifyInstance) {
  fastify.post('/sign-up', SignUpController.handle)
  fastify.post('/sign-in', SignInController.handle)
  fastify.post('/refresh-token', RefreshTokenController.handle)
}

export async function privateRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', authMiddleware)

  fastify.get('/orders', ListOrdersController.handle)
}
