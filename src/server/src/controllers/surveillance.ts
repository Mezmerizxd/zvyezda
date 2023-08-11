import { PrismaClient } from '@prisma/client';
import Endpoint from '../helpers/endpoint';
import { serverManager } from '../managers/server';
import { logger } from '../helpers/logger';
import { surveillanceManager } from '../managers/surveillance';

export default (prisma: PrismaClient): void => {
  serverManager.stream.on('connection', (ws: any) => {
    logger.info('Connection to stream successful');

    let buffer = Buffer.alloc(8);
    buffer.write('jsmp');
    buffer.writeUInt16BE(0, 4);
    buffer.writeUInt16BE(0, 6);

    ws.send(buffer);

    surveillanceManager.clientConnect({ socketId: ws._socket.remoteAddress, streamId: 0 });

    ws.on('close', () => {
      surveillanceManager.clientDisconnect(ws._socket.remoteAddress);
      logger.info('Disconnection from stream successful');
    });
  });

  logger.loadedController('surveillance');
};
