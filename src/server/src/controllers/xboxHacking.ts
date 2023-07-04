import { PrismaClient } from '@prisma/client';
import Endpoint from '../helpers/endpoint';
import { serverManager } from '../managers/server';
import { versionManager } from '../managers/version';
import { logger } from '../helpers/logger';

export default (prisma: PrismaClient): void => {
  Endpoint(serverManager.v1, '/xbox-hacking/create', true, async (req) => {
    const {
      title,
      description,
      serialNumber,
      xboxType,
      xboxColour,
      motherboardType,
      nandSize,
      mfrDate,
      model,
      rghVersion,
      rghGlitchType,
    }: Zvyezda.Client.HackedConsole = req.body;

    if (
      !title ||
      !description ||
      !serialNumber ||
      !xboxType ||
      !xboxColour ||
      !motherboardType ||
      !nandSize ||
      !mfrDate ||
      !model ||
      !rghVersion ||
      !rghGlitchType
    ) {
      return {
        data: {
          success: false,
          error: 'Missing required fields',
        },
      };
    }

    const xbox = await prisma.hackedXboxs.create({
      data: {
        title,
        description,
        serialNumber,
        xboxType,
        xboxColour,
        motherboardType,
        nandSize,
        mfrDate: new Date(mfrDate),
        model,
        rghVersion,
        rghGlitchType,
      },
    });

    return {
      data: {},
    };
  });

  Endpoint(serverManager.v1, '/xbox-hacking/get-consoles', true, async (req) => {
    const consoles = await prisma.hackedXboxs.findMany();

    return {
      data: {
        consoles,
      },
    };
  });

  logger.loadedController('xboxHacking');
};
