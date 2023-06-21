import * as dotenv from 'dotenv';
import { logger } from './helpers/logger';
import { PrismaClient } from '@prisma/client';
import { serverManager } from './managers/server';
import Controllers from './controllers';

dotenv.config({ path: `${__dirname}/../../../../.env` });

logger.start();

const prisma = new PrismaClient();

Controllers(prisma);

serverManager.start(prisma);
