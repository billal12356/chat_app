import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { SessionGuard } from '../auth/guards/session.guard.js';

import { CreateDirectConversationDto } from './dto/create-direct-conversation.dto.js';
import { ConversationsService } from './conversations.service.js';

@Controller('conversations')
@UseGuards(SessionGuard)
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
  ) {}

  @Post('direct')
  createDirectConversation(
    @Req() request: Request,
    @Body()
    dto: CreateDirectConversationDto,
  ) {
    return this.conversationsService
      .createDirectConversation(
        request.userId!,
        dto.userId,
      );
  }
}