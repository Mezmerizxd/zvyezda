import { logger } from '../helpers/logger';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { serverManager } from './server';
import { Accounts } from '@prisma/client';

class SurveillanceManager {
  protected static instance: SurveillanceManager;

  static getInstance(): SurveillanceManager {
    if (!SurveillanceManager.instance) {
      SurveillanceManager.instance = new SurveillanceManager();
    }
    return SurveillanceManager.instance;
  }

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

  start() {
    this.createStream('test', {
      url: 'rtsp://192.168.0.127:8554/test',
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

    this.handler();
  }

  stop() {
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

  handler() {
    this.streamProcessRuntime = setInterval(async () => {
      // If there are No Clients
      if (!this.clients) {
        // Make sure stream is not running
        if (this.running && this.stream) {
          // Kill the stream
          this.killStream();
        }
      }

      logger.debug(
        `Surveillance: Stream: ${this.stream ? 'true' : 'false'}, Running: ${this.running ? 'true' : 'false'}`,
      );
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

  onClientDisconnect(socketId: string): void {
    if (this.clients) {
      let newClients: { socketId: string; account: Accounts }[] = [];
      this.clients.forEach((client) => {
        if (client.socketId !== socketId) {
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
}

export const surveillanceManager = SurveillanceManager.getInstance();

/*
This handler function allows multiple streams to run at the same time,
but it's useless for now as WebSocket does not have Namespaces,
so you can't have multiple streams without having to use multiple
ports and that's complicated

handler() {
  this.streamProcessRuntime = setInterval(async () => {
    if (this.streams) {
      this.streams.forEach((stream) => {
        // If Clients are Connected
        if (stream.clients && stream.clients.length > 0) {
          // Make sure stream is running
          if (!stream.running && !stream.stream) {
            // Start the stream
            this.startStream(stream);
          }
        }

        // If there are No Clients
        if (!stream?.clients || stream?.clients?.length < 0) {
          // Make sure stream is not running
          if (stream.running || stream.stream) {
            // Kill the stream
            this.killStream(stream);
          }
        }

        logger.debug(
          `Surveillance: Stream: ${stream.stream ? 'true' : 'false'}, Running: ${stream.running ? 'true' : 'false'}`,
        );
      });
    }
  }, 5000);

  this.streamRuntime = setInterval(async () => {
    if (this.streams) {
      this.streams.forEach((stream) => {
        if (this.streams[stream.id].running) {
          if (this.streams[stream.id].stream?.stdout) {
            this.streams[stream.id].stream?.stdout?.on('data', (data: any) => {
              // @ts-ignore
              for (let client of serverManager.stream.clients) {
                if (client.readyState === 1) {
                  client.send(data);
                }
              }
              return;
            });
            this.streams[stream.id].stream?.on('exit', (code: number | null, signal: NodeJS.Signals | null) => {
              if (code === 1) {
                logger.warn(`Surveillance: ${stream.name} exited with error`);
                return;
              }
            });
          }
        }

        if (this.streams[stream.id].stream) {
          clearTimeout(this.streamRuntime);
        }
      });
    }
  }, 1000);
}

*/
