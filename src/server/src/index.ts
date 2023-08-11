import * as dotenv from 'dotenv';
import { logger } from './helpers/logger';
import { PrismaClient } from '@prisma/client';
import { serverManager } from './managers/server';
import { accessManager } from './managers/access';
import { versionManager } from './managers/version';
import { surveillanceManager } from './managers/surveillance';
import { seed } from './seed';
import Controllers from './controllers';
import { accountsManager } from './managers/accounts';

dotenv.config({ path: `${__dirname}/../../../../.env` });

logger.start();

const prisma = new PrismaClient();

Controllers(prisma);

versionManager.start();

serverManager.start(prisma);
accessManager.start(prisma);
accountsManager.start(prisma);
surveillanceManager.start();

seed.start(prisma);
