import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsInput } from './dto/create-analytics.input';
import { UpdateAnalyticsInput } from './dto/update-analytics.input';

@Resolver('Analytics')
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}
}
