import { useEffect, useState } from 'react';
import * as socketIo from 'socket.io-client';
import { emitter } from '../../lib/emitter';
import { TimeAgo } from '../../lib/utils';
import { engine } from '../../lib/engine';

import {
  Context,
  DiscussionChatLogs,
  DiscussionMessage,
  DiscussionMessageWrapper,
  DiscussionMessageReply,
  DiscussionMessageAvatar,
  DiscussionMessageContent,
  DiscussionMessageTitlebar,
  DiscussionMessageContentWrapper,
} from './styled';
import {
  FullscreenContext,
  FullscreenContextBody,
  FullscreenContextHeader,
} from '../../components/contexts/FullscreenContext';
import StandardInput from '../../components/inputs/StandardInput';

export default () => {
  const [socket, setSocket] =
    useState<socketIo.Socket<Zvyezda.Socket.ServerToClient & Zvyezda.Socket.ClientToServer>>(null);
  const [messages, setMessages] = useState<Zvyezda.Client.DiscussionMessage[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    setTimeout(async () => {
      const r = await emitter.api('/discussion/get-messages', true, null);
      if (r.server.success === true) {
        setMessages(r.data.messages);
      }

      const s: socketIo.Socket<Zvyezda.Socket.ServerToClient & Zvyezda.Socket.ClientToServer> = socketIo.io(
        engine.forceEngine ? engine.socketUrl : emitter.socketUrl,
        {
          secure: false,
          rejectUnauthorized: false,
          reconnectionAttempts: 0,
          autoConnect: false,
        },
      );

      s.connect();

      s.emit('joinDiscussion', {
        authorization: localStorage.getItem('token'),
      });

      s.on('discussionMessage', (data) => {
        setMessages((messages) => [...messages, data]);
      });

      setSocket(s);

      return () => {
        socket.disconnect();
      };
    });
  }, []);

  useEffect(() => {
    if (messages && messages.length > 0) {
      document.getElementById('autoscroll').scrollIntoView(false);
    }
  }, [messages]);

  function handleSendMessage(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (message.length > 0) {
        socket.emit('sendDiscussionMessage', {
          message: message,
          authorization: localStorage.getItem('token'),
        });
        setMessage('');
      }
    }
  }

  return (
    <Context>
      <FullscreenContext>
        <FullscreenContextHeader>
          <h1>Discussion</h1>
        </FullscreenContextHeader>
        <FullscreenContextBody>
          {messages && messages.length > 0 && (
            <DiscussionChatLogs>
              {messages.map((message) => (
                <DiscussionMessageWrapper key={message.id}>
                  {message.replyTo && (
                    <DiscussionMessageReply>
                      {message.replyTo.username}
                      <span>{message.replyTo.message}</span>
                    </DiscussionMessageReply>
                  )}
                  <DiscussionMessage>
                    <DiscussionMessageAvatar>
                      {message.avatar ? <img src={message.avatar} /> : <p>{message.username[0]}</p>}
                    </DiscussionMessageAvatar>
                    <DiscussionMessageContentWrapper>
                      <DiscussionMessageTitlebar>
                        <h1>{message.username}</h1>
                        <h2>{TimeAgo(message.createdAt)}</h2>
                      </DiscussionMessageTitlebar>
                      <DiscussionMessageContent>
                        <p>{message.message}</p>
                      </DiscussionMessageContent>
                    </DiscussionMessageContentWrapper>
                  </DiscussionMessage>
                </DiscussionMessageWrapper>
              ))}
              <div id="autoscroll"></div>
            </DiscussionChatLogs>
          )}
          <StandardInput
            placeholder="Type your message here."
            type="text"
            onKeyDown={(e) => handleSendMessage(e)}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </FullscreenContextBody>
      </FullscreenContext>
    </Context>
  );
};
