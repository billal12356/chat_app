import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DatabaseService } from '../database/database.service.js';

import {
  notifications,
} from '../database/schema/notifications.schema.js';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly database: DatabaseService,
  ) {}

  async createNotification(data: {
    userId: number;
    type:
      | 'FRIEND_REQUEST'
      | 'FRIEND_REQUEST_ACCEPTED'
      | 'NEW_MESSAGE';
    title: string;
    message: string;
  }) {
    const result =
      await this.database.db
        .insert(notifications)
        .values({
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
        })
        .returning();

    return result[0];
  }

  async getUserNotifications(
    userId: number,
  ) {
    return this.database.db
      .select()
      .from(notifications)
      .where(
        eq(
          notifications.userId,
          userId,
        ),
      );
  }

  async markAsRead(
    userId: number,
    notificationId: number,
  ) {
    const result =
      await this.database.db
        .update(notifications)
        .set({
          isRead: 1,
        })
        .where(
          eq(
            notifications.id,
            notificationId,
          ),
        )
        .returning();

    const notification = result[0];

    if (
      !notification ||
      notification.userId !== userId
    ) {
      return null;
    }

    return notification;
  }
}