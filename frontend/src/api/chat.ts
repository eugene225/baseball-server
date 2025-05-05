import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const API_URL = `${process.env.REACT_APP_SOCKET_URL}`;

/** 소켓 연결 초기화 */
export const initChat = () => {
  if (!socket) {
    socket = io(API_URL, {
      transports: ['websocket'],
    });
  }
};

/** 방에 입장 (닉네임 포함) */
export const joinRoom = (room: string, nickname: string) => {
  socket?.emit('join', { room, nickname });
};

/** 방에서 나가기 (닉네임 포함) */
export const leaveRoom = (room: string, nickname: string) => {
  socket?.emit('leave', { room, nickname });
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

/** 소켓 연결 해제 */
export const disconnectChat = () => {
  socket?.disconnect();
  socket = null;
};
