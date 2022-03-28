import { Injectable } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { AppService } from "./app.service";
import { getGames, setGames } from "./games";

@Injectable()
@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly appService: AppService) {}

  handleConnection(@ConnectedSocket() client: Socket): void {
    console.log(`connected: ${client.id}`);

  }
  handleDisconnect(client: Socket) {
    console.log(`disconnected: ${client.id}`);
    const games = getGames();
    const socketId = client.id;
    let gameIndex = null;
    let playerIndex = null;

    games.forEach((game, gIndex) => {
      game.players.forEach((player, index) => {
        if (player.socketId === socketId) {
          gameIndex = gIndex;
          playerIndex = index;
        }
      });
    });

    if (gameIndex !== null && playerIndex !== null) {
      const game = games[gameIndex];
      game.players.splice(playerIndex, 1);

      setGames(games);

      this.updateToRoom(game.room, game);
    }
  }

  updateToRoom(room: string, data: any) {
    this.emitToRoom(room, 'update', data);
  }

  private emitToRoom(room: string, event: string, data: any) {
    this.server.to(room).emit(event, data);
  }

  joinRoom(socketId: string, room: string) {
    this.server.in(socketId).socketsJoin(room);
  }

  leaveRoom(socketId: string, room: string) {
    this.server.in(socketId).socketsLeave(room);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket): void {
    console.log(`message from: ${client.id}`);
    this.server.emit('message', `message: ${message}, response: hello from server!`);
  }
}
