import { Accounts, PrismaClient, Roles } from '@prisma/client';
import * as crypto from 'crypto';
import { logger } from '../helpers/logger';

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

    logger.info(`Access created for ${username} (${id})`);

    return token;
  }

  async isAccessActive(token: string, level?: Roles): Promise<{ active: boolean; account?: Accounts }> {
    const account = await this.prisma.accounts.findFirst({
      where: {
        token,
      },
    });

    if (account === null) {
      return { active: false };
    }

    if (account.tokenExp === null) {
      return { active: false };
    }

    if (account.tokenExp < new Date()) {
      return { active: false };
    }

    if (level !== undefined) {
      if (level === 'USER') {
        if (account.role === 'USER' || account.role === 'DEVELOPER' || account.role === 'ADMIN') {
          return { active: true, account };
        } else {
          return { active: false };
        }
      } else if (level === 'DEVELOPER') {
        if (account.role === 'DEVELOPER' || account.role === 'ADMIN') {
          return { active: true, account };
        } else {
          return { active: false };
        }
      } else if (level === 'ADMIN') {
        if (account.role === 'ADMIN') {
          return { active: true, account };
        } else {
          return { active: false };
        }
      }
    }

    return { active: true, account };
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
