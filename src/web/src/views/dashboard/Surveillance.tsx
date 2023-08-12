import JSMpeg from '@cycjimmy/jsmpeg-player';
import { useEffect, useState } from 'react';
import { emitter } from '../../lib/emitter';
import * as socketIo from 'socket.io-client';
import { BsFillPlayFill, BsFillStopFill } from 'react-icons/bs';

import { Context, SurveillancePlayer, SurveillancePlayerControls, SurveillanceSource } from './styled';

import StandardButton from '../../components/buttons/StandardButton';
import IconButton from '../../components/buttons/IconButton';
import { StandardContext, StandardContextBody, StandardContextHeader } from '../../components/contexts/StandardContext';

export default () => {
  const [socket, setSocket] =
    useState<socketIo.Socket<Zvyezda.Socket.ServerToClient & Zvyezda.Socket.ClientToServer>>(null);
  const [player, setPlayer] = useState<JSMpeg.VideoElement | null>(null);
  const [streamData, setStreamData] = useState<{
    streams: Zvyezda.Server.Managers.Surveillance.Stream[] | null;
    currentStream: Zvyezda.Server.Managers.Surveillance.Stream | null;
    running: boolean;
  }>({
    streams: null,
    currentStream: null,
    running: false,
  });

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

    s.emit('joinStream', {
      authorization: localStorage.getItem('token'),
    });

    s.on('receiveStreamData', (data) => {
      setStreamData(data);
    });

    setSocket(s);

    s.emit('getStreamData');

    var player = new JSMpeg.VideoElement('#video-canvas', emitter.streamUrl, {
      autoplay: true,
    });

    setPlayer(player);

    return () => {
      s.emit('leaveStream');
      s.disconnect();
    };
  }, []);

  function start() {
    if (player) {
      player.play();
    }
  }

  function stop() {
    if (player) {
      player.pause();
    }
  }

  return (
    <Context>
      <StandardContext max="800px" wide>
        <StandardContextHeader>
          <h1>Live Feed</h1>
        </StandardContextHeader>
        <StandardContextBody>
          <SurveillancePlayerControls>
            <h1>
              Current Stream: {streamData?.currentStream?.name || 'N/A'} | Running:
              {streamData.running ? 'True' : 'False'}
            </h1>
            <div>
              <BsFillPlayFill onClick={() => start()} />
              <BsFillStopFill onClick={() => stop()} />
            </div>
          </SurveillancePlayerControls>
          <SurveillancePlayer>
            <div id="video-canvas" style={{ height: '480px', width: '640px' }}></div>
          </SurveillancePlayer>
        </StandardContextBody>
      </StandardContext>

      <StandardContext max="800px" wide>
        <StandardContextHeader>
          <h1>Sources</h1>
        </StandardContextHeader>
        <StandardContextBody>
          {streamData?.streams?.length > 0 &&
            streamData.streams.map((s) => (
              <SurveillanceSource>
                <BsFillPlayFill
                  onClick={() => {
                    socket.emit('startStream', s);
                  }}
                />
                <p>{s.name}</p>
              </SurveillanceSource>
            ))}
        </StandardContextBody>
      </StandardContext>
    </Context>
  );
};

// style={{ height: '480px', width: '640px' }}
