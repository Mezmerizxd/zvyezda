import JSMpeg from '@cycjimmy/jsmpeg-player';
import { useEffect, useState } from 'react';
import { emitter } from '../../lib/emitter';
import * as socketIo from 'socket.io-client';
import { BsFillPauseFill, BsFillPlayFill, BsFillStopFill } from 'react-icons/bs';

import {
  Context,
  SurveillanceAddSource,
  SurveillancePlayer,
  SurveillancePlayerControls,
  SurveillanceSource,
} from './styled';

import StandardButton from '../../components/buttons/StandardButton';
import IconButton from '../../components/buttons/IconButton';
import { StandardContext, StandardContextBody, StandardContextHeader } from '../../components/contexts/StandardContext';
import IconInput from '../../components/inputs/StandardInput';

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
  const [newSource, setNewSource] = useState<{
    url: string;
    name: string;
  }>({
    url: '',
    name: '',
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
      s.emit('leaveStream', {
        authorization: localStorage.getItem('token'),
      });
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

  function addSource() {
    if (newSource.name && newSource.url) {
      socket.emit('addSource', newSource);
    }
    setNewSource({
      url: '',
      name: '',
    });
  }

  return (
    <Context>
      <StandardContext max="fit-content" wide>
        <StandardContextHeader>
          <h1>Live Feed</h1>
        </StandardContextHeader>
        <StandardContextBody>
          <SurveillancePlayer>
            <div id="video-canvas" style={{ height: '480px', width: '640px' }}></div>
          </SurveillancePlayer>
          <SurveillancePlayerControls>
            <div>
              <BsFillPlayFill onClick={() => start()} />
              <BsFillPauseFill onClick={() => stop()} />
            </div>
            <h1>Current Stream: {streamData?.currentStream?.name || 'N/A'}</h1>
            <h1>Running: {streamData.running ? 'True' : 'False'}</h1>
          </SurveillancePlayerControls>
        </StandardContextBody>
      </StandardContext>

      <StandardContext max="fit-content" wide>
        <StandardContextHeader>
          <h1>Sources</h1>
        </StandardContextHeader>
        <StandardContextBody>
          <SurveillanceAddSource>
            <IconInput
              placeholder="Stream Name"
              type="text"
              margin="5px 0"
              onChange={(e) =>
                setNewSource({
                  ...newSource,
                  name: e.target.value,
                })
              }
              value={newSource.name}
            />
            <IconInput
              placeholder="rtsp://example.com"
              type="text"
              margin="5px 5px"
              onChange={(e) =>
                setNewSource({
                  ...newSource,
                  url: e.target.value,
                })
              }
              value={newSource.url}
            />
            <StandardButton text="Add" onClick={addSource} />
          </SurveillanceAddSource>

          {streamData?.streams?.length > 0 &&
            streamData.streams.map((s) => (
              <SurveillanceSource
                onClick={() => {
                  socket.emit('startStream', s);
                }}
              >
                <BsFillPlayFill />
                <p>{s.name}</p>
              </SurveillanceSource>
            ))}
        </StandardContextBody>
      </StandardContext>
    </Context>
  );
};
