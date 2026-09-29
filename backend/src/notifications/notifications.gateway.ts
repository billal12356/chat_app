import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import type { Server, Socket } from 'socket.io';

import { SessionService } from '../auth/session.service.js';
import { getCookie } from '../common/utils/cookie.utils.js';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly onlineUsers = new Map<number, Set<string>>();

  constructor(private readonly sessionService: SessionService) {}

  async handleConnection(client: Socket) {
    const cookieHeader = client.handshake.headers.cookie;

    const token = getCookie(cookieHeader, 'session');

    if (!token) {
      client.disconnect();

      return;
    }

    const session = await this.sessionService.findSession(token);

    if (!session) {
      client.disconnect();

      return;
    }

    client.data.userId = session.userId;

    const sockets = this.onlineUsers.get(session.userId) ?? new Set<string>();

    sockets.add(client.id);

    this.onlineUsers.set(session.userId, sockets);

    console.log(`User ${session.userId} connected`);
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;

    if (!userId) {
      return;
    }

    const sockets = this.onlineUsers.get(userId);

    if (!sockets) {
      return;
    }

    sockets.delete(client.id);

    if (sockets.size === 0) {
      this.onlineUsers.delete(userId);

      console.log(`User ${userId} is offline`);
    }
  }

  sendToUser(userId: number, event: string, payload: unknown) {
    const sockets = this.onlineUsers.get(userId);

    if (!sockets) {
      return;
    }

    for (const socketId of sockets) {
      this.server.to(socketId).emit(event, payload);
    }
  }
}
