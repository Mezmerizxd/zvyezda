import { logger } from '../helpers/logger';
import { spawn } from 'child_process';
import { serverManager } from './server';

class SurveillanceManager {
  protected static instance: SurveillanceManager;

  static getInstance(): SurveillanceManager {
    if (!SurveillanceManager.instance) {
      SurveillanceManager.instance = new SurveillanceManager();
    }
    return SurveillanceManager.instance;
  }

  streams: Zvyezda.Server.Managers.Surveillance.Stream[];

  ffmpegPath: string;

  streamProcessRuntime: NodeJS.Timeout;
  streamRuntime: NodeJS.Timeout;

  constructor() {
    this.streams = [];
    this.ffmpegPath = 'ffmpeg';
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
    clearInterval(this.streamRuntime);
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

    this.streams.push({
      id: this.streams.length || 0,
      name: name,
      args: spawnOptions,
      clients: null,
      running: false,
      stream: null,
    });
  }

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

  startStream(stream: Zvyezda.Server.Managers.Surveillance.Stream): void {
    logger.debug(`Surveillance: startStream ${stream.name}`);
    if (!this.streams[stream.id].running && !this.streams[stream.id].stream) {
      const instance = spawn(this.ffmpegPath, stream.args, {
        detached: false,
      });

      if (instance) {
        this.streams[stream.id].running = true;
        this.streams[stream.id].stream = instance;
      }
    } else {
      logger.warn(`Surveillance: Stream ${stream.name} is already running`);
    }
  }

  killStream(stream: Zvyezda.Server.Managers.Surveillance.Stream): void {
    logger.debug(`Surveillance: killStream ${stream.name}`);
    if (this.streams[stream.id].running && this.streams[stream.id].stream) {
      this.streams[stream.id].stream.kill();

      this.streams[stream.id].running = false;
      this.streams[stream.id].stream = null;
    }
  }

  clientConnect({ socketId, streamId }: Zvyezda.Server.Managers.Surveillance.Client): void {
    if (this.streams[streamId] && !this.streams[streamId].running && !this.streams[streamId].stream) {
      this.startStream(this.streams[streamId]);
    }
    if (this.streams[streamId].clients) {
      this.streams[streamId].clients?.push({
        socketId,
        streamId,
      });
    } else {
      this.streams[streamId].clients = [
        {
          socketId,
          streamId,
        },
      ];
    }
  }

  clientDisconnect(socketId: string): void {
    if (this.streams) {
      this.streams.forEach((stream) => {
        if (stream.clients) {
          let newClients: Zvyezda.Server.Managers.Surveillance.Client[] = [];
          stream.clients.forEach((client) => {
            if (client.socketId !== socketId) {
              newClients.push(client);
            }
          });
          if (newClients.length > 0) {
            this.streams[stream.id].clients = newClients;
          } else {
            this.streams[stream.id].clients = null;
          }
        }
      });
    }
  }

  getStreamById(id: number): Zvyezda.Server.Managers.Surveillance.Stream | null {
    if (this.streams?.length > 0) {
      this.streams.forEach((stream) => {
        if (stream.id === id) {
          return stream;
        }
      });
    }
    return null;
  }

  getClientBySocketId(): Zvyezda.Server.Managers.Surveillance.Client | null {
    return null;
  }
}

export const surveillanceManager = SurveillanceManager.getInstance();
