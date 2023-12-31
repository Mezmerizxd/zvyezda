import { PrismaClient, Roles } from '@prisma/client';
import Endpoint from '../helpers/endpoint';
import { serverManager } from '../managers/server';
import { accessManager } from '../managers/access';
import { logger } from '../helpers/logger';
import { hashPassword } from '../helpers/utils';
import { accountsManager } from '../managers/accounts';
import { accounts } from '../seed/data';

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

    const account = await accountsManager.login(username, password);
    if (account.account === undefined) {
      return {
        server: {
          success: false,
          error: account.error,
        },
      };
    }
    if (account.account.token === null) {
      return {
        server: {
          success: false,
          error: 'Failed to get token',
        },
      };
    }

    return {
      data: {
        token: account.account.token,
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
    if (!valid) {
      return {
        data: {
          valid: false,
        },
      };
    }

    return {
      data: {
        valid: valid.active,
      },
    };
  });

  Endpoint(serverManager.v1, '/account/get-profile', true, async (req, account) => {
    if (!account) {
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
    '/account/create',
    true,
    async (req) => {
      const { email, username, password, avatar, biography, role }: Zvyezda.Client.User = req.body;

      if (!email) {
        return {
          server: {
            success: false,
            error: 'Email is required',
          },
        };
      }
      if (!username) {
        return {
          server: {
            success: false,
            error: 'Username is required',
          },
        };
      }
      if (!password) {
        return {
          server: {
            success: false,
            error: 'Password is required',
          },
        };
      }

      await accountsManager.create(
        email,
        username,
        password,
        role as Roles,
        avatar ? avatar : null,
        biography ? biography : null,
      );

      return {
        data: {},
      };
    },
    'ADMIN',
  );

  Endpoint(
    serverManager.v1,
    '/account/delete',
    true,
    async (req, account) => {
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

      if (tbdAccount?.token === account?.token) {
        await prisma.accounts.delete({
          where: {
            id: userId,
          },
        });
      } else {
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
    '/account/edit',
    true,
    async (req, account) => {
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

      if (tbuAccount?.token !== account?.token) {
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

  Endpoint(serverManager.v1, '/account/create-account-portal', false, async (req) => {
    const {
      token,
      email,
      username,
      password,
      role,
      avatar,
      biography,
    }: {
      token: string;
      email: string;
      username: string;
      password: string;
      role?: string;
      avatar?: string;
      biography?: string;
    } = req.body;

    if (!token || token === '') {
      return {
        server: {
          success: false,
          error: 'You do not have access',
        },
      };
    }

    if (email === null || email === undefined || email === '') {
      return {
        server: {
          success: false,
          error: 'Email is required',
        },
      };
    }
    if (username === null || username === undefined || username === '') {
      return {
        server: {
          success: false,
          error: 'Username is required',
        },
      };
    }
    if (password === null || password === undefined || password === '') {
      return {
        server: {
          success: false,
          error: 'Password is required',
        },
      };
    }

    const account = await accountsManager.createWithPortal(
      token,
      email,
      username,
      password,
      role as Roles,
      avatar ?? null,
      biography ?? null,
    );

    if (account.error) {
      return {
        server: {
          success: false,
          error: account.error,
        },
      };
    }

    if (!account.account) {
      return {
        server: {
          success: false,
          error: 'Failed to get account',
        },
      };
    }

    const access = await accessManager.createAccess(account.account);

    if (!access) {
      return {
        server: {
          success: false,
          error: 'Failed to get token',
        },
      };
    }

    return {
      data: {
        token: access,
      },
    };
  });

  Endpoint(
    serverManager.v1,
    '/account/create-portal-token',
    true,
    async (req, auth) => {
      const token = accountsManager.createPortalToken();
      if (token === null) {
        return {
          server: {
            success: false,
            error: 'Failed to create portal token',
          },
        };
      }

      return {
        data: {
          token,
        },
      };
    },
    'ADMIN',
  );

  Endpoint(
    serverManager.v1,
    '/account/get-portal-tokens',
    true,
    async (req) => {
      return { data: { tokens: accountsManager.createAccountPortals } };
    },
    'ADMIN',
  );

  Endpoint(
    serverManager.v1,
    '/account/delete-portal-token',
    true,
    async (req) => {
      const { token }: { token: string } = req.body;
      accountsManager.deletePortalToken(token);
      return { data: {} };
    },
    'ADMIN',
  );

  logger.loadedController('account');
};
