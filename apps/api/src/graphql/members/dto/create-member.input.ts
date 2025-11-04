import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const MemberSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'MEMBER']),
  workspaceId: z.string().min(1),
  memberId: z.string().min(1),
});

export type MemberInput = z.infer<typeof MemberSchema>;
export class MemberInputDto extends createZodDto(MemberSchema) {}
