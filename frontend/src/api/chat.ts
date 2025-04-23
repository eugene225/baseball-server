import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const API_URL = `${process.env.REACT_APP_API_URL}`

/** 소켓 연결 초기화 */
export const initChat = () => {
  if (!socket) {
    socket = io(API_URL, {
      transports: ['websocket'],
    });
  }
};

/** 방에 입장 */
export const joinRoom = (room: string) => {
  socket?.emit('join', room);
};

/** 방에서 나가기 */
export const leaveRoom = (room: string) => {
  socket?.emit('leave', room);
};

/** 메시지 보내기 */
export const sendMessage = (room: string, sender: string, text: string) => {
  socket?.emit('message', { room, sender, text, timestamp: new Date().toISOString() });
};

/** 메시지 수신 콜백 등록 */
export const onMessage = (cb: (msg: { sender: string; text: string; timestamp: string }) => void) => {
  if (socket) {
    socket.off('message');
    socket.on('message', cb);
  }
};

/** 소켓 연결 해제 */
export const disconnectChat = () => {
  socket?.disconnect();
  socket = null;
};
