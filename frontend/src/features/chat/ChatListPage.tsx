import React from 'react';
import { Link } from 'react-router-dom';
import { TEAMS } from '../../types/teams';
import styles from './ChatListPage.module.css';

const ChatListPage: React.FC = () => {
  return (
    <div className={styles.chatListPage}>
      <header className={styles.chatListHeader}>
        <h1>팀별 채팅방</h1>
        <p className={styles.subtitle}>원하는 팀을 선택하세요</p>
      </header>
      <div className={styles.teamList}>
        {TEAMS.map((team) => (
          <Link
            key={team.value}
            to={`/chat/${team.value}`}
            className={styles.teamCard}
            style={{ borderLeft: `4px solid ${team.color}` }}
          >
            <span className={styles.teamEmoji}>
              {team.value === 'LG_TWINS' && '👥'}
              {team.value === 'SAMSUNG_LIONS' && '🦁'}
              {team.value === 'KIWOOM_HEROS' && '🦸'}
              {team.value === 'HANHWA_EAGLES' && '🦅'}
              {team.value === 'KT_WIZ' && '🧙'}
              {team.value === 'DOOSAN_BEARS' && '🐻'}
              {team.value === 'NC_DINOS' && '🦖'}
              {team.value === 'SSG_LANDERS' && '🚀'}
              {team.value === 'KIA_TIGERS' && '🐯'}
              {team.value === 'LOTTE_GIANTS' && '🧌'}
            </span>
            <span className={styles.teamName}>{team.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatListPage;