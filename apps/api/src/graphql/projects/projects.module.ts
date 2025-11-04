import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [MembersModule],
  exports: [ProjectsService],
  providers: [ProjectsResolver, ProjectsService],
})
export class ProjectsModule {}
