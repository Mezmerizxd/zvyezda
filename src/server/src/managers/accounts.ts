import { Accounts, PrismaClient, Roles } from '@prisma/client';
import * as crypto from 'crypto';
import { logger } from '../helpers/logger';
import { accessManager } from './access';
import { hashPassword } from '../helpers/utils';

class AccountsManager {
  protected static instance: AccountsManager;

  static getInstance(): AccountsManager {
    if (!AccountsManager.instance) {
      AccountsManager.instance = new AccountsManager();
    }
    return AccountsManager.instance;
  }

  prisma: PrismaClient;

  activeAccounts: Accounts[];
  createAccountPortals: string[] = [];

  constructor() {}

  start(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  stop() {}

  async login(username: string, password: string): Promise<{ account?: Accounts; error?: string }> {
    const account = await this.prisma.accounts.findFirst({
      where: {
        username: username,
      },
    });

    if (!account) {
      return { error: 'Account does not exist.' };
    }
    if (hashPassword(password) !== account.password) {
      return { error: 'Password does not match.' };
    }

    const access = await accessManager.createAccess(account);

    if (!access) {
      return { error: 'Failed to get access.' };
    }

    return {
      account: {
        ...account,
        token: access,
      },
    };
  }

  async create(
    email: string,
    username: string,
    password: string,
    role: Roles | null,
    avatar: string | null,
    biography: string | null,
  ): Promise<{ account?: Accounts; error?: string }> {
    const emailExists = await this.prisma.accounts.findFirst({
      where: {
        email,
      },
    });
    if (emailExists) {
      return { error: 'Email is in use.' };
    }
    const usernameExists = await this.prisma.accounts.findFirst({
      where: {
        username,
      },
    });
    if (usernameExists) {
      return { error: 'Username is in use.' };
    }

    const account = await this.prisma.accounts.create({
      data: {
        email,
        username,
        password: hashPassword(password),
        role: role ? role : 'USER',
        avatar,
        biography,
      },
    });

    if (!account) {
      return { error: 'Failed to create account' };
    }

    return { account: account };
  }

  async createWithPortal(
    token: string,
    email: string,
    username: string,
    password: string,
    role: Roles | null,
    avatar: string | null,
    biography: string | null,
  ): Promise<{ account?: Accounts; error?: string }> {
    if (!this.createAccountPortals?.includes(token)) {
      return { error: 'Invalid token' };
    }

    const account = await this.create(email, username, password, role, avatar, biography);

    if (account.error) {
      return { error: account.error };
    }

    this.deletePortalToken(token);

    return {
      account: account.account,
    };
  }

  createPortalToken(): string | null {
    let token: string | null = crypto.randomBytes(64).toString('hex');
    let created: boolean = false;
    let attempts: number = 0;
    while (!created) {
      let tokenExists = false;
      this.createAccountPortals?.forEach((t) => {
        if (t === token) tokenExists = true;
      });
      if (!tokenExists) created = true;
      else token = crypto.randomBytes(64).toString('hex');
      attempts++;
      if (attempts > 10) return null;
    }
    this.createAccountPortals?.push(token);
    return token;
  }

  deletePortalToken(token: string) {
    let newTokens = this.createAccountPortals.filter((t) => t !== token);
    this.createAccountPortals = newTokens;
  }
}

export const accountsManager = AccountsManager.getInstance();
