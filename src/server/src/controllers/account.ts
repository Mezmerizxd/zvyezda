import { PrismaClient } from '@prisma/client';
import Endpoint from '../helpers/endpoint';
import { serverManager } from '../managers/server';
import { accessManager } from '../managers/access';
import { logger } from '../helpers/logger';
import { hashPassword } from '../helpers/utils';

export default (prisma: PrismaClient): void => {
  Endpoint(serverManager.v1, '/account/login', false, async (req) => {
    const { username, password }: { username: string; password: string } = req.body;

    if (username === undefined || username === null || username === '') {
      return {
        server: {
          success: false,
          error: 'Username is required',
        },
      };
    }

    if (password === undefined || password === null || password === '') {
      return {
        server: {
          success: false,
          error: 'Password is required',
        },
      };
    }

    const account = await prisma.accounts.findFirst({
      where: {
        username,
      },
    });

    if (account === null) {
      return {
        server: {
          success: false,
          error: 'Account not found',
        },
      };
    }

    const hash = hashPassword(password);
    if (account.password !== hash) {
      return {
        server: {
          success: false,
          error: 'Invalid password',
        },
      };
    }

    const token = await accessManager.createAccess(account);
    if (token === null) {
      return {
        server: {
          success: false,
          error: 'Something went wrong',
        },
      };
    }

    return {
      data: {
        token,
      },
    };
  });

  Endpoint(serverManager.v1, '/account/check-token', false, async (req) => {
    const { token }: { token: string } = req.body;

    if (token === undefined || token === null || token === '') {
      return {
        server: {
          success: false,
          error: 'Token is required',
        },
      };
    }

    const valid = await accessManager.isAccessActive(token);

    return {
      data: {
        valid,
      },
    };
  });

  Endpoint(serverManager.v1, '/account/get-profile', true, async (req, authorization) => {
    const account = await prisma.accounts.findFirst({
      where: {
        token: authorization,
      },
    });

    if (account === null) {
      return {
        server: {
          success: false,
          error: 'Account not found',
        },
      };
    }

    return {
      data: {
        id: account.id,
        username: account.username,
        email: account.email,
        avatar: null,
      },
    };
  });

  logger.loadedController('account');
};
