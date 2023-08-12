import { PrismaClient } from '@prisma/client';
import Endpoint from '../helpers/endpoint';
import { serverManager } from '../managers/server';
import { logger } from '../helpers/logger';
import { surveillanceManager } from '../managers/surveillance';
import { accessManager } from '../managers/access';

export default (prisma: PrismaClient): void => {
  serverManager.stream.on('connection', (ws: any) => {
    let buffer = Buffer.alloc(8);
    buffer.write('jsmp');
    buffer.writeUInt16BE(0, 4);
    buffer.writeUInt16BE(0, 6);

    ws.send(buffer);
  });

  serverManager.socket.on('connection', (s) => {
    s.on('joinStream', async (data) => {
      const expired = await accessManager.isAccessActive(data.authorization, 'USER');
      if (!expired) {
        s.emit('socketError', {
          error: 'Access is expired',
        });
        return;
      }

      surveillanceManager.clientConnect({ socketId: s.id, streamId: 0 });

      logger.debug('Surveillance: Successful connection to socket');
      s.join('stream');
    });

    s.on('leaveStream', () => {
      surveillanceManager.clientDisconnect(s.id);
      logger.debug('Surveillance: Successful disconnection to socket');
      s.leave('stream');
    });
  });

  logger.loadedController('surveillance');
};
