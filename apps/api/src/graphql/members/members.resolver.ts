// src/modules/members/member.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { type MemberRole, SuccessResponse } from '../../graphql';

//@UseGuards(GqlAuthGuard)
@Resolver(() => Member)
export class MembersResolver {
  constructor(private readonly memberService: MembersService) {}

  @Query(() => [Member])
  getMembers(@Args('workspaceId') workspaceId: string) {
    return this.memberService.getMembers(workspaceId);
  }

  @Mutation(() => SuccessResponse)
  removeMember(
    @Args('memberId') memberId: string,
    @Args('workspaceId') workspaceId: string,
  ) {
    return this.memberService.removeMember(memberId, workspaceId);
  }

  @Mutation(() => SuccessResponse)
  updateRole(
    @Args('memberId') memberId: string,
    @Args('role') role: MemberRole,
    @Args('workspaceId') workspaceId: string,
  ) {
    return this.memberService.updateRole(memberId, role, workspaceId);
  }
}
