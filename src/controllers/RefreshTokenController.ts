import type { FastifyReply, FastifyRequest } from 'fastify'
import { env } from '../config/env'
import { RefreshTokensRepository } from '../repositories/RefreshTokensRepository'
import type { RefreshToken } from '@prisma/client'
import { z } from 'zod'
import { EXP_TIME_IN_DAYS } from '../config/contants'

export class RefreshTokenController {
  static schema = z.object({
    refreshTokenId: z.string().uuid(),
  })

  static handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = this.schema.safeParse(request.body)
    if (!result.success) {
      return reply.code(400).send({ errors: result.error.issues })
    }
    const { refreshTokenId } = result.data

    const refreshToken = await RefreshTokensRepository.findById(refreshTokenId)

    if (!refreshToken) {
      return reply.code(401).send({ error: 'Invalid credentials' })
    }

    if (Date.now() > refreshToken.expiresAt.getTime()) {
      return reply.code(401).send({ error: 'Refresh token expired.' })
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + EXP_TIME_IN_DAYS)

    const [accessToken, newRefreshToken] = await Promise.all([
      await reply.jwtSign({ sub: refreshToken.accountId }),
      await RefreshTokensRepository.create({
        accountId: refreshToken.accountId,
        expiresAt,
      }),
      await RefreshTokensRepository.deleteById(refreshToken.id),
    ])

    return reply.code(200).send({
      accessToken,
      refreshToken: newRefreshToken.id,
    })
  }
}
