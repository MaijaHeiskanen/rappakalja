import { Injectable } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';

@Injectable()
@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(@ConnectedSocket() client: Socket): void {
    console.log(`connected: ${client.id}`);

  }
  handleDisconnect(client: Socket) {
    console.log(`disconnected: ${client.id}`);
  }

  updateToRoom(room: string, data: any) {
    this.emitToRoom(room, 'update', data);
  }

  private emitToRoom(room: string, event: string, data: any) {
    this.server.to(room).emit(event, data);
  }

  joinRoom(room: string, socketId: string) {
    this.server.in(socketId).socketsJoin(room);
  }

  leaveRoom(room: string, socketId: string) {
    this.server.in(socketId).socketsLeave(room);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket): void {
    console.log(`message from: ${client.id}`);
    this.server.emit('message', `message: ${message}, response: hello from server!`);
  }
}
