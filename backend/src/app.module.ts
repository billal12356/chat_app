import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { FriendsModule } from './friends/friends.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { ConversationsModule } from './conversations/conversations.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    FriendsModule,
    NotificationsModule,
    ConversationsModule,
  ],
})
export class AppModule {}
