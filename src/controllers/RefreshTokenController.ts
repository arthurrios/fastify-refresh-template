import type { FastifyReply, FastifyRequest } from 'fastify'
import { env } from '../config/env'

export class RefreshTokenController {
  static handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = await request.refreshJwtVerify({
      key: env.REFRESH_TOKEN_SECRET,
    })

    const accessToken = await reply.accessJwtSign({ sub: payload.sub })
    const refreshToken = await reply.refreshJwtSign(
      { sub: payload.sub },
      { key: env.REFRESH_TOKEN_SECRET, expiresIn: '10d' },
    )

    return reply.code(200).send({
      accessToken,
      refreshToken,
    })
  }
}
