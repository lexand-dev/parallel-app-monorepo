import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesResolver } from './workspaces.resolver';
import { MembersModule } from '../members/members.module';
import { UploadThingModule } from '../../upload/uploathing.module';

@Module({
  imports: [MembersModule, UploadThingModule],
  providers: [WorkspacesResolver, WorkspacesService],
})
export class WorkspacesModule {}
