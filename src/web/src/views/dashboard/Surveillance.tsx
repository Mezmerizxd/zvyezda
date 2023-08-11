import { Context } from './styled';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { useEffect, useState } from 'react';
import { emitter } from '../../lib/emitter';
import * as socketIo from 'socket.io-client';

import {
  FullscreenContext,
  FullscreenContextBody,
  FullscreenContextHeader,
} from '../../components/contexts/FullscreenContext';

import StandardButton from '../../components/buttons/StandardButton';

export default () => {
  const [player, setPlayer] = useState<JSMpeg.VideoElement | null>(null);

  function start() {
    if (!player) {
      var player = new JSMpeg.VideoElement('#video-canvas', emitter.streamUrl, {
        autoplay: true,
      });

      setPlayer(player);
    }
  }

  function play() {
    if (player) {
      player.play();
    }
  }

  function pause() {
    if (player) {
      player.pause();
    }
  }

  function stop() {
    if (player) {
      player.stop();
      setPlayer(null);
    }
  }

  return (
    <Context>
      <FullscreenContext>
        <FullscreenContextHeader>
          <h1>Surveillance</h1>
        </FullscreenContextHeader>
        <FullscreenContextBody>
          <div id="video-canvas" style={{ height: '480px', width: '640px' }}></div>
          <StandardButton text="Start" onClick={start} />
          <StandardButton text="Play" onClick={play} />
          <StandardButton text="Pause" onClick={pause} />
          <StandardButton text="Stop" onClick={stop} />
        </FullscreenContextBody>
      </FullscreenContext>
    </Context>
  );
};
