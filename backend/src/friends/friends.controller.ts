import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { SessionGuard } from '../auth/guards/session.guard.js';

import { SendFriendRequestDto } from './dto/send-friend-request.dto.js';
import { FriendsService } from './friends.service.js';

@Controller('friends')
@UseGuards(SessionGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('requests')
  sendRequest(@Req() request: Request, @Body() dto: SendFriendRequestDto) {
    return this.friendsService.sendRequest(request.userId!, dto.receiverId);
  }

  @Post('requests/:id/accept')
  acceptRequest(
    @Req() request: Request,
    @Param('id', ParseIntPipe) requestId: number,
  ) {
    return this.friendsService.acceptRequest(request.userId!, requestId);
  }

  @Post('requests/:id/reject')
  rejectRequest(
    @Req() request: Request,
    @Param('id', ParseIntPipe) requestId: number,
  ) {
    return this.friendsService.rejectRequest(request.userId!, requestId);
  }

  @Get('requests')
  getPendingRequests(@Req() request: Request) {
    return this.friendsService.getPendingRequests(request.userId!);
  }

  @Get()
  getFriends(@Req() request: Request) {
    console.log("request",request.userId)
    return this.friendsService.getFriends(request.userId!);
  }
}
