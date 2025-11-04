import { Injectable } from '@nestjs/common';
import { MemberInput } from './dto/create-member.input';
import { type DB, InjectDb } from '@/db/db.provider';
import { users, workspaceMembers } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class MembersService {
  constructor(@InjectDb() private readonly db: DB) {}

  async getMembersByWorkspaceId(workspaceId: MemberInput['workspaceId']) {
    const members = await this.db
      .select({
        workspaceId: workspaceMembers.workspaceId,
        userId: workspaceMembers.userId,
        role: workspaceMembers.role,
        createdAt: workspaceMembers.createdAt,
        updatedAt: workspaceMembers.updatedAt,
        name: users.name,
        email: users.email,
      })
      .from(workspaceMembers)
      .leftJoin(users, eq(workspaceMembers.userId, users.id))
      .where(eq(workspaceMembers.workspaceId, workspaceId));

    return members;
  }

  async getMember({
    workspaceId,
    userId,
  }: {
    workspaceId: MemberInput['workspaceId'];
    userId: MemberInput['memberId'];
  }) {
    const [member] = await this.db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, userId),
        ),
      )
      .limit(1)
      .execute();

    return member;
  }

  async getMemberById(memberId: MemberInput['memberId']) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, memberId))
      .limit(1)
      .execute();

    return user;
  }

  async removeMember(memberId: MemberInput['memberId']) {
    const [member] = await this.db
      .delete(workspaceMembers)
      .where(eq(workspaceMembers.userId, memberId))
      .returning();

    return member;
  }

  async updateRole(
    memberId: MemberInput['memberId'],
    role: MemberInput['role'],
  ) {
    const [member] = await this.db
      .update(workspaceMembers)
      .set({ role })
      .where(eq(workspaceMembers.userId, memberId))
      .returning();

    return member;
  }
}
