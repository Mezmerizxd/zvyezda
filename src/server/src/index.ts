import * as dotenv from 'dotenv';
import { logger } from './helpers/logger';
import { PrismaClient } from '@prisma/client';
import { serverManager } from './managers/server';
import { accessManager } from './managers/access';
import { seed } from './seed';
import Controllers from './controllers';

dotenv.config({ path: `${__dirname}/../../../../.env` });

logger.start();

const prisma = new PrismaClient();

Controllers(prisma);

serverManager.start(prisma);
accessManager.start(prisma);

seed.start(prisma);
