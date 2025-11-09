import { sql } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { and, asc, desc, eq, inArray } from 'drizzle-orm';

import { tasks } from '../../db/schema';
import { type DB, InjectDb } from '../../db/db.provider';
import { BulkTask, Task, TaskSearch, UpdateTask } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectDb() private readonly db: DB) {}

  async createTask({
    name,
    status,
    workspaceId,
    projectId,
    dueDate,
    assigneeId,
  }: Task) {
    const highestPositionTask = await this.db
      .select()
      .from(tasks)
      .where(and(eq(tasks.status, status), eq(tasks.workspaceId, workspaceId)))
      .orderBy(asc(tasks.position));

    const newPosition =
      highestPositionTask.length > 0 && highestPositionTask[0]
        ? highestPositionTask[0].position + 1000
        : 1000;

    const [createdTask] = await this.db
      .insert(tasks)
      .values({
        name,
        status,
        workspaceId,
        projectId,
        dueDate: new Date(dueDate),
        assigneeId,
        position: newPosition,
      })
      .returning();

    return createdTask;
  }

  async getTasks({
    workspaceId,
    projectId,
    assigneeId,
    status,
    search,
    dueDate,
  }: TaskSearch) {
    if (workspaceId === undefined) {
      throw new Error('workspaceId must be provided to fetch tasks.');
    }
    const query = [eq(tasks.workspaceId, workspaceId)];

    if (projectId) {
      console.log('projectId', projectId);
      query.push(eq(tasks.projectId, projectId));
    }

    if (status) {
      console.log('status', status);
      query.push(eq(tasks.status, status));
    }

    if (assigneeId) {
      console.log('assigneeId', assigneeId);
      query.push(eq(tasks.assigneeId, assigneeId));
    }

    if (dueDate) {
      console.log('dueDate', dueDate);
      query.push(eq(tasks.dueDate, new Date(dueDate)));
    }

    if (search) {
      console.log('search', search);
      query.push(eq(tasks.name, search));
    }

    const tasksList = await this.db
      .select({
        id: tasks.id,
        name: tasks.name,
        status: tasks.status,
        workspaceId: tasks.workspaceId,
        projectId: tasks.projectId,
        dueDate: tasks.dueDate,
        assigneeId: tasks.assigneeId,
        description: tasks.description,
        position: tasks.position,
      })
      .from(tasks)
      .where(and(...query))
      .orderBy(desc(tasks.position), asc(tasks.createdAt));

    return tasksList;
  }

  async getTaskById(id: string) {
    const [task] = await this.db
      .select({
        id: tasks.id,
        name: tasks.name,
        status: tasks.status,
        workspaceId: tasks.workspaceId,
        projectId: tasks.projectId,
        dueDate: tasks.dueDate,
        assigneeId: tasks.assigneeId,
        description: tasks.description,
        position: tasks.position,
      })
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1);

    return task;
  }

  async updateTask({
    id,
    name,
    status,
    dueDate,
    projectId,
    assigneeId,
    description,
  }: UpdateTask) {
    if (!id) {
      throw new Error('Task ID must be provided for update.');
    }
    const [updatedTask] = await this.db
      .update(tasks)
      .set({
        name,
        status,
        projectId,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: assigneeId,
        description: description,
      })
      .where(eq(tasks.id, id))
      .returning();

    return updatedTask;
  }

  async deleteTask(id: string) {
    const [deletedTask] = await this.db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();

    return deletedTask;
  }

  async bulkUpdateTasks(tasksToUpdate: BulkTask[]) {
    if (!tasksToUpdate || tasksToUpdate.length === 0) {
      throw new Error('No tasks provided for bulk update.');
    }

    const taskIds = tasksToUpdate.map((task) => task.id);

    const statusCaseWhen = sql`CASE ${sql.join(
      tasksToUpdate.map(
        (task) => sql`WHEN ${tasks.id} = ${task.id} THEN ${task.status}`,
      ),
      sql` `,
    )} ELSE ${tasks.status} END`;

    const positionCaseWhen = sql`CASE ${sql.join(
      tasksToUpdate.map(
        (task) => sql`WHEN ${tasks.id} = ${task.id} THEN ${task.position}`,
      ),
      sql` `,
    )} ELSE ${tasks.position} END`;

    const updatedTasks = await this.db
      .update(tasks)
      .set({
        status: statusCaseWhen,
        position: positionCaseWhen,
      })
      .where(inArray(tasks.id, taskIds))
      .returning();

    return updatedTasks;
  }
}
