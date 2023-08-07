import * as dotenv from 'dotenv';
import { logger } from './helpers/logger';
import { PrismaClient } from '@prisma/client';
import { serverManager } from './managers/server';
import { accessManager } from './managers/access';
import { versionManager } from './managers/version';
import { seed } from './seed';
import Controllers from './controllers';
import { accountsManager } from './managers/accounts';
import Stream from './rtsp/videostream';

dotenv.config({ path: `${__dirname}/../../../../.env` });

logger.start();

const prisma = new PrismaClient();

Controllers(prisma);

versionManager.start();

serverManager.start(prisma);
accessManager.start(prisma);
accountsManager.start(prisma);

seed.start(prisma);

const stream = new Stream({
  height: 0,
  width: 0,
  name: 'Bunny',
  // streamUrl: "rtsp://YOUR_IP:PORT",
  streamUrl: 'rtsp://192.168.0.127:8554/test',
  wsPort: 6789,
  ffmpegOptions: {
    // options ffmpeg flags
    '-f': 'mpegts', // output file format.
    '-codec:v': 'mpeg1video', // video codec
    '-b:v': '1000k', // video bit rate
    '-stats': '',
    '-r': 25, // frame rate
    '-s': '640x480', // video size
    '-bf': 0,
    // audio
    '-codec:a': 'mp2', // audio codec
    '-ar': 44100, // sampling rate (in Hz)(in Hz)
    '-ac': 1, // number of audio channels
    '-b:a': '128k', // audio bit rate
  },
});
