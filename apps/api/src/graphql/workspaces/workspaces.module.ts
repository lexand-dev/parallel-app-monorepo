import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesResolver } from './workspaces.resolver';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [MembersModule],
  providers: [WorkspacesResolver, WorkspacesService],
})
export class WorkspacesModule {}
