import {
  Resolver,
  Mutation,
  Args,
  Query,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/guards/auth.guard';
import { BulkTask } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

import { TasksService } from './tasks.service';
import { MembersService } from '../members/members.service';
import { ProjectsService } from '../projects/projects.service';

@UseGuards(AuthGuard)
@Resolver('Task')
export class TasksResolver {
  constructor(
    private readonly tasksService: TasksService,
    private readonly membersService: MembersService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Mutation('createTask')
  async createTask(
    @Context() context: any,
    @Args('name') name: CreateTaskInput['name'],
    @Args('status') status: CreateTaskInput['status'],
    @Args('dueDate') dueDate: CreateTaskInput['dueDate'],
    @Args('projectId') projectId: CreateTaskInput['projectId'],
    @Args('assigneeId') assigneeId: CreateTaskInput['assigneeId'],
    @Args('workspaceId') workspaceId: CreateTaskInput['workspaceId'],
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

    const task = await this.tasksService.createTask({
      name,
      status,
      workspaceId,
      projectId,
      dueDate,
      assigneeId,
    });
    console.log('Created task:', task);

    return {
      id: task.id,
      name: task.name,
      status: task.status,
      workspaceId: task.workspaceId,
      projectId: task.projectId,
      dueDate: task.dueDate,
      assigneeId: task.assigneeId,
      position: task.position,
      description: task.description,
    };
  }

  @Mutation('updateTask')
  async updateTask(
    @Context() context: any,
    @Args('id') id: UpdateTaskInput['id'],
    @Args('name') name: UpdateTaskInput['name'],
    @Args('status') status: UpdateTaskInput['status'],
    @Args('dueDate') dueDate: UpdateTaskInput['dueDate'],
    @Args('projectId') projectId: UpdateTaskInput['projectId'],
    @Args('assigneeId') assigneeId: UpdateTaskInput['assigneeId'],
    @Args('description') description: UpdateTaskInput['description'],
  ) {
    const userId = context.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    if (!id) {
      throw new HttpException('Task ID is required', HttpStatus.BAD_REQUEST);
    }
    const taskWorkspace = await this.tasksService.getTaskById(id);

    const member = await this.membersService.getMember({
      workspaceId: taskWorkspace.workspaceId,
      userId: userId,
    });
    if (!member) {
      throw new HttpException(
        'Not a member of this workspace',
        HttpStatus.FORBIDDEN,
      );
    }

    const task = await this.tasksService.updateTask({
      id,
      name,
      status,
      dueDate,
      projectId,
      assigneeId,
      description,
    });

    return {
      id: task.id,
      name: task.name,
      status: task.status,
      workspaceId: task.workspaceId,
      projectId: task.projectId,
      dueDate: task.dueDate?.toISOString(),
      description: task.description,
    };
  }

  @Mutation('deleteTask')
  async deleteTask(@Args('id') id: string, @Context() context: any) {
    const userId = context.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const task = await this.tasksService.getTaskById(id);

    const member = await this.membersService.getMember({
      workspaceId: task.workspaceId,
      userId: userId,
    });
    if (!member) {
      throw new HttpException(
        'Not a member of this workspace',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.tasksService.deleteTask(id);

    return {
      id: task.id,
      name: task.name,
      status: task.status,
      workspaceId: task.workspaceId,
      projectId: task.projectId,
      dueDate: task.dueDate?.toISOString(),
    };
  }

  @Mutation('bulkUpdateTasks')
  async bulkUpdateTasks(
    @Args('tasks') tasks: BulkTask[],
    @Context() context: any,
  ) {
    const userId = context.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    // TODO: check if all tasks belong to the same workspace

    const task = await this.tasksService.getTaskById(tasks[0].id);
    const member = await this.membersService.getMember({
      workspaceId: task.workspaceId,
      userId: userId,
    });
    if (!member) {
      throw new HttpException(
        'Not a member of this workspace',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!tasks || tasks.length === 0) {
      throw new HttpException(
        'No tasks provided for bulk update',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedTasks = await this.tasksService.bulkUpdateTasks(tasks);

    const formattedTasks = updatedTasks.map((task) => ({
      id: task.id,
      name: task.name,
      status: task.status,
      workspaceId: task.workspaceId,
      projectId: task.projectId,
      dueDate: task.dueDate?.toISOString(),
      position: task.position,
      assigneeId: task.assigneeId,
      description: task.description,
    }));

    return formattedTasks;
  }

  @Query('getTask')
  async getTask(@Args('id') id: string, @Context() context: any) {
    const userId = context.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const task = await this.tasksService.getTaskById(id);
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    const member = await this.membersService.getMember({
      workspaceId: task.workspaceId,
      userId: userId,
    });
    if (!member) {
      throw new HttpException(
        'Not a member of this workspace',
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      ...task,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    };
  }

  @ResolveField('assignee')
  async getAssignee(
    @Parent()
    task: {
      workspaceId: string;
      assigneeId: string;
    },
    @Context() context: any,
  ) {
    const userId = context.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const member = await this.membersService.getMember({
      workspaceId: task.workspaceId,
      userId: userId,
    });
    if (!member) {
      throw new HttpException(
        'Not a member of this workspace',
        HttpStatus.FORBIDDEN,
      );
    }

    const assignee = await this.membersService.getMemberById(task.assigneeId);

    return {
      id: assignee.id,
      name: assignee.name,
      email: assignee.email,
    };
  }

  @ResolveField('project')
  async getProject(
    @Parent()
    task: {
      workspaceId: string;
      projectId: string;
    },
    @Context() context: any,
  ) {
    const userId = context.user.sub;
    if (!userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const member = await this.membersService.getMember({
      workspaceId: task.workspaceId,
      userId: userId,
    });
    if (!member) {
      throw new HttpException(
        'Not a member of this workspace',
        HttpStatus.FORBIDDEN,
      );
    }

    const project = await this.projectsService.getProjectById(task.projectId);

    return {
      id: project.id,
      name: project.name,
      image: project.image,
      workspaceId: project.workspaceId,
    };
  }
}
