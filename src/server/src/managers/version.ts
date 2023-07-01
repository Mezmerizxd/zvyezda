import { logger } from '../helpers/logger';
import * as path from 'path';
import * as fs from 'fs';

class VersionManager {
  protected static instance: VersionManager;

  static getInstance(): VersionManager {
    if (!VersionManager.instance) {
      VersionManager.instance = new VersionManager();
    }
    return VersionManager.instance;
  }

  serverVersion: string;
  clientVersion: string;

  _mode: string | undefined;
  _serverPackagePath: string;
  _clientPackagePath: string;

  constructor() {
    this._mode = process.env.MODE;
    if (!this._mode) logger.error('NODE_ENV is not defined');

    if (this._mode === 'development') {
      this._serverPackagePath = path.join(__dirname, '../../package.json');
      this._clientPackagePath = path.join(__dirname, '../../../web/package.json');
    }

    if (this._mode === 'production') {
      this._serverPackagePath = path.join(__dirname, '../package.json');
      this._clientPackagePath = path.join(__dirname, '../../web/package.json');
    }
  }

  start() {
    try {
      const serverPackage = JSON.parse(fs.readFileSync(this._serverPackagePath, 'utf8'));
      const clientPackage = JSON.parse(fs.readFileSync(this._clientPackagePath, 'utf8'));

      this.serverVersion = serverPackage.version;
      if (!this.serverVersion) logger.error('Server version is not defined');
      this.clientVersion = clientPackage.version;
      if (!this.clientVersion) logger.error('Client version is not defined');
    } catch (error) {
      logger.error(error);
    }

    logger.info(`Server version: ${this.serverVersion}`);
    logger.info(`Client version: ${this.clientVersion}`);
  }

  stop() {}
}

export const versionManager = VersionManager.getInstance();
