import { Injectable } from '@nestjs/common';
import { CreateMemberInput } from './dto/create-member.input';
import { UpdateMemberInput } from './dto/update-member.input';

@Injectable()
export class MembersService {
  getMembers(createMemberInput: CreateMemberInput) {
    return 'This action adds a new member';
  }

  updateRole(memberId: string, workspaceId: string, role: string) {
    return `This action updates a #${memberId} member`;
  }

  removeMember(memberId: string, workspaceId: string) {
    return `This action removes a #${memberId} member`;
  }
}
