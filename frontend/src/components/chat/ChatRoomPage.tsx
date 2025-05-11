import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { TEAMS } from '../../types/teams';
import './Chat.css';
import { disconnectChat, initChat, joinRoom, leaveRoom, onMessage, sendMessage } from '../../api/chat';

interface ChatMsg {
  sender: string;
  text: string;
  timestamp: string;
}

const ChatRoomPage: React.FC = () => {
  const { team } = useParams<{ team: string }>();
  const { userInfo } = useAuth();
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initChat();
    if (team) joinRoom(team, userInfo?.nickname || '익명');

    onMessage((msg) => setMsgs((prev) => [...prev, msg]));

    return () => {
      if (team) leaveRoom(team, userInfo?.nickname || '익명');
      disconnectChat();
    };
  }, [team]);

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
  const color = TEAMS.find((t) => t.value === team)?.color || '#333';

  return (
    <div className="chat-room-page">
      <div className="chat-room-header">
        <Link to="/chat" className="back-link">← 뒤로</Link>
        <h2 style={{ borderBottom: `2px solid ${color}`, color }}>{label} 채팅</h2>
      </div>
      <div className="chat-room-content">
        <div className="message-list" ref={listRef}>
          {msgs.map((m, i) => (
            <div key={i} className="message">
              <span className="sender">{m.sender}</span>
              <span className="text">{m.text}</span>
              <div className="time">{new Date(m.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
        <div className="message-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="메시지를 입력하세요"
          />
          <button
            onClick={handleSend}
            style={{
              backgroundColor: color,
              borderColor: color,
              color: '#fff'
            }}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;