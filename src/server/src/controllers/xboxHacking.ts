import { PrismaClient } from '@prisma/client';
import Endpoint from '../helpers/endpoint';
import { serverManager } from '../managers/server';
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
      images,
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
        images: images ? images : undefined,
      },
    });

    return {
      data: {},
    };
  });

  Endpoint(serverManager.v1, '/xbox-hacking/delete', true, async (req) => {
    const { id } = req.body;

    if (!id) {
      return {
        data: {
          success: false,
          error: 'Missing required fields',
        },
      };
    }

    await prisma.hackedXboxs.delete({
      where: {
        id,
      },
    });

    return {
      data: {},
    };
  });

  Endpoint(serverManager.v1, '/xbox-hacking/edit', true, async (req) => {
    const { xbox }: { xbox: Zvyezda.Client.HackedConsole } = req.body;

    if (!xbox?.id) {
      return {
        data: {
          success: false,
          error: 'Missing required fields',
        },
      };
    }

    if (
      !xbox.title ||
      !xbox.description ||
      !xbox.serialNumber ||
      !xbox.xboxType ||
      !xbox.xboxColour ||
      !xbox.motherboardType ||
      !xbox.nandSize ||
      !xbox.mfrDate ||
      !xbox.model ||
      !xbox.rghVersion ||
      !xbox.rghGlitchType
    ) {
      return {
        data: {
          success: false,
          error: 'Missing required fields',
        },
      };
    }

    await prisma.hackedXboxs.update({
      where: {
        id: xbox.id,
      },
      data: {
        title: xbox.title,
        description: xbox.description,
        serialNumber: xbox.serialNumber,
        xboxType: xbox.xboxType,
        xboxColour: xbox.xboxColour,
        motherboardType: xbox.motherboardType,
        nandSize: xbox.nandSize,
        mfrDate: new Date(xbox.mfrDate),
        model: xbox.model,
        rghVersion: xbox.rghVersion,
        rghGlitchType: xbox.rghGlitchType,
        images: xbox.images ? xbox.images : [],
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

  Endpoint(serverManager.v1, '/xbox-hacking/get-public-consoles', false, async (req) => {
    const consoles = await prisma.hackedXboxs.findMany();

    return {
      data: {
        consoles,
      },
    };
  });

  logger.loadedController('xboxHacking');
};
