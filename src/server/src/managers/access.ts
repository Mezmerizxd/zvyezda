import { Accounts, PrismaClient, Roles } from '@prisma/client';
import * as crypto from 'crypto';

class AccessManager {
  protected static instance: AccessManager;

  static getInstance(): AccessManager {
    if (!AccessManager.instance) {
      AccessManager.instance = new AccessManager();
    }
    return AccessManager.instance;
  }

  prisma: PrismaClient;

  active: Zvyezda.Server.Managers.Access.Active[];

  constructor() {}

  start(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  stop() {}

  async createAccess({ id, username }: Accounts): Promise<string | null> {
    const account = await this.prisma.accounts.findFirst({
      where: {
        id,
      },
    });

    if (account === null) {
      return null;
    }

    const token = await this._generateToken();
    if (token === null) {
      return null;
    }

    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    await this.prisma.accounts.update({
      where: {
        id,
      },
      data: {
        token,
        tokenExp: expires,
      },
    });

    return token;
  }

  async isAccessActive(token: string, level?: Roles): Promise<boolean> {
    const account = await this.prisma.accounts.findFirst({
      where: {
        token,
      },
    });

    if (account === null) {
      return false;
    }

    if (account.tokenExp === null) {
      return false;
    }

    if (account.tokenExp < new Date()) {
      return false;
    }

    if (level !== undefined) {
      if (level === 'USER') {
        if (account.role === 'USER' || account.role === 'DEVELOPER' || account.role === 'ADMIN') {
          return true;
        } else {
          return false;
        }
      } else if (level === 'DEVELOPER') {
        if (account.role === 'DEVELOPER' || account.role === 'ADMIN') {
          return true;
        } else {
          return false;
        }
      } else if (level === 'ADMIN') {
        if (account.role === 'ADMIN') {
          return true;
        } else {
          return false;
        }
      }
    }

    return true;
  }

  async _generateToken(): Promise<string | null> {
    let token: string | null = crypto.randomBytes(64).toString('hex');
    let created: boolean = false;
    let attempts: number = 0;

    while (!created) {
      const account = await this.prisma.accounts.findFirst({
        where: {
          token,
        },
      });

      if (account === null) {
        created = true;
      } else {
        token = crypto.randomBytes(64).toString('hex');
      }

      attempts++;

      if (attempts > 10) {
        return null;
      }
    }

    return token;
  }
}

export const accessManager = AccessManager.getInstance();
