import * as colors from 'colors';
import * as fs from 'fs';
import * as express from 'express';
import { Socket } from 'socket.io';

class Logger {
  protected static instance: Logger;

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  _isProduction: boolean;
  _isInBuild: boolean;

  constructor() {
    this._isProduction = process.env.MODE === 'production' ? true : false;
    this._isInBuild = __dirname.includes('build') ? true : false;
  }

  start() {
    if (this._isProduction || this._isInBuild) {
      if (!fs.existsSync(`${__dirname}/../../../logs`)) {
        fs.mkdirSync(`${__dirname}/../../../logs`);
      }
    } else {
      if (!fs.existsSync(`${__dirname}/../../../../logs`)) {
        fs.mkdirSync(`${__dirname}/../../../../logs`);
      }
    }
  }

  stop() {}

  _save(...args: any[]) {
    try {
      const date = new Date();
      const fileName = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.log`;

      args.unshift(`[${process.env.MODE}]`);
      args.unshift(`[${date.toLocaleString()}]`);

      if (this._isProduction || this._isInBuild) {
        fs.appendFileSync(`${__dirname}/../../../logs/${fileName}`, args.join(' ') + '\n');
      } else {
        fs.appendFileSync(`${__dirname}/../../../../logs/${fileName}`, args.join(' ') + '\n');
      }
    } catch (error) {
      throw error;
    }
  }

  _getAllLogs(): Zvyezda.Server.Helpers.Log[] {
    try {
      const logs: Zvyezda.Server.Helpers.Log[] = [];

      if (this._isProduction || this._isInBuild) {
        const files = fs.readdirSync(`${__dirname}/../../../logs`);
        for (const file of files) {
          const data = fs.readFileSync(`${__dirname}/../../../logs/${file}`, 'utf8');
          logs.push({
            id: logs.length + 1,
            date: file.replace('.log', ''),
            logs: data.split('\n'),
          });
        }
      } else {
        const files = fs.readdirSync(`${__dirname}/../../../../logs`);
        for (const file of files) {
          const data = fs.readFileSync(`${__dirname}/../../../../logs/${file}`, 'utf8');
          logs.push({
            id: logs.length + 1,
            date: file.replace('.log', ''),
            logs: data.split('\n'),
          });
        }
      }

      return logs;
    } catch (error) {
      throw error;
    }
  }

  info(...args: any[]) {
    console.log(colors.green('[INFO]'), ...args);
    this._save('[INFO]', ...args);
  }

  error(...args: any[]) {
    console.log(colors.red('[ERROR]'), ...args);
    this._save('[ERROR]', ...args);
  }

  warn(...args: any[]) {
    console.log(colors.yellow('[WARN]'), ...args);
    this._save('[WARN]', ...args);
  }

  debug(...args: any[]) {
    if (this._isProduction) return;
    console.log(colors.blue('[DEBUG]'), ...args);
    this._save('[DEBUG]', ...args);
  }

  fatal(...args: any[]) {
    console.log(colors.red('[FATAL]'), ...args);
    this._save('[FATAL]', ...args);
  }

  trace(...args: any[]) {
    console.log(colors.gray('[TRACE]'), ...args);
    this._save('[TRACE]', ...args);
  }

  log(...args: any[]) {
    console.log(colors.white('[LOG]'), ...args);
    this._save('[LOG]', ...args);
  }

  incomingApi(req: express.Request, res: express.Response) {
    console.log(colors.yellow('[API]'), colors.green(`${req.method} ${req.url}`));
    this._save('[API]', `${req.method} ${req.url}`);
  }

  incomingSocket(socket: Socket) {
    socket.onAny((...args: any[]) => {
      console.log(colors.yellow('[SOCKET]'), colors.green(socket.nsp.name), colors.blue(socket.id), ...args);
      this._save('[SOCKET]', socket.nsp.name, socket.id, ...args);
    });
  }

  loadedController(name: string) {
    console.log(colors.yellow('[CONTROLLER]'), colors.green(name), colors.green('loaded'));
    this._save('[CONTROLLER]', name, 'loaded');
  }
}

export const logger = Logger.getInstance();
