import { projects } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';

import { type DB, InjectDb } from '@/db/db.provider';
import { ProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';

@Injectable()
export class ProjectsService {
  constructor(@InjectDb() private readonly db: DB) {}

  async getProjects(workspaceId: ProjectInput['workspaceId']) {
    const projectsList = await this.db
      .select()
      .from(projects)
      .where(eq(projects.workspaceId, workspaceId))
      .orderBy(desc(projects.createdAt));

    return projectsList;
  }

  async getProjectById(projectId: string) {
    const [project] = await this.db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    return project;
  }

  async createProject({ name, workspaceId, image }: ProjectInput) {
    const [newProject] = await this.db
      .insert(projects)
      .values({
        name,
        workspaceId,
        image: typeof image === 'string' ? image : null,
      })
      .returning();

    return newProject;
  }

  async updateProject({ id, image, name }: UpdateProjectInput) {
    const [updatedProject] = await this.db
      .update(projects)
      .set({
        name,
        image: typeof image === 'string' ? image : null,
      })
      .where(eq(projects.id, id))
      .returning();

    return updatedProject;
  }

  async deleteProject(projectId: string) {
    const [deletedProject] = await this.db
      .delete(projects)
      .where(eq(projects.id, projectId))
      .returning();

    return deletedProject;
  }
}
