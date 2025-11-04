import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResolver } from './analytics.resolver';
import { ProjectsModule } from '../projects/projects.module';
import { MembersModule } from '../members/members.module';

@Module({
  exports: [AnalyticsService],
  imports: [ProjectsModule, MembersModule],
  providers: [AnalyticsResolver, AnalyticsService],
})
export class AnalyticsModule {}
