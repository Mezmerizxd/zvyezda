import { PrismaClient } from '@prisma/client';
import Endpoint from '../helpers/endpoint';
import { serverManager } from '../managers/server';
import { logger } from '../helpers/logger';

export default (prisma: PrismaClient): void => {
  Endpoint(serverManager.v1, '/get-socket-details', false, async (req) => {
    return {
      data: {
        socketUrl: process.env.SOCKET_HOST,
      },
    };
  });

  logger.loadedController('index');
};
