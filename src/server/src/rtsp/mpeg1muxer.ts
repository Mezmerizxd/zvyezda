import { spawn } from 'child_process';
import { inherits } from 'util';
import { EventEmitter } from 'events';
import * as events from 'events';
import * as util from 'util';

interface Mpeg1MuxerOptions {
  url: string;
  ffmpegOptions?: Record<string, string>;
  ffmpegPath: string;
}

export default class Mpeg1Muxer extends EventEmitter {
  url: string;
  ffmpegOptions?: Record<string, string>;
  exitCode?: number;
  additionalFlags: string[];
  spawnOptions: string[];
  stream: ReturnType<typeof spawn>;
  inputStreamStarted: boolean;

  constructor(options: Mpeg1MuxerOptions) {
    super();
    this.url = options.url;
    this.ffmpegOptions = options.ffmpegOptions;
    this.exitCode = undefined;
    this.additionalFlags = [];
    if (this.ffmpegOptions) {
      for (const key in this.ffmpegOptions) {
        this.additionalFlags.push(key);
        if (String(this.ffmpegOptions[key]) !== '') {
          this.additionalFlags.push(String(this.ffmpegOptions[key]));
        }
      }
    }
    this.spawnOptions = [
      '-rtsp_transport',
      'tcp',
      '-i',
      this.url,
      '-f',
      'mpegts',
      '-codec:v',
      'mpeg1video',
      // additional ffmpeg options go here
      ...this.additionalFlags,
      '-',
    ];
    this.stream = spawn(options.ffmpegPath, this.spawnOptions, {
      detached: false,
    });
    this.inputStreamStarted = true;
    this.stream?.stdout?.on('data', (data) => {
      return this.emit('mpeg1data', data);
    });
    this.stream.on('exit', (code: number | null, signal: NodeJS.Signals | null) => {
      if (code === 1) {
        console.error('RTSP stream exited with error');
        this.exitCode = 1;
        return this.emit('exitWithError');
      }
    });
    return this;
  }
}
