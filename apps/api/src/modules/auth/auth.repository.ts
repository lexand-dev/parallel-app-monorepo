import { and, eq } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';

import type { DB } from '@/db';
import { users } from '@/db/schema';
import { InjectDb } from '@/db/db.provider';

@Injectable()
export class AuthRepository {
  // 1. Inject db
  constructor(@InjectDb() private readonly db: DB) {}

  /**
   * Find a user by their id
   * @param id the id of the user to find
   * @returns user the full user object if the user exists or null otherwise
   */

  // 2. Methods
  async find(email: string, password: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.password, password)));

    if (!user) {
      return null;
    }

    return user;
  }

  /**
   * Find all users in the database
   */
  async create(name: string, email: string, password: string) {
    return await this.db.insert(users).values({
      name,
      email,
      password,
    });
  }
}
