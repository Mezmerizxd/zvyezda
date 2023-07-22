import { PrismaClient, Roles } from '@prisma/client';
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
        role: account.role,
      },
    };
  });

  Endpoint(
    serverManager.v1,
    '/account/get-accounts',
    true,
    async () => {
      const accounts = await prisma.accounts.findMany();

      if (accounts === null) {
        return {
          server: {
            success: false,
            error: 'Account not found',
          },
        };
      }

      return {
        data: {
          accounts: accounts.map((account) => ({
            id: account.id,
            username: account.username,
            email: account.email,
            role: account.role,
            createdAt: account.createdAt.toDateString(),
          })),
        },
      };
    },
    'ADMIN',
  );

  Endpoint(
    serverManager.v1,
    '/account/delete-account',
    true,
    async (req, auth) => {
      const { userId }: { userId: string } = req.body;

      if (!userId) {
        return {
          server: {
            success: false,
            error: 'UserId is required',
          },
        };
      }

      const tbdAccount = await prisma.accounts.findFirst({
        where: {
          id: userId,
        },
      });

      if (!tbdAccount) {
        return {
          server: {
            success: false,
            error: 'Failed to find account',
          },
        };
      }

      if (tbdAccount?.token === auth) {
        await prisma.accounts.delete({
          where: {
            id: userId,
          },
        });
      } else {
        const account = await prisma.accounts.findFirst({
          where: {
            token: auth,
          },
        });

        if (!account) {
          return {
            server: {
              success: false,
              error: 'Failed to find deleter',
            },
          };
        }

        if (account.role === 'ADMIN') {
          await prisma.accounts.delete({
            where: {
              id: userId,
            },
          });

          return {};
        } else {
          return {
            server: {
              success: false,
              error: 'You do not have permission to do this',
            },
          };
        }
      }

      return {
        server: {
          success: false,
          error: 'Failed',
        },
      };
    },
    'USER',
  );

  Endpoint(
    serverManager.v1,
    '/account/edit-account',
    true,
    async (req, auth) => {
      const {
        userId,
        data,
      }: {
        userId: string;
        data?: {
          email?: string;
          username?: string;
          password?: string;
          cPassword?: string;
          role?: string;
          avatar?: string;
          biography?: string;
        };
      } = req.body;
      let isAdminEditting = false;

      if (!userId) {
        return {
          server: {
            success: false,
            error: 'UserId is required',
          },
        };
      }

      if (!data) {
        return {
          server: {
            success: false,
            error: 'Some data is required',
          },
        };
      }

      const tbuAccount = await prisma.accounts.findFirst({
        where: {
          id: userId,
        },
      });
      if (!tbuAccount) {
        return {
          server: {
            success: false,
            error: 'Failed to find account',
          },
        };
      }

      if (tbuAccount?.token !== auth) {
        const account = await prisma.accounts.findFirst({
          where: {
            token: auth,
          },
        });
        if (!account) {
          return {
            server: {
              success: false,
              error: 'Failed to find account',
            },
          };
        }

        if (account.role !== 'ADMIN') {
          return {
            server: {
              success: false,
              error: 'You do not have permission to edit this account',
            },
          };
        }
      }

      if (data.email && data.email !== '') {
        if (await prisma.accounts.findFirst({ where: { email: data.email } })) {
          return {
            server: {
              success: false,
              error: 'Email is already taken',
            },
          };
        }
      }
      if (data.username && data.username !== '') {
        if (await prisma.accounts.findFirst({ where: { username: data.username } })) {
          return {
            server: {
              success: false,
              error: 'Username is already taken',
            },
          };
        }
      }
      if (data.cPassword !== tbuAccount.password) {
        return {
          server: {
            success: false,
            error: 'Incorrect Password',
          },
        };
      }

      let newAccount: {
        email: string;
        username: string;
        password: string;
        role: any;
        avatar: string | null;
        biography: string | null;
      } = {
        email: tbuAccount.email,
        username: tbuAccount.username,
        password: tbuAccount.password,
        role: tbuAccount.role,
        avatar: tbuAccount.avatar,
        biography: tbuAccount.biography,
      };

      if ((data.role && data.role === 'USER') || 'DEVELOPER' || ('ADMIN' && isAdminEditting)) {
        newAccount.role = data.role;
      }

      await prisma.accounts.update({
        where: {
          id: userId,
        },
        data: {
          ...newAccount,
        },
      });

      return {};
    },
    'USER',
  );

  logger.loadedController('account');
};
