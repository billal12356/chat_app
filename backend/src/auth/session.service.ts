import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { createHash, randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';

import { DatabaseService } from '../database/database.service.js';
import { sessions } from '../database/schema/session.schema.js';

@Injectable()
export class SessionService {
  private readonly sessionDurationMs =
    7 * 24 * 60 * 60 * 1000;

  constructor(
    private readonly database: DatabaseService,
  ) {}

  createToken(): string {
    return randomBytes(32).toString('hex');
  }

  hashToken(token: string): string {
    return createHash('sha256')
      .update(token)
      .digest('hex');
  }

  async createSession(userId: number) {
    const token = this.createToken();

    const tokenHash = this.hashToken(token);

    const expiresAt = new Date(
      Date.now() + this.sessionDurationMs,
    );

    await this.database.db
      .insert(sessions)
      .values({
        userId,
        tokenHash,
        expiresAt,
      });

    return {
      token,
      expiresAt,
    };
  }

  async findSession(token: string) {
    const tokenHash = this.hashToken(token);

    const result = await this.database.db
      .select()
      .from(sessions)
      .where(eq(sessions.tokenHash, tokenHash))
      .limit(1);

    const session = result[0];
    console.log('session',session)

    if (!session) {
      return null;
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      await this.deleteSession(token);

      return null;
    }

    return session;
  }

  async deleteSession(token: string) {
    const tokenHash = this.hashToken(token);

    await this.database.db
      .delete(sessions)
      .where(eq(sessions.tokenHash, tokenHash));
  }

  getCookieMaxAge(): number {
    return this.sessionDurationMs;
  }
}