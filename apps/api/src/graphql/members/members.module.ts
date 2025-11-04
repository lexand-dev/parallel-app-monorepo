import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersResolver } from './members.resolver';

@Module({
  exports: [MembersService],
  providers: [MembersResolver, MembersService],
})
export class MembersModule {}
