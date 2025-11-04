import { Injectable } from '@nestjs/common';
import { and, eq, gte, lte, lt, ne } from 'drizzle-orm';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';

import { tasks } from '@/db/schema';
import { type DB, InjectDb } from '@/db/db.provider';
import { TaskStatus } from '../tasks/entities/task.entity';

@Injectable()
export class AnalyticsService {
  constructor(@InjectDb() private readonly db: DB) {}

  async getAnalyticsProject({
    projectId,
    assigneeId,
  }: {
    projectId: string;
    assigneeId: string;
  }) {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.projectId, projectId),
          gte(tasks.createdAt, thisMonthStart),
          lte(tasks.createdAt, thisMonthEnd),
        ),
      );

    const lastMonthTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.projectId, projectId),
          gte(tasks.createdAt, lastMonthStart),
          lte(tasks.createdAt, lastMonthEnd),
        ),
      );

    const taskCount = thisMonthTasks.length;
    const taskDifference = taskCount - lastMonthTasks.length;

    const thisMonthAssignedTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.projectId, projectId),
          eq(tasks.assigneeId, assigneeId),
          gte(tasks.createdAt, thisMonthStart),
          lte(tasks.createdAt, thisMonthEnd),
        ),
      );

    const lastMonthAssignedTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.projectId, projectId),
          eq(tasks.assigneeId, assigneeId),
          gte(tasks.createdAt, lastMonthStart),
          lte(tasks.createdAt, lastMonthEnd),
        ),
      );

    const assignedTaskCount = thisMonthAssignedTasks.length;
    const assignedTaskDifference =
      assignedTaskCount - lastMonthAssignedTasks.length;

    const thisMonthCompletedTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.projectId, projectId),
          eq(tasks.status, TaskStatus.DONE),
          gte(tasks.createdAt, thisMonthStart),
          lte(tasks.createdAt, thisMonthEnd),
        ),
      );

    const lastMonthCompletedTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.projectId, projectId),
          eq(tasks.status, TaskStatus.DONE),
          gte(tasks.createdAt, lastMonthStart),
          lte(tasks.createdAt, lastMonthEnd),
        ),
      );

    const completedTaskCount = thisMonthCompletedTasks.length;
    const completedTaskDifference =
      completedTaskCount - lastMonthCompletedTasks.length;

    const thisMonthIncompleteTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.projectId, projectId),
          ne(tasks.status, TaskStatus.DONE),
          gte(tasks.createdAt, thisMonthStart),
          lte(tasks.createdAt, thisMonthEnd),
        ),
      );

    const lastMonthIncompleteTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.projectId, projectId),
          ne(tasks.status, TaskStatus.DONE),
          gte(tasks.createdAt, lastMonthStart),
          lte(tasks.createdAt, lastMonthEnd),
        ),
      );

    const incompleteTaskCount = thisMonthIncompleteTasks.length;
    const incompleteTaskDifference =
      incompleteTaskCount - lastMonthIncompleteTasks.length;

    const thisMonthOverdueTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.projectId, projectId),
          ne(tasks.status, TaskStatus.DONE),
          lt(tasks.dueDate, now),
          gte(tasks.createdAt, thisMonthStart),
          lte(tasks.createdAt, thisMonthEnd),
        ),
      );

    const lastMonthOverdueTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.projectId, projectId),
          ne(tasks.status, TaskStatus.DONE),
          lt(tasks.dueDate, now),
          gte(tasks.createdAt, lastMonthStart),
          lte(tasks.createdAt, lastMonthEnd),
        ),
      );

    const overdueTaskCount = thisMonthOverdueTasks.length;
    const overdueTaskDifference =
      overdueTaskCount - lastMonthOverdueTasks.length;

    return {
      taskCount,
      taskDifference,
      assignedTaskCount,
      assignedTaskDifference,
      completedTaskCount,
      completedTaskDifference,
      incompleteTaskCount,
      incompleteTaskDifference,
      overdueTaskCount,
      overdueTaskDifference,
    };
  }

  async getAnalyticsWorkspace({
    workspaceId,
    assigneeId,
  }: {
    workspaceId: string;
    assigneeId: string;
  }) {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.workspaceId, workspaceId),
          gte(tasks.createdAt, thisMonthStart),
          lte(tasks.createdAt, thisMonthEnd),
        ),
      );

    const lastMonthTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.workspaceId, workspaceId),
          gte(tasks.createdAt, lastMonthStart),
          lte(tasks.createdAt, lastMonthEnd),
        ),
      );

    const taskCount = thisMonthTasks.length;
    const taskDifference = taskCount - lastMonthTasks.length;

    const thisMonthAssignedTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.workspaceId, workspaceId),
          eq(tasks.assigneeId, assigneeId),
          gte(tasks.createdAt, thisMonthStart),
          lte(tasks.createdAt, thisMonthEnd),
        ),
      );

    const lastMonthAssignedTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.workspaceId, workspaceId),
          eq(tasks.assigneeId, assigneeId),
          gte(tasks.createdAt, lastMonthStart),
          lte(tasks.createdAt, lastMonthEnd),
        ),
      );

    const assignedTaskCount = thisMonthAssignedTasks.length;
    const assignedTaskDifference =
      assignedTaskCount - lastMonthAssignedTasks.length;

    const thisMonthCompletedTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.workspaceId, workspaceId),
          eq(tasks.status, TaskStatus.DONE),
          gte(tasks.createdAt, thisMonthStart),
          lte(tasks.createdAt, thisMonthEnd),
        ),
      );

    const lastMonthCompletedTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.workspaceId, workspaceId),
          eq(tasks.status, TaskStatus.DONE),
          gte(tasks.createdAt, lastMonthStart),
          lte(tasks.createdAt, lastMonthEnd),
        ),
      );

    const completedTaskCount = thisMonthCompletedTasks.length;
    const completedTaskDifference =
      completedTaskCount - lastMonthCompletedTasks.length;

    const thisMonthIncompleteTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.workspaceId, workspaceId),
          ne(tasks.status, TaskStatus.DONE),
          gte(tasks.createdAt, thisMonthStart),
          lte(tasks.createdAt, thisMonthEnd),
        ),
      );

    const lastMonthIncompleteTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.workspaceId, workspaceId),
          ne(tasks.status, TaskStatus.DONE),
          gte(tasks.createdAt, lastMonthStart),
          lte(tasks.createdAt, lastMonthEnd),
        ),
      );

    const incompleteTaskCount = thisMonthIncompleteTasks.length;
    const incompleteTaskDifference =
      incompleteTaskCount - lastMonthIncompleteTasks.length;

    const thisMonthOverdueTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.workspaceId, workspaceId),
          ne(tasks.status, TaskStatus.DONE),
          lt(tasks.dueDate, now),
          gte(tasks.createdAt, thisMonthStart),
          lte(tasks.createdAt, thisMonthEnd),
        ),
      );

    const lastMonthOverdueTasks = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.workspaceId, workspaceId),
          ne(tasks.status, TaskStatus.DONE),
          lt(tasks.dueDate, now),
          gte(tasks.createdAt, lastMonthStart),
          lte(tasks.createdAt, lastMonthEnd),
        ),
      );

    const overdueTaskCount = thisMonthOverdueTasks.length;
    const overdueTaskDifference =
      overdueTaskCount - lastMonthOverdueTasks.length;

    return {
      taskCount,
      taskDifference,
      assignedTaskCount,
      assignedTaskDifference,
      completedTaskCount,
      completedTaskDifference,
      incompleteTaskCount,
      incompleteTaskDifference,
      overdueTaskCount,
      overdueTaskDifference,
    };
  }
}
