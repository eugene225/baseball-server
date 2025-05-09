import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onUserList, requestUserList } from '../../api/chat';
import { useAuth } from '../../contexts/AuthContext';
import './UserList.css';

const getInitial = (name: string) => name ? name[0].toUpperCase() : '?';

const UserList: React.FC = () => {
  const { team } = useParams<{ team: string }>();
  const { userInfo } = useAuth();
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    if (team) {
      requestUserList(team);

      const unsubscribe = onUserList((userList: string[]) => {
        setUsers(userList);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [team]);

  return (
    <div className="user-list">
      <div className="user-list-header">
        <span>접속 중인 사용자</span>
        <span className="user-count">{users.length}명</span>
      </div>
      <ul>
        {users.map((user, index) => (
          <li key={index} className={user === userInfo?.nickname ? 'me' : ''}>
            <span className="avatar">{getInitial(user)}</span>
            <span className="username" title={user}>
              {user === userInfo?.nickname ? <b>{user} (나)</b> : user}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
