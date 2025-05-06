import type { Account, RefreshToken } from '@prisma/client'
import { prismaClient } from '../lib/prisma'

interface ICreateDTO {
  accountId: string
  expiresAt: Date
}

export class RefreshTokensRepository {
  static async create({
    accountId,
    expiresAt,
  }: ICreateDTO): Promise<RefreshToken> {
    return prismaClient.refreshToken.create({
      data: {
        accountId,
        expiresAt,
      },
    })
  }

  static async findById(id: string): Promise<RefreshToken | null> {
    return prismaClient.refreshToken.findUnique({
      where: {
        id,
      },
    })
  }

  static async deleteById(id: string): Promise<RefreshToken> {
    return prismaClient.refreshToken.delete({
      where: {
        id,
      },
    })
  }

  static async deleteAllByAccountId(accountId: string) {
    return prismaClient.refreshToken.deleteMany({
      where: {
        accountId,
      },
    })
  }
}
