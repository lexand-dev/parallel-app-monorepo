import { Test, TestingModule } from '@nestjs/testing';
import { WorkspacesResolver } from './workspaces.resolver';
import { WorkspacesService } from './workspaces.service';
import { MembersService } from '../members/members.service';
import { MembersResolver } from '../members/members.resolver';
import { UTAPI_TOKEN } from '../../upload/uploathing.module';
import { DB_CONNECTION } from '../../db/db.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('WorkspacesResolver', () => {
  let resolver: WorkspacesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspacesResolver,
        WorkspacesService,
        MembersService,
        MembersResolver,
        {
          provide: UTAPI_TOKEN,
          useValue: {}, // Mock or provide a real instance as needed
        },
        {
          provide: DB_CONNECTION,
          useValue: {}, // Mock or provide a real instance as needed
        },
        {
          provide: JwtService,
          useValue: {}, // Mock or provide a real instance as needed
        },
        {
          provide: ConfigService,
          useValue: {}, // Mock or provide a real instance as needed
        },
      ],
    }).compile();

    resolver = module.get<WorkspacesResolver>(WorkspacesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
