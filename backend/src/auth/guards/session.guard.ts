import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { SessionService } from '../session.service.js';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest();

    const token =
      request.cookies?.session;

    if (!token) {
      throw new UnauthorizedException(
        'Authentication required',
      );
    }

    const session =
      await this.sessionService.findSession(token);

    if (!session) {
      throw new UnauthorizedException(
        'Session expired or invalid',
      );
    }

    request.session = session;

    request.userId = session.userId;

    return true;
  }
}