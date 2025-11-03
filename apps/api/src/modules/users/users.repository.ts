import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';
import { Injectable } from '@nestjs/common';
import { type DB, InjectDb } from '@/db/db.provider';

@Injectable()
export class UsersRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  async create(name: string, email: string, password: string) {
    const [user] = await this.db
      .insert(users)
      .values({ name, email, password })
      .returning();

    return user;
  }

  async findByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }
}
