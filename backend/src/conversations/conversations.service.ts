import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { and, eq, inArray } from 'drizzle-orm';

import { DatabaseService } from '../database/database.service.js';

import { conversationMembers } from '../database/schema/conversation-members.schema.js';

import { conversations } from '../database/schema/conversations.schema.js';

import { users } from '../database/schema/users.schema.js';
@Injectable()
export class ConversationsService {
  constructor(private readonly database: DatabaseService) {}

  async createDirectConversation(userId: number, otherUserId: number) {
    if (userId === otherUserId) {
      throw new BadRequestException(
        'You cannot create a conversation with yourself',
      );
    }

    const otherUser = await this.database.db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.id, otherUserId))
      .limit(1);

    if (!otherUser[0]) {
      throw new NotFoundException('User not found');
    }

    const existingConversation = await this.findDirectConversation(
      userId,
      otherUserId,
    );

    if (existingConversation) {
      return existingConversation;
    }

    const conversationResult = await this.database.db
      .insert(conversations)
      .values({
        type: 'DIRECT',
      })
      .returning();

    const conversation = conversationResult[0];

    await this.database.db.insert(conversationMembers).values([
      {
        conversationId: conversation.id,
        userId,
      },
      {
        conversationId: conversation.id,
        userId: otherUserId,
      },
    ]);

    return conversation;
  }
  private async findDirectConversation(
    userId: number,
    otherUserId: number,
  ) {
    const firstUserConversations =
      await this.database.db
        .select({
          conversationId:
            conversationMembers.conversationId,
        })
        .from(conversationMembers)
        .where(
          eq(
            conversationMembers.userId,
            userId,
          ),
        );

    const conversationIds =
      firstUserConversations.map(
        (item) =>
          item.conversationId,
      );

    if (conversationIds.length === 0) {
      return null;
    }

    const result =
      await this.database.db
        .select({
          conversationId:
            conversationMembers.conversationId,
        })
        .from(conversationMembers)
        .where(
          and(
            inArray(
              conversationMembers.conversationId,
              conversationIds,
            ),
            eq(
              conversationMembers.userId,
              otherUserId,
            ),
          ),
        )
        .limit(1);

    const conversationId =
      result[0]?.conversationId;

    if (!conversationId) {
      return null;
    }

    const conversation =
      await this.database.db
        .select()
        .from(conversations)
        .where(
          eq(
            conversations.id,
            conversationId,
          ),
        )
        .limit(1);

    return conversation[0] ?? null;
  }
}
