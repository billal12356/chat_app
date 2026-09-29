import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';
import { SessionService } from './session.service.js';
import { SessionGuard } from './guards/session.guard.js';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, SessionService,SessionGuard],
  exports: [AuthService, SessionService,SessionGuard],
})
export class AuthModule {}
