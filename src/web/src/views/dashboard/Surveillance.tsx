import JSMpeg from '@cycjimmy/jsmpeg-player';
import { useEffect, useState } from 'react';
import { emitter } from '../../lib/emitter';
import * as socketIo from 'socket.io-client';
import { MdPause, MdPlayArrow, MdStart } from 'react-icons/md';
import { BsFillPlayFill, BsFillStopFill } from 'react-icons/bs';

import { Context, SurveillancePlayer, SurveillancePlayerControls } from './styled';
import {
  FullscreenContext,
  FullscreenContextBody,
  FullscreenContextHeader,
} from '../../components/contexts/FullscreenContext';

import StandardButton from '../../components/buttons/StandardButton';
import IconButton from '../../components/buttons/IconButton';

export default () => {
  const [socket, setSocket] =
    useState<socketIo.Socket<Zvyezda.Socket.ServerToClient & Zvyezda.Socket.ClientToServer>>(null);
  const [player, setPlayer] = useState<JSMpeg.VideoElement | null>(null);

  useEffect(() => {
    const s: socketIo.Socket<Zvyezda.Socket.ServerToClient & Zvyezda.Socket.ClientToServer> = socketIo.io(
      emitter.socketUrl,
      {
        secure: false,
        rejectUnauthorized: false,
        reconnectionAttempts: 0,
        autoConnect: false,
      },
    );

    s.connect();

    setSocket(s);

    return () => {
      s.emit('leaveStream');
      s.disconnect();
    };
  }, []);

  function start() {
    if (!player) {
      socket.emit('joinStream', {
        authorization: localStorage.getItem('token'),
      });

      var player = new JSMpeg.VideoElement('#video-canvas', emitter.streamUrl, {
        autoplay: true,
      });

      setPlayer(player);
    }
  }

  function stop() {
    if (player) {
      player.stop();
      socket.emit('leaveStream');
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
          <SurveillancePlayerControls>
            <h1>Current Stream: Indoor Camera 1</h1>
            <div>
              <BsFillPlayFill onClick={() => start()} />
              <BsFillStopFill onClick={() => stop()} />
            </div>
          </SurveillancePlayerControls>
          <SurveillancePlayer>
            <div id="video-canvas" style={{ height: '100%', width: '100%' }}></div>
          </SurveillancePlayer>
        </FullscreenContextBody>
      </FullscreenContext>
    </Context>
  );
};

// style={{ height: '480px', width: '640px' }}
