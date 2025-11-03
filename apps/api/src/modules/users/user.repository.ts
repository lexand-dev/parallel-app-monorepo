import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { DB } from '@/db';
import { InjectDb } from '@/db/db.provider';
import { users } from '@/db/schema';

@Injectable()
export class UserRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  /**
   * Find a user by their id
   * @param id the id of the user to find
   * @returns user the full user object if the user exists or null otherwise
   */
  async find(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));

    if (!user) {
      return null;
    }

    return user;
  }

  /**
   * Find all users in the database
   */
  async all() {
    return await this.db.select().from(users);
  }
}
