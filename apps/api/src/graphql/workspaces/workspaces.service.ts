import { MemberRole } from '../../graphql';
import { eq, inArray } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { type DB, InjectDb } from '@/db/db.provider';
import { workspaceMembers, workspaces } from '@/db/schema';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { UpdateWorkspaceInput } from './dto/update-workspace.input';

@Injectable()
export class WorkspacesService {
  constructor(@InjectDb() private readonly db: DB) {}

  async createWorkspace({
    name,
    userId,
    image,
    inviteCode,
  }: CreateWorkspaceInput) {
    const [workspace] = await this.db
      .insert(workspaces)
      .values({
        name,
        userId,
        image: typeof image === 'string' ? image : null,
        inviteCode: inviteCode,
      })
      .returning();

    return workspace;
  }

  async addMember({
    workspaceId,
    userId,
    role = MemberRole.MEMBER,
  }: {
    workspaceId: string;
    userId: string;
    role: MemberRole;
  }) {
    const [member] = await this.db
      .insert(workspaceMembers)
      .values({
        workspaceId,
        userId,
        role,
      })
      .returning();

    return member;
  }

  async updateWorkspace({ id, name, image }: UpdateWorkspaceInput) {
    const [workspace] = await this.db
      .update(workspaces)
      .set({
        name,
        image: typeof image === 'string' ? image : null,
      })
      .where(eq(workspaces.id, id))
      .returning();

    return workspace;
  }

  async deleteWorkspace(id: string) {
    const [result] = await this.db
      .delete(workspaces)
      .where(eq(workspaces.id, id))
      .returning();

    return result;
  }

  async getWorkspacesbyMember(userId: string) {
    const workspacesList = await this.db
      .select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.userId, userId));

    if (!workspacesList.length) {
      throw new Error('No workspaces found for the user');
    }

    const workspaceIds = workspacesList.map((member) => member.workspaceId);

    const getWorkspacesbyMember = await this.db
      .select()
      .from(workspaces)
      .where(inArray(workspaces.id, workspaceIds))
      .execute();

    if (!getWorkspacesbyMember.length) {
      throw new Error('No workspaces found for the user');
    }

    if (getWorkspacesbyMember.length !== workspaceIds.length) {
      throw new Error('Some workspaces not found for the user');
    }
    // TODO: Verify if workspaces exist for this member
    return getWorkspacesbyMember;
  }

  async getWorkspaceById(id: string) {
    const [workspace] = await this.db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, id))
      .limit(1)
      .execute();

    return workspace;
  }

  async resetInviteCode({
    id,
    inviteCode,
  }: {
    id: string;
    inviteCode: string;
  }) {
    const [workspace] = await this.db
      .update(workspaces)
      .set({ inviteCode })
      .where(eq(workspaces.id, id))
      .returning();

    return workspace;
  }

  async joinWorkspace({
    inviteCode,
    userId,
  }: {
    inviteCode: string;
    userId: string;
  }) {
    const [workspace] = await this.db
      .select()
      .from(workspaces)
      .where(eq(workspaces.inviteCode, inviteCode))
      .limit(1)
      .execute();

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    await this.addMember({
      workspaceId: workspace.id,
      userId,
      role: MemberRole.MEMBER,
    });

    return workspace;
  }
}
