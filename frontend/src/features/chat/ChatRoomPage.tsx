import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { TEAMS } from '../../types/teams';
import './ChatRoomPage.css';
import {
  initChat,
  joinRoom,
  leaveRoom,
  onMessage,
  sendMessage,
  disconnectChat,
} from '../../api/chat';

interface ChatMsg {
  sender: string;
  text: string;
  timestamp: string;
  type?: 'user' | 'system';
}

const ChatRoomPage: React.FC = () => {
  const { team } = useParams<{ team: string }>();
  const { userInfo } = useAuth();
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const isConnectedRef = useRef(false);

  const connectSocket = (() => {
    let connecting = false;

    return async () => {
      if (isConnectedRef.current || connecting) return;
      connecting = true;

      try {
        await initChat();
        if (team && userInfo?.nickname) {
          joinRoom(team, userInfo.nickname);
          isConnectedRef.current = true;
        }
      } catch (e) {
        console.error('소켓 연결 실패:', e);
      } finally {
        connecting = false;
      }
    };
  })();

  const disconnectSocket = () => {
    if(!isConnectedRef.current) return;
    if (isConnectedRef.current && team && userInfo?.nickname) {
      leaveRoom(team, userInfo.nickname, () => {
        disconnectChat(); // system 메시지를 수신할 여유를 가진 후 종료
        isConnectedRef.current = false;
      });
    }
  };

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [team, userInfo?.nickname]);

  // 최초 연결 + 메시지 수신
  useEffect(() => {
    connectSocket();

    const unsubscribe = onMessage((msg: ChatMsg) => {
      setMsgs((prev) => [...prev, { ...msg, type: msg.type || 'user' }]);
    });

    return () => {
      unsubscribe();
      disconnectSocket();
    };
  }, [team, userInfo?.nickname]);

  // visibilitychange: 탭 전환 시 reconnect
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden && !isConnectedRef.current) {
        connectSocket();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [team, userInfo?.nickname]);

  // beforeunload: 페이지 닫을 때만 disconnect
  useEffect(() => {
    const handleUnload = () => {
      disconnectSocket();
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [team, userInfo?.nickname]);

  // 스크롤 자동 이동
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [msgs]);

  const handleSend = () => {
    if (team && input.trim()) {
      const sender = userInfo?.nickname || '알 수 없는 사용자';
      sendMessage(team, sender, input.trim());
      setInput('');
    }
  };

  const label = TEAMS.find((t) => t.value === team)?.label || '채팅방';

  return (
    <div className="chat-container">
      <div className="chat-header">
        <Link to="/chat">← 뒤로</Link>
        <h2>{label} 채팅</h2>
      </div>

      <div className="message-list" ref={listRef}>
        {msgs.map((m, i) =>
          m.type === 'system' ? (
            <div key={i} className="system-message">{m.text}</div>
          ) : (
            <div
              key={i}
              className={`message ${m.sender === userInfo?.nickname ? 'my-message' : 'other-message'}`}
            >
              <span className="sender">{m.sender}</span>
              <span className="text">{m.text}</span>
              <div className="time">{new Date(m.timestamp).toLocaleTimeString()}</div>
            </div>
          )
        )}
      </div>

      <div className="message-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isComposing) handleSend();
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={handleSend}>전송</button>
      </div>
    </div>
  );
};

export default ChatRoomPage;