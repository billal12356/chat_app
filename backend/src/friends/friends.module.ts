import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller.js';
import { FriendsService } from './friends.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [
    AuthModule,
    NotificationsModule,
  ],
  controllers: [FriendsController],

  providers: [FriendsService],
})
export class FriendsModule {}
