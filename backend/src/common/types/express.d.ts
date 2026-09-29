import type { sessions } from '../../database/schema/sessions.schema.js';

declare global {
  namespace Express {
    interface Request {
      session?: typeof sessions.$inferSelect;

      userId?: number;
    }
  }
}

export {};