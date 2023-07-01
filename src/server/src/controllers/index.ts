import { PrismaClient } from '@prisma/client';
import Endpoint from '../helpers/endpoint';
import { serverManager } from '../managers/server';
import { versionManager } from '../managers/version';
import { logger } from '../helpers/logger';

import AccountController from './account';

export default (prisma: PrismaClient): void => {
  Endpoint(serverManager.v1, '/get-version', false, async (req) => {
    return {
      data: {
        server: versionManager.serverVersion,
        client: versionManager.clientVersion,
      },
    };
  });

  Endpoint(serverManager.v1, '/get-socket-details', false, async (req) => {
    return {
      data: {
        socketUrl: process.env.SOCKET_HOST,
      },
    };
  });

  logger.loadedController('index');
  AccountController(prisma);
};
