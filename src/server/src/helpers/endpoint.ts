import * as express from 'express';
import { logger } from './logger';
import { inspect } from 'util';
import { accessManager } from '../managers/access';
import { Roles } from '@prisma/client';

function Endpoint<T extends keyof Zvyezda.Server.Apis>(
  version: express.Router,
  url: T,
  requireAuth: boolean,
  callback: (
    req: express.Request,
    auth?: string,
  ) => Promise<{
    server?: Zvyezda.Server.BaseResponse;
    data?: ReturnType<Zvyezda.Server.Apis[T]>;
  }>,
  accessLevel?: Roles,
): void {
  version.post(url, async (req, res) => {
    logger.debug(`Endpoint | Incoming: ${url} | ${inspect(req.body, { depth: 4, colors: true })}`);

    if (requireAuth) {
      const { authorization } = req.headers;
      if (!authorization) {
        res.json({
          server: {
            success: false,
            error: 'Authorization header not found',
          },
        });
        return;
      }

      const expired = await accessManager.isAccessActive(authorization, accessLevel);
      if (!expired) {
        res.json({
          server: {
            success: false,
            error: 'Access is expired',
          },
        });
        return;
      }

      const result = await callback(req, authorization);
      if (!result.server || result.server.success !== false) {
        result.server = {
          success: true,
        };
      }

      logger.debug(`Endpoint | Outgoing: ${url} | ${inspect(result, { depth: 4, colors: true })}`);
      res.json(result);
      return;
    }
    const result = await callback(req);
    if (!result.server || result.server.success !== false) {
      result.server = {
        success: true,
      };
    }

    logger.debug(`Endpoint | Outgoing: ${url} | ${inspect(result, { depth: 4, colors: true })}`);
    res.json(result);
  });
}

export default Endpoint;
