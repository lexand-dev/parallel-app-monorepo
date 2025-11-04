import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [MembersModule],
  exports: [TasksService],
  providers: [TasksResolver, TasksService],
})
export class TasksModule {}
