import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { SessionGuard } from '../auth/guards/session.guard.js';

import { NotificationsService } from './notifications.service.js';

@Controller('notifications')
@UseGuards(SessionGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  getNotifications(
    @Req() request: Request,
  ) {
    return this.notificationsService.getUserNotifications(
      request.userId!,
    );
  }

  @Patch(':id/read')
  markAsRead(
    @Req() request: Request,
    @Param('id', ParseIntPipe)
    notificationId: number,
  ) {
    return this.notificationsService.markAsRead(
      request.userId!,
      notificationId,
    );
  }
}