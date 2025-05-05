import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() data: { room: string; nickname: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { room, nickname } = data;
    client.join(room);
    console.log(`${nickname} (${client.id}) joined room ${room}`);

    // 입장 메시지를 방 전체에 broadcast
    this.server.to(room).emit('system', `${nickname}님이 입장하셨습니다.`);
  }

  @SubscribeMessage('leave')
  handleLeave(
    @MessageBody() data: { room: string; nickname: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { room, nickname } = data;
    client.leave(room);
    console.log(`${nickname} (${client.id}) left room ${room}`);

    // 퇴장 메시지 broadcast
    this.server.to(room).emit('system', `${nickname}님이 퇴장하셨습니다.`);
    return 'ok'; // ack 전용
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() msg: ChatMessage) {
    const { room, sender, text, timestamp } = msg;
    this.server.to(room).emit('message', { sender, text, timestamp });
  }
}
