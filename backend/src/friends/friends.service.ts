import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { and, eq, or } from 'drizzle-orm';

import { DatabaseService } from '../database/database.service.js';

import { friendRequests } from '../database/schema/friend-requests.schema.js';

import { friendships } from '../database/schema/friendships.schema.js';

import { users } from '../database/schema/users.schema.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { NotificationsGateway } from '../notifications/notifications.gateway.js';

@Injectable()
export class FriendsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async sendRequest(senderId: number, receiverId: number) {
    if (senderId === receiverId) {
      throw new BadRequestException(
        'You cannot send a friend request to yourself',
      );
    }

    const receiver = await this.database.db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.id, receiverId))
      .limit(1);

    if (!receiver[0]) {
      throw new NotFoundException('User not found');
    }

    const existingFriendship = await this.findFriendship(senderId, receiverId);

    if (existingFriendship) {
      throw new BadRequestException('You are already friends');
    }

    const existingRequest = await this.database.db
      .select()
      .from(friendRequests)
      .where(
        or(
          and(
            eq(friendRequests.senderId, senderId),
            eq(friendRequests.receiverId, receiverId),
          ),
          and(
            eq(friendRequests.senderId, receiverId),
            eq(friendRequests.receiverId, senderId),
          ),
        ),
      );

    const pendingRequest = existingRequest.find(
      (request) => request.status === 'PENDING',
    );

    if (pendingRequest) {
      throw new BadRequestException('A friend request already exists');
    }

    const result = await this.database.db
      .insert(friendRequests)
      .values({
        senderId,
        receiverId,
        status: 'PENDING',
      })
      .returning();

    const request = result[0];

    const sender = await this.database.db
      .select({
        id: users.id,
        username: users.username,
      })
      .from(users)
      .where(eq(users.id, senderId))
      .limit(1);
      console.log('sender',sender)

    const notification = await this.notificationsService.createNotification({
      userId: receiverId,
      type: 'FRIEND_REQUEST',
      title: 'New friend request',
      message: `User ${sender[0].username} sent you a friend request`,
    });
    console.log('notification',notification)

    this.notificationsGateway.sendToUser(
      receiverId,
      'notification:new',
      notification,
    );

    return request;
  }

  private async findFriendship(userId: number, friendId: number) {
    const result = await this.database.db
      .select()
      .from(friendships)
      .where(
        or(
          and(
            eq(friendships.userId, userId),
            eq(friendships.friendId, friendId),
          ),
          and(
            eq(friendships.userId, friendId),
            eq(friendships.friendId, userId),
          ),
        ),
      )
      .limit(1);

    return result[0] ?? null;
  }

  async acceptRequest(receiverId: number, requestId: number) {
    const request = await this.database.db
      .select()
      .from(friendRequests)
      .where(eq(friendRequests.id, requestId))
      .limit(1);

    const friendRequest = request[0];

    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }

    if (friendRequest.receiverId !== receiverId) {
      throw new BadRequestException('You cannot accept this request');
    }

    if (friendRequest.status !== 'PENDING') {
      throw new BadRequestException('Friend request is no longer pending');
    }

    await this.database.db
      .update(friendRequests)
      .set({
        status: 'ACCEPTED',
        updatedAt: new Date(),
      })
      .where(eq(friendRequests.id, requestId));

    await this.database.db.insert(friendships).values([
      {
        userId: friendRequest.senderId,
        friendId: friendRequest.receiverId,
      },
      {
        userId: friendRequest.receiverId,
        friendId: friendRequest.senderId,
      },
    ]);

    return {
      message: 'Friend request accepted',
    };
  }

  async rejectRequest(receiverId: number, requestId: number) {
    const result = await this.database.db
      .select()
      .from(friendRequests)
      .where(eq(friendRequests.id, requestId))
      .limit(1);

    const request = result[0];

    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    if (request.receiverId !== receiverId) {
      throw new BadRequestException('You cannot reject this request');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Friend request is no longer pending');
    }

    await this.database.db
      .update(friendRequests)
      .set({
        status: 'REJECTED',
        updatedAt: new Date(),
      })
      .where(eq(friendRequests.id, requestId));

    return {
      message: 'Friend request rejected',
    };
  }

  async getPendingRequests(userId: number) {
    return this.database.db
      .select({
        id: friendRequests.id,
        senderId: friendRequests.senderId,
        status: friendRequests.status,
        createdAt: friendRequests.createdAt,

        senderUsername: users.username,
        senderEmail: users.email,
      })
      .from(friendRequests)
      .innerJoin(users, eq(users.id, friendRequests.senderId))
      .where(
        and(
          eq(friendRequests.receiverId, userId),
          eq(friendRequests.status, 'PENDING'),
        ),
      );
  }

  async getFriends(userId: number) {
    return this.database.db
      .select({
        friendshipId: friendships.id,
        friendId: users.id,
        username: users.username,
        email: users.email,
        createdAt: friendships.createdAt,
      })
      .from(friendships)
      .innerJoin(users, eq(users.id, friendships.friendId))
      .where(eq(friendships.userId, userId));
  }
}
