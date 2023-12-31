import { logger } from '../helpers/logger';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { serverManager } from './server';
import { Accounts, PrismaClient } from '@prisma/client';

class SurveillanceManager {
  protected static instance: SurveillanceManager;

  static getInstance(): SurveillanceManager {
    if (!SurveillanceManager.instance) {
      SurveillanceManager.instance = new SurveillanceManager();
    }
    return SurveillanceManager.instance;
  }

  prisma: PrismaClient;

  streams: Zvyezda.Server.Managers.Surveillance.Stream[] | null;

  stream: ChildProcessWithoutNullStreams | null;
  running: boolean;
  clients: { socketId: string; account: Accounts }[] | null;
  currentStream: Zvyezda.Server.Managers.Surveillance.Stream | null;

  ffmpegPath: string;

  streamProcessRuntime: NodeJS.Timeout;

  constructor() {
    this.ffmpegPath = 'ffmpeg';

    this.streams = null;
    this.stream = null;
    this.running = false;
    this.clients = null;
    this.currentStream = null;
  }

  async start(prisma: PrismaClient): Promise<void> {
    this.prisma = prisma;

    const streams = await prisma.surveillance.findMany();
    if (streams) {
      streams.forEach((stream) => {
        this.createStream(stream.name, {
          url: stream.url,
          ffmpegOptions: {
            '-f': 'mpegts',
            '-codec:v': 'mpeg1video',
            '-b:v': '1000k',
            '-stats': '',
            '-r': 25,
            '-s': '640x480',
            '-bf': 0,
            '-codec:a': 'mp2',
            '-ar': 44100,
            '-ac': 1,
            '-b:a': '128k',
          },
        });
      });
    }

    this.handler();
  }

  stop(): void {
    clearInterval(this.streamProcessRuntime);
  }

  createStream(name: string, options: { url: string; ffmpegOptions?: Record<string, any> }) {
    let additionalFlags = [];

    if (options.ffmpegOptions) {
      for (const key in options.ffmpegOptions) {
        additionalFlags.push(key);
        if (String(options.ffmpegOptions[key]) !== '') {
          additionalFlags.push(String(options.ffmpegOptions[key]));
        }
      }
    }

    let spawnOptions = [
      '-rtsp_transport',
      'tcp',
      '-i',
      options.url,
      '-f',
      'mpegts',
      '-codec:v',
      'mpeg1video',
      ...additionalFlags,
      '-',
    ];

    if (this.streams) {
      this.streams.push({
        id: this.streams.length,
        name: name,
        args: spawnOptions,
      });
    } else {
      this.streams = [
        {
          id: 0,
          name: name,
          args: spawnOptions,
        },
      ];
    }
  }

  handler(): void {
    this.streamProcessRuntime = setInterval(async () => {
      // If there are No Clients
      if (!this.clients) {
        // Make sure stream is not running
        if (this.running && this.stream) {
          // Kill the stream
          this.killStream();
        }
      }
    }, 5000);
  }

  startStream(stream: Zvyezda.Server.Managers.Surveillance.Stream): void {
    logger.debug(`Surveillance: startStream ${stream.name}`);

    if (this.running && this.stream) {
      this.killStream();
    }

    this.currentStream = stream;

    const instance = spawn(this.ffmpegPath, stream.args, {
      detached: false,
    });

    if (instance) {
      this.running = true;
      this.stream = instance;
    }

    if (this.running && this.stream) {
      if (this.stream?.stdout) {
        this.stream?.stdout?.on('data', (data: any) => {
          // @ts-ignore
          for (let client of serverManager.stream.clients) {
            if (client.readyState === 1) {
              client.send(data);
            }
          }
          return;
        });
        this.stream?.on('exit', (code: number | null, signal: NodeJS.Signals | null) => {
          this.killStream();
          if (code === 1) {
            logger.warn(`Surveillance: ${this.currentStream?.name} exited with error`);
            return;
          }
        });
      }
    }
  }

  killStream(): void {
    logger.debug(`Surveillance: killStream ${this.currentStream?.name}`);

    try {
      if (this.stream) {
        this.stream.kill();
      }
    } catch (e) {
      logger.error('Surveillance: Failed to kill stream.', e);
    }

    this.running = false;
    this.stream = null;
    this.currentStream = null;
  }

  onClientConnect(socketId: string, account: Accounts): void {
    if (this.clients) {
      let cancel = false;
      this.clients.forEach((client) => {
        if (client.account.id === account.id) {
          cancel = true;
        }
      });
      if (!cancel) {
        this.clients?.push({
          socketId,
          account,
        });
      }
    } else {
      this.clients = [
        {
          socketId,
          account,
        },
      ];
    }
  }

  onClientDisconnect(socketId: string, account: Accounts): void {
    if (this.clients) {
      let newClients: { socketId: string; account: Accounts }[] = [];
      this.clients.forEach((client) => {
        if (client.account.id !== account.id) {
          newClients.push(client);
        }
      });
      if (newClients.length > 0) {
        this.clients = newClients;
      } else {
        this.clients = null;
      }
    }
  }

  async addSource(name: string, url: string): Promise<void> {
    const streamExists = await this.prisma.surveillance.findFirst({
      where: {
        url: url,
      },
    });
    if (streamExists) return;

    await this.prisma.surveillance.create({
      data: {
        name,
        url,
      },
    });

    this.createStream(name, { url });
  }
}

export const surveillanceManager = SurveillanceManager.getInstance();
