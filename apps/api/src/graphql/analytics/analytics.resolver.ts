import { HttpException, HttpStatus } from '@nestjs/common';
import { Resolver, Query, Args, Context } from '@nestjs/graphql';

import { AnalyticsService } from './analytics.service';
import { MembersService } from '../members/members.service';
import { ProjectsService } from '../projects/projects.service';

@Resolver('Analytics')
export class AnalyticsResolver {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly projectsService: ProjectsService,
    private readonly membersService: MembersService,
  ) {}

  @Query('getAnalyticsProject')
  async getAnalyticsProject(
    @Args('projectId') projectId: string,
    @Context() context: any,
  ) {
    const userId = context.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const project = await this.projectsService.getProject(projectId);

    const member = await this.membersService.getMember({
      workspaceId: project.workspaceId,
      userId: userId,
    });

    if (!member) {
      throw new HttpException(
        'Not a member of this workspace',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    const analytics = await this.analyticsService.getAnalyticsProject({
      projectId,
      assigneeId: member.userId,
    });

    return analytics;
  }

  @Query('getAnalyticsWorkspace')
  async getAnalyticsWorkspace(
    @Context() context: any,
    @Args('workspaceId') workspaceId: string,
  ) {
    const userId = context.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const member = await this.membersService.getMember({
      workspaceId: workspaceId,
      userId: userId,
    });

    if (!member) {
      throw new HttpException(
        'Not a member of this workspace',
        HttpStatus.FORBIDDEN,
      );
    }

    const analytics = await this.analyticsService.getAnalyticsWorkspace({
      workspaceId,
      assigneeId: member.userId,
    });

    return analytics;
  }
}
