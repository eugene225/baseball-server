import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const API_URL = `${process.env.REACT_APP_SOCKET_URL}`;

/** 소켓 연결 초기화 */
export const initChat = () => {
  if (!socket || !socket.connected) {
    socket = io(API_URL, {
      transports: ['websocket'],
    });
  }
};

/** 방에 입장 (닉네임 포함) */
export const joinRoom = (room: string, nickname: string) => {
  socket?.emit('join', { room, nickname });
};

/** 방에서 나가기 (닉네임 포함) + 콜백 지원 */
export const leaveRoom = (room: string, nickname: string, callback?: () => void) => {
  socket?.emit('leave', { room, nickname }, callback);
};

/** 메시지 보내기 */
export const sendMessage = (room: string, sender: string, text: string) => {
  socket?.emit('message', { room, sender, text, timestamp: new Date().toISOString() });
};

/** 메시지 수신 콜백 등록 */
export const onMessage = (
  cb: (msg: { sender: string; text: string; timestamp: string; type?: 'user' | 'system' }) => void
) => {
  if (socket) {
    socket.off('message');
    socket.off('system');

    socket.on('message', cb);

    const systemListener = (text: string) => {
      cb({
        sender: '',
        text,
        timestamp: new Date().toISOString(),
        type: 'system',
      });
    };

    socket.on('system', systemListener);

    return () => {
      socket?.off('message', cb);
      socket?.off('system', systemListener);
    };
  }

  return () => {};
};

/** 접속 중인 사용자 목록 요청 */
export const requestUserList = (room: string) => {
  socket?.emit('getUsers', { room });
};

/** 접속 중인 사용자 목록 수신 콜백 등록 */
export const onUserList = (cb: (userList: string[]) => void) => {
  if (socket) {
    const listener = (userList: string[]) => cb(userList);
    socket.on('userList', listener);

    return () => {
      socket?.off('userList', listener);
    };
  }
  return () => {};
};

/** 소켓 연결 해제 */
export const disconnectChat = () => {
  socket?.disconnect();
  socket = null;
};
