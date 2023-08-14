import { PrismaClient } from '@prisma/client';
import Endpoint from '../helpers/endpoint';
import { serverManager } from '../managers/server';
import { versionManager } from '../managers/version';
import { logger } from '../helpers/logger';

import AccountController from './account';
import XboxHackingController from './xboxHacking';
import Discussion from './discussion';
import Surveillance from './surveillance';
import * as process from 'process';

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
        streamUrl: process.env.STREAM_HOST,
      },
    };
  });

  logger.loadedController('index');
  AccountController(prisma);
  XboxHackingController(prisma);
  Discussion(prisma);
  Surveillance(prisma);
};
