import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  // 소켓 연결 함수
  const connectSocket = useCallback(async () => {
    if (isConnectedRef.current || !team || !userInfo?.nickname) return;

    try {
      await initChat();
      joinRoom(team, userInfo.nickname);
      isConnectedRef.current = true;
    } catch (e) {
      console.error('소켓 연결 실패:', e);
    }
  }, [team, userInfo?.nickname]);

  // 최초 마운트 시 연결
  useEffect(() => {
    let isUnmounted = false;

    const doConnect = async () => {
      if (!isConnectedRef.current && !isUnmounted) {
        await connectSocket();
      }
    };

    doConnect();

    return () => {
      isUnmounted = true;
      if (isConnectedRef.current && team && userInfo?.nickname) {
        leaveRoom(team, userInfo.nickname, () => {
          disconnectChat();
          isConnectedRef.current = false;
        });
      }
    };
  }, [connectSocket, team, userInfo?.nickname]);

  // 메시지 수신 처리
  useEffect(() => {
    const unsubscribe = onMessage((msg: ChatMsg) => {
      setMsgs((prev) => {
        const newMsgs = [...prev, { ...msg, type: msg.type || 'user' }];
        return newMsgs.slice(-200); // 최근 200개만 유지
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 탭 복귀 시 재연결
  useEffect(() => {
    const handleVisibility = async () => {
      if (!document.hidden && !isConnectedRef.current) {
        await connectSocket();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [connectSocket]);

  // 브라우저 닫을 때 소켓 정리
  useEffect(() => {
    const handleUnload = () => {
      if (isConnectedRef.current && team && userInfo?.nickname) {
        leaveRoom(team, userInfo.nickname, () => {
          disconnectChat();
        });
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [team, userInfo?.nickname]);

  // 메시지 추가 시 자동 스크롤
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
              <div className="time">
                {new Date(m.timestamp).toLocaleString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </div>
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
