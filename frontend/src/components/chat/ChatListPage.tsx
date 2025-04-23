import React from 'react';
import { Link } from 'react-router-dom';
import { TEAMS } from '../../types/teams';
import './ChatPage.css';

const ChatListPage: React.FC = () => {
  return (
    <div className="chat-list-page">
      <header className="chat-list-header">
        <h1>팀별 채팅방</h1>
        <p className="subtitle">원하는 팀을 선택하세요</p>
      </header>
      <div className="chat-board-container">
        {TEAMS.map((team) => (
          <Link
            key={team.value}
            to={`/chat/${team.value}`}
            className="chat-board-item"
          >
            <div
              className="chat-board-content"
              style={{
                borderColor: team.color,
                color: team.color,
              }}
            >
              <div className="feature-icon">💬</div>
              <h2>{team.label}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatListPage;