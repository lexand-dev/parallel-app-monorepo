import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';
import { MembersModule } from '../members/members.module';
import { UploadThingModule } from '../../upload/uploathing.module';

@Module({
  imports: [MembersModule, UploadThingModule],
  exports: [ProjectsService],
  providers: [ProjectsResolver, ProjectsService],
})
export class ProjectsModule {}
