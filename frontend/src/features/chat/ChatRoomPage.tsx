import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { TEAMS } from '../../types/teams';
import './ChatRoomPage.css';
import {
  disconnectChat,
  initChat,
  joinRoom,
  leaveRoom,
  onMessage,
  sendMessage,
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

  useEffect(() => {
    initChat();
    if (team && userInfo?.nickname) {
      joinRoom(team, userInfo.nickname);
    }

    onMessage((msg: ChatMsg) => {
      setMsgs((prev) => [...prev, {
        ...msg,
        type: msg.type || 'user', // 기본값 처리
      }]);
    });

    return () => {
      if (team && userInfo?.nickname) {
        leaveRoom(team, userInfo.nickname);
      }
      disconnectChat();
    };
  }, [team, userInfo?.nickname]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [msgs]);

  const handleSend = () => {
    if (team && input.trim()) {
      const sender = userInfo?.nickname || '익명';
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
        {msgs.map((m, i) => {
          if (m.type === 'system') {
            return (
              <div key={i} className="system-message">{m.text}</div>
            );
          }

          const isMe = m.sender === userInfo?.nickname;
          return (
            <div key={i} className={`message ${isMe ? 'my-message' : 'other-message'}`}>
              <span className="sender">{m.sender}</span>
              <span className="text">{m.text}</span>
              <div className="time">{new Date(m.timestamp).toLocaleTimeString()}</div>
            </div>
          );
        })}
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
