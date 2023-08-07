import { Context } from './styled';
import JSMpeg from '@cycjimmy/jsmpeg-player';

import {
  FullscreenContext,
  FullscreenContextBody,
  FullscreenContextHeader,
} from '../../components/contexts/FullscreenContext';
import { useEffect } from 'react';

export default () => {
  useEffect(() => {
    var videoUrl = `ws://localhost:6789/`;
    var player = new JSMpeg.VideoElement('#video-canvas', videoUrl, {
      autoplay: true,
    });
  });

  return (
    <Context>
      <FullscreenContext>
        <FullscreenContextHeader>
          <h1>Surveillance</h1>
        </FullscreenContextHeader>
        <FullscreenContextBody>
          <div id="video-canvas" style={{ height: '480px', width: '640px' }}></div>
        </FullscreenContextBody>
      </FullscreenContext>
    </Context>
  );
};
