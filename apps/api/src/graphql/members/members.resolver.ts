import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';

import { MemberRole } from '../../graphql';
import { AuthGuard } from '@/guards/auth.guard';
import { MembersService } from './members.service';
import {
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

@UseGuards(AuthGuard)
@Resolver('Member')
export class MembersResolver {
  constructor(private readonly memberService: MembersService) {}

  @Query('getMembers')
  async getMembers(
    @Args('workspaceId') workspaceId: string,
    @Context() context: any,
  ) {
    const userId = context.user.sub;
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    const member = await this.memberService.getMember({
      workspaceId,
      userId: userId,
    });
    if (!member) {
      throw new ForbiddenException('Not a member of this workspace');
    }
    const members =
      await this.memberService.getMembersByWorkspaceId(workspaceId);
    return members.map((member) => ({
      id: member.userId,
      name: member.name,
      role: member.role,
      email: member.email,
    }));
  }

  @Mutation('removeMember')
  async removeMember(
    @Args('memberId') memberId: string,
    @Args('workspaceId') workspaceId: string,
    @Context() context: any,
  ) {
    const userId = context.user.sub;
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    const allMemberInWorkspace =
      await this.memberService.getMembersByWorkspaceId(workspaceId);
    if (allMemberInWorkspace.length <= 1) {
      throw new BadRequestException(
        'Cannot remove the last member from a workspace',
      );
    }

    const currentUserMember = await this.memberService.getMember({
      workspaceId: workspaceId,
      userId: userId,
    });
    if (!currentUserMember || currentUserMember.role !== MemberRole.ADMIN) {
      throw new ForbiddenException('Not authorized to remove members');
    }

    await this.memberService.removeMember(memberId);

    return {
      success: true,
      message: `Member removed successfully`,
    };
  }

  @Mutation('updateRole')
  async updateRole(
    @Args('memberId') memberId: string,
    @Args('role') role: MemberRole,
    @Args('workspaceId') workspaceId: string,
    @Context() context: any,
  ) {
    const userId = context.user.sub;
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    const allMemberInWorkspace =
      await this.memberService.getMembersByWorkspaceId(workspaceId);
    if (allMemberInWorkspace.length <= 1) {
      throw new BadRequestException(
        'Cannot update role of the last member in a workspace',
      );
    }

    const currentUserMember = await this.memberService.getMember({
      workspaceId: workspaceId,
      userId: userId,
    });
    if (!currentUserMember || currentUserMember.role !== MemberRole.ADMIN) {
      throw new ForbiddenException('Not authorized to update member roles');
    }

    await this.memberService.updateRole(memberId, role);

    return {
      success: true,
      message: `Member role updated to ${role}`,
    };
  }
}
