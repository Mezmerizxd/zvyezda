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
    function updateClient() {
      s.emit('receiveStreamData', {
        streams: surveillanceManager.streams || null,
        currentStream: surveillanceManager.currentStream || null,
        running: surveillanceManager.running,
      });
    }

    s.on('joinStream', async (data) => {
      const expired = await accessManager.isAccessActive(data.authorization, 'USER');
      if (!expired) {
        s.emit('socketError', {
          error: 'Access is expired',
        });
        return;
      }

      const account = await prisma.accounts.findFirst({
        where: {
          token: data.authorization,
        },
      });
      if (!account) {
        s.emit('socketError', {
          error: 'Failed to get account',
        });
        return;
      }

      s.join('stream');

      surveillanceManager.onClientConnect(s.id, account);
      updateClient();

      logger.debug('Surveillance: Successful connection to socket');
    });

    s.on('leaveStream', () => {
      surveillanceManager.onClientDisconnect(s.id);
      updateClient();
      s.leave('stream');

      logger.debug('Surveillance: Successful disconnection to socket');
    });

    s.on('getStreamData', () => {
      updateClient();
    });

    s.on('startStream', (data) => {
      surveillanceManager.startStream(data);
      updateClient();
    });
  });

  logger.loadedController('surveillance');
};
