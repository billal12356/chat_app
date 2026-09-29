import { Module } from '@nestjs/common';

import { NotificationsController } from './notifications.controller.js';
import { NotificationsService } from './notifications.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { NotificationsGateway } from './notifications.gateway.js';

@Module({
  imports:[AuthModule],
  controllers: [
    NotificationsController,
  ],

  providers: [
    NotificationsService,
    NotificationsGateway,
  ],

  exports: [
    NotificationsService,
    NotificationsGateway,
  ],
})
export class NotificationsModule {}