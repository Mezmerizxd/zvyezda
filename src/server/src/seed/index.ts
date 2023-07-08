import { PrismaClient } from '@prisma/client';
import { accounts } from './data';
import { hashPassword } from '../helpers/utils';

class Seed {
  protected static instance: Seed;

  static getInstance(): Seed {
    if (!Seed.instance) {
      Seed.instance = new Seed();
    }
    return Seed.instance;
  }

  prisma: PrismaClient;

  constructor() {}

  start(prisma: PrismaClient) {
    this.prisma = prisma;

    this.populate();
  }

  stop() {}

  async populate() {
    if (process.env.MODE === 'production') return;

    for (const account of accounts) {
      const { id, username, email, password, role } = account;

      const acc = await this.prisma.accounts.findFirst({
        where: {
          id: id,
        },
      });

      if (acc !== null) {
        return;
      }

      const hash = hashPassword(password);

      await this.prisma.accounts.create({
        data: {
          id,
          username,
          email,
          password: hash,
          role,
        },
      });
    }
  }
}

export const seed = Seed.getInstance();
