import { PrismaClient } from '@prisma/client';
import { serverManager } from '../managers/server';
import { logger } from '../helpers/logger';
import Endpoint from '../helpers/endpoint';

export default (prisma: PrismaClient): void => {
  serverManager.socket.on('connection', (s) => {
    s.on('joinDiscussion', async (data) => {
      const account = await prisma.accounts.findFirst({
        where: {
          token: data.authorization,
        },
      });

      if (account === null) {
        logger.debug('Invalid token');
        s.emit('socketError', {
          error: 'Invalid token',
        });
        return;
      }

      s.join('discussion');
    });

    s.on('leaveDiscussion', () => {
      s.leave('discussion');
    });

    s.on('sendDiscussionMessage', async (data) => {
      const account = await prisma.accounts.findFirst({
        where: {
          token: data.authorization,
        },
      });

      if (account === null || account.username === null) {
        logger.debug('Invalid token');
        s.emit('socketError', {
          error: 'Invalid token',
        });
        return;
      }

      if (data.replyTo !== undefined && data.replyTo !== null) {
        const replyTo = await prisma.discussion.findFirst({
          where: {
            id: data.replyTo,
          },
        });

        if (replyTo === null) {
          logger.debug('Invalid replyTo');
          s.emit('socketError', {
            error: 'Invalid replyTo',
          });
          return;
        }

        const message = await prisma.discussion.create({
          data: {
            message: data.message,
            username: account.username,
            avatar: null,
            replyTo: data.replyTo,
          },
        });
        if (message === null) {
          logger.debug('Failed to send message');
          s.emit('socketError', {
            error: 'Failed to send message',
          });
          return;
        }
        serverManager.socket.to('discussion').emit('discussionMessage', {
          id: message.id,
          message: message.message,
          username: message.username,
          createdAt: message.createdAt,
          replyTo: {
            id: replyTo.id,
            message: replyTo.message,
            username: replyTo.username,
            createdAt: replyTo.createdAt,
          },
        });
      } else {
        const message = await prisma.discussion.create({
          data: {
            message: data.message,
            username: account.username,
            avatar: null,
          },
        });
        if (message === null) {
          logger.debug('Failed to send message');
          s.emit('socketError', {
            error: 'Failed to send message',
          });
          return;
        }
        serverManager.socket.to('discussion').emit('discussionMessage', {
          id: message.id,
          message: message.message,
          username: message.username,
          createdAt: message.createdAt,
        });
      }
    });
  });

  Endpoint(serverManager.v1, '/discussion/get-messages', true, async (req) => {
    const rawMessages = await prisma.discussion.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      data: {
        messages: rawMessages.map((m) => ({
          id: m.id,
          message: m.message,
          username: m.username,
          createdAt: m.createdAt,
        })),
      },
    };
  });

  logger.loadedController('discussion');
};
