import { PrismaClient } from '@prisma/client';
import * as http from 'http';
import * as sckio from 'socket.io';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import { logger } from '../helpers/logger';
import * as WebSocket from 'ws';

class ServerManager {
  protected static instance: ServerManager;

  static getInstance(): ServerManager {
    if (!ServerManager.instance) {
      ServerManager.instance = new ServerManager();
    }
    return ServerManager.instance;
  }

  prisma: PrismaClient;
  _port: number;
  _http: http.Server;
  _io: sckio.Server;
  express: express.Application;
  socket: sckio.Namespace<Zvyezda.Socket.ClientToServer & Zvyezda.Socket.ServerToClient>;
  stream: WebSocket.Server;

  v1: express.Router;

  _staticFolderPath: string = '../../web';
  _isProduction: boolean;

  constructor() {
    this._isProduction = process.env.NODE_ENV === 'production';
    this.express = express();
    this._http = require('http').Server(this.express);
    this._io = new sckio.Server(this._http, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
    });
    this.v1 = express.Router();
    this.socket = this._io.of('/socket').use((socket: sckio.Socket, next: (err?: Error) => void) => {
      logger.incomingSocket(socket);
      next();
    });
    this.stream = new WebSocket.Server({
      port: 3005,
    });
    this._port = Number(process.env.PORT);
  }

  start(prisma: PrismaClient) {
    this.prisma = prisma;

    this.middlewares();
    this.renderer();

    this.express.use('/api/v1', this.v1);

    this._http.listen(this._port, (): void => {
      logger.info(`Server address http://localhost:${this._port}`);
    });
  }

  stop() {
    this._io.close();
    this._http.close();
    logger.info('Server stopped');
  }

  middlewares() {
    this.express.use((req: express.Request, res: express.Response, next) => {
      logger.incomingApi(req, res);
      next();
    });
    this.express.use(cors());
    this.express.use(bodyParser.json());
    this.express.use(
      bodyParser.json({
        limit: '50mb',
      }),
    );
    this.express.use(
      bodyParser.urlencoded({
        limit: '50mb',
        extended: false,
      }),
    );
  }

  renderer() {
    this.express.use(express.static(path.join(__dirname, `${this._staticFolderPath}/build`)));
    this.express.get('/*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(__dirname, `${this._staticFolderPath}/build/index.html`));
    });
  }
}

export const serverManager = ServerManager.getInstance();
