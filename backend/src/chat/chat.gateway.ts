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
    origin: ["http://localhost:5001", "http://52.65.47.31:5000"],
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
  handleJoin(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
    console.log(`${client.id} joined room ${room}`);
  }

  @SubscribeMessage('leave')
  handleLeave(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.leave(room);
    console.log(`${client.id} left room ${room}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() msg: ChatMessage) {
    const { room, sender, text, timestamp } = msg;
    this.server.to(room).emit('message', { sender, text, timestamp });
  }
}
