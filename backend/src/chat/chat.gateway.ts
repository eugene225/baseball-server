import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatNotificationTracker } from './utils/chat.notification.js';

interface ChatMessage {
  room: string;
  sender: string;
  text: string;
  timestamp: string;
}

@WebSocketGateway({
  cors: {
    origin: ["http://localhost:5001", "https://haengbokza.site"],
    methods: ['GET', 'POST'],
  },
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly chatNotificationTracker: ChatNotificationTracker
  ) {}
  private server: Server;
  
  afterInit(server: Server) {
    this.server = server;
    console.log('Socket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  private emitUserList(room: string) {
    const socketIds = this.server.sockets.adapter.rooms.get(room);
    if (!socketIds) return;
    const nicknames = Array.from(socketIds)
      .map((socketId) => this.server.sockets.sockets.get(socketId)?.data.nickname)
      .filter((nickname): nickname is string => !!nickname);
    this.server.to(room).emit('userList', nicknames);
  }

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() data: { room: string; nickname: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { room, nickname } = data;

    if (client.rooms.has(room)) return;

    client.data.nickname = nickname;
    client.join(room);
    console.log(`${nickname} (${client.id}) joined room ${room}`);

    const clientsInRoom = this.server.sockets.adapter.rooms.get(room);
    const isFirstUser = clientsInRoom && clientsInRoom.size === 1;

    this.server.to(room).emit('system', `${nickname}님이 입장하셨습니다.`);
    this.emitUserList(room);

    if (isFirstUser) {
      console.log('sendFirstUserNotification');
      this.chatNotificationTracker.sendFirstUserNotification(room, nickname);
    }
  }

  @SubscribeMessage('leave')
  handleLeave(
    @MessageBody() data: { room: string; nickname: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { room, nickname } = data;
    client.leave(room);
    console.log(`${nickname} (${client.id}) left room ${room}`);

    this.server.to(room).emit('system', `${nickname}님이 퇴장하셨습니다.`);
    this.emitUserList(room);
    return 'ok';
  }

  @SubscribeMessage('getUsers')
  handleGetUsers(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { room } = data;
    const socketIds = this.server.sockets.adapter.rooms.get(room);
    if (!socketIds) return [];
    const nicknames = Array.from(socketIds)
      .map((socketId) => this.server.sockets.sockets.get(socketId)?.data.nickname)
      .filter((nickname): nickname is string => !!nickname);
    client.emit('userList', nicknames);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() msg: ChatMessage) {
    const { room, sender, text, timestamp } = msg;
    this.server.to(room).emit('message', { sender, text, timestamp });
  }
}
