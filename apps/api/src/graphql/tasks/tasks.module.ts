import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { MembersModule } from '../members/members.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [MembersModule, ProjectsModule],
  exports: [TasksService],
  providers: [TasksResolver, TasksService],
})
export class TasksModule {}
