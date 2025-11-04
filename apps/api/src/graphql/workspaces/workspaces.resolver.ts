import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import type { FileUpload } from 'graphql-upload/processRequest.mjs';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';

import { utapi } from '@/lib/uploathing';
import { MemberRole } from '../../graphql';
import { AuthGuard } from '@/guards/auth.guard';
import { generateInviteCode } from '@/lib/utils';
import { WorkspacesService } from './workspaces.service';
import { MembersService } from '../members/members.service';
import { CreateWorkspaceInputDto } from './dto/create-workspace.input';
import { UpdateWorkspaceInputDto } from './dto/update-workspace.input';

@UseGuards(AuthGuard)
@Resolver('Workspace')
export class WorkspacesResolver {
  constructor(
    private readonly workspacesService: WorkspacesService,
    private readonly membersService: MembersService,
  ) {}

  @Query('getWorkspaces')
  async getWorkspaces(@Context() context: any) {
    const userId = context.user.sub;

    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const workspaces =
      await this.workspacesService.getWorkspacesbyMember(userId);

    return workspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      image: workspace.image,
      userId: workspace.userId,
      inviteCode: workspace.inviteCode,
    }));
  }

  @Query('getWorkspace')
  async getWorkspace(@Args('id') id: string, @Context() context: any) {
    const userId = context.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const member = await this.membersService.getMember({
      workspaceId: id,
      userId: userId,
    });
    if (!member) {
      throw new HttpException(
        'Not a member of this workspace',
        HttpStatus.FORBIDDEN,
      );
    }

    const workspace = await this.workspacesService.getWorkspaceById(id);
    if (!workspace) {
      throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);
    }

    return {
      id: workspace.id,
      name: workspace.name,
      image: workspace.image,
      userId: workspace.userId,
      inviteCode: workspace.inviteCode,
    };
  }

  @Query('getWorkspaceInfo')
  async getWorkspaceInfo(@Args('id') id: string) {
    const workspace = await this.workspacesService.getWorkspaceById(id);
    if (!workspace) {
      throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);
    }

    return {
      name: workspace.name,
    };
  }

  @Mutation('createWorkspace')
  async createWorkspace(
    @Context() context: any,
    @Args('name') name: CreateWorkspaceInputDto['name'],
    @Args('image') image?: CreateWorkspaceInputDto['image'],
  ) {
    const userId = context.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    let uploadedImageUrl: string | undefined;

    if (image?.file) {
      const file: FileUpload = await image.file;

      // Read the file stream and convert it to a Node.js File instance
      const stream = file.createReadStream();
      const chunks: Uint8Array[] = [];

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);

      // Create a Node.js File instance
      const nodeFile = new File([buffer], file.filename, {
        type: file.mimetype,
      });

      const result = await utapi.uploadFiles(nodeFile);

      if (!result || result.error) {
        throw new HttpException(
          'Failed to upload image',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      uploadedImageUrl = result.data.ufsUrl;
    } else if (image?.url) {
      uploadedImageUrl = image.url;
    }

    const workspace = await this.workspacesService.createWorkspace({
      name,
      userId: userId,
      image: uploadedImageUrl,
      inviteCode: generateInviteCode(6),
    });

    await this.workspacesService.addMember({
      workspaceId: workspace.id,
      userId: userId,
      role: MemberRole.ADMIN,
    });

    return {
      id: workspace.id,
      name: workspace.name,
      userId: workspace.userId,
      image: workspace.image,
      inviteCode: workspace.inviteCode,
    };
  }

  @Mutation('deleteWorkspace')
  async deleteWorkspace(@Args('id') id: string, @Context() context: any) {
    const userId = context.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const member = await this.membersService.getMember({
      workspaceId: id,
      userId: userId,
    });
    if (!member || member.role !== MemberRole.ADMIN) {
      throw new HttpException(
        'Not authorized to delete this workspace',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.workspacesService.deleteWorkspace(id);

    return {
      success: true,
      message: 'Workspace deleted successfully',
    };
  }

  @Mutation('updateWorkspace')
  async updateWorkspace(
    @Context() context: any,
    @Args('id') id: UpdateWorkspaceInputDto['id'],
    @Args('name') name: UpdateWorkspaceInputDto['name'],
    @Args('image') image?: UpdateWorkspaceInputDto['image'],
  ) {
    const userId = context.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const member = await this.membersService.getMember({
      workspaceId: id,
      userId: userId,
    });
    if (!member || member.role !== MemberRole.ADMIN) {
      throw new HttpException(
        'Not authorized to update this workspace',
        HttpStatus.FORBIDDEN,
      );
    }

    let uploadedImageUrl: string | undefined;

    if (image?.file) {
      const file: FileUpload = await image.file;

      // Read the file stream and convert it to a Node.js File instance
      const stream = file.createReadStream();
      const chunks: Uint8Array[] = [];

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);

      // Create a Node.js File instance
      const nodeFile = new File([buffer], file.filename, {
        type: file.mimetype,
      });

      const result = await utapi.uploadFiles(nodeFile);

      if (!result || result.error) {
        throw new HttpException(
          'Failed to upload image',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      uploadedImageUrl = result.data.ufsUrl;
    } else {
      uploadedImageUrl = image?.url;
    }

    const updatedWorkspace = await this.workspacesService.updateWorkspace({
      id,
      name,
      image: uploadedImageUrl,
    });

    return {
      id: updatedWorkspace.id,
      name: updatedWorkspace.name,
      userId: updatedWorkspace.userId,
      image: updatedWorkspace.image,
      inviteCode: updatedWorkspace.inviteCode,
    };
  }

  @Mutation('joinWorkspace')
  async joinWorkspace(
    @Args('inviteCode') inviteCode: string,
    @Args('workspaceId') workspaceId: string,
    @Context() context: any,
  ) {
    const userId = context.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const existingMember = await this.membersService.getMember({
      workspaceId,
      userId: userId,
    });

    if (existingMember) {
      throw new HttpException(
        'You are already a member of this workspace',
        HttpStatus.CONFLICT,
      );
    }

    const workspace = await this.workspacesService.joinWorkspace({
      inviteCode,
      userId: userId,
    });

    return {
      id: workspace.id,
      name: workspace.name,
      image: workspace.image,
      userId: workspace.userId,
      inviteCode: workspace.inviteCode,
    };
  }

  @Mutation('resetInviteCode')
  async resetInviteCode(@Args('id') id: string, @Context() context: any) {
    const userId = context.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const member = await this.membersService.getMember({
      workspaceId: id,
      userId: userId,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      throw new HttpException(
        'Not authorized to reset invite code',
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedWorkspace = await this.workspacesService.resetInviteCode({
      id,
      inviteCode: generateInviteCode(6),
    });

    return {
      id: updatedWorkspace.id,
      name: updatedWorkspace.name,
      image: updatedWorkspace.image,
      userId: updatedWorkspace.userId,
      inviteCode: updatedWorkspace.inviteCode,
    };
  }

  @ResolveField('members')
  async getMembers(
    @Parent() workspace: { id: string },
    @Context() context: any,
  ) {
    const userId = context.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const member = await this.membersService.getMember({
      workspaceId: workspace.id,
      userId: userId,
    });
    if (!member) {
      throw new HttpException(
        'Not a member of this workspace',
        HttpStatus.FORBIDDEN,
      );
    }

    const members = await this.membersService.getMembersByWorkspaceId(
      workspace.id,
    );
    return members.map((member) => ({
      id: member.userId,
      name: member.name,
      role: member.role,
      email: member.email,
    }));
  }
}
