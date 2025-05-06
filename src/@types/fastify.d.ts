import type { FastifyJwtNamespace } from '@fastify/jwt'
import type jwtPlugin from '@fastify/jwt'

declare module 'fastify' {
  interface FastifyInstance
    extends FastifyJwtNamespace<{ namespace: 'access' }>,
      FastifyJwtNamespace<{ namespace: 'refresh' }> {}

  interface FastifyRequest {
    accessJwtVerify: <T = jwtPlugin.VerifyPayloadType>() => Promise<T>
    accessJwtDecode: FastifyRequest['jwtDecode']
    refreshJwtVerify: <T = jwtPlugin.VerifyPayloadType>(
      options?: object,
    ) => Promise<T>
    refreshJwtDecode: FastifyRequest['jwtDecode']
  }

  interface FastifyReply {
    accessJwtSign: FastifyReply['jwtSign']
    accessJwtDecode: FastifyReply['jwtDecode']
    refreshJwtSign: FastifyReply['jwtSign']
    refreshJwtDecode: FastifyReply['jwtDecode']
  }
}

declare module '@fastify/jwt' {
  interface JWT {
    access: jwtPlugin.JWT
    refresh: jwtPlugin.JWT
  }

  interface VerifyPayloadType {
    sub: string
  }
}
