import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';

import { utapi } from '@/lib/uploathing';
import { ProjectsService } from './projects.service';
import { MembersService } from '../members/members.service';
import { UpdateProjectInputDto } from './dto/update-project.input';
import { CreateProjectInputDto } from './dto/create-project.input';
import { AuthGuard } from '@/guards/auth.guard';

@UseGuards(AuthGuard)
@Resolver('Project')
export class ProjectsResolver {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly membersService: MembersService,
  ) {}

  @Query('getProjects')
  async getProjects(
    @Args('workspaceId') workspaceId: string,
    @Context() context: any,
  ) {
    const userId = context.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const member = await this.membersService.getMember({
      workspaceId,
      userId: userId,
    });
    if (!member) {
      throw new HttpException(
        'Not a member of this workspace',
        HttpStatus.FORBIDDEN,
      );
    }

    const projects = await this.projectsService.getProjects(workspaceId);
    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      image: project.image,
      workspaceId: project.workspaceId,
    }));
  }

  @Query('getProject')
  async getProject(@Args('projectId') projectId: string, @Context() ctx: any) {
    const userId = ctx.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const project = await this.projectsService.getProject(projectId);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

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

    return {
      id: project.id,
      name: project.name,
      image: project.image,
      workspaceId: project.workspaceId,
    };
  }

  @Mutation('createProject')
  async createProject(
    @Context() ctx: any,
    @Args('name') name: CreateProjectInputDto['name'],
    @Args('image') image: CreateProjectInputDto['image'],
    @Args('workspaceId') workspaceId: CreateProjectInputDto['workspaceId'],
  ) {
    const userId = ctx.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const member = await this.membersService.getMember({
      workspaceId,
      userId: userId,
    });
    if (!member) {
      throw new HttpException(
        'Not a member of this workspace',
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
    } else if (image?.url) {
      uploadedImageUrl = image.url;
    }

    const project = await this.projectsService.createProject({
      name,
      workspaceId,
      image: uploadedImageUrl,
    });

    return {
      id: project.id,
      name: project.name,
      image: project.image,
      workspaceId: project.workspaceId,
    };
  }

  @Mutation('updateProject')
  async updateProject(
    @Args('id') id: UpdateProjectInputDto['id'],
    @Args('name') name: UpdateProjectInputDto['name'],
    @Args('image') image: UpdateProjectInputDto['image'],
    @Context() ctx: any,
  ) {
    const userId = ctx.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const project = await this.projectsService.getProject(id);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

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

    const updatedProject = await this.projectsService.updateProject({
      id,
      name,
      image: uploadedImageUrl,
    });

    return {
      id: updatedProject.id,
      name: updatedProject.name,
      image: updatedProject.image,
      workspaceId: updatedProject.workspaceId,
    };
  }

  @Mutation('deleteProject')
  async deleteProject(@Args('id') id: string, @Context() ctx: any) {
    const userId = ctx.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const project = await this.projectsService.getProject(id);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

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

    const deletedProject = await this.projectsService.deleteProject(id);

    return {
      id: deletedProject.id,
      name: deletedProject.name,
      image: deletedProject.image,
      workspaceId: deletedProject.workspaceId,
    };
  }
}
