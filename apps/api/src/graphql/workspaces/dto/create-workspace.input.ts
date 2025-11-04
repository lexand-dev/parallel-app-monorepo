import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import type { FileUpload } from '../../projects/dto/create-project.input';

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, 'Name workspace is required'),
  userId: z.string().trim().min(1, 'User ID is required'),
  inviteCode: z.string().trim(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === '' ? undefined : value)),
    ])
    .optional(),
});

export const createWorkspaceDto = z.object({
  name: z.string().trim().min(1, 'Name workspace is required'),
  image: z
    .object({
      file: z
        .custom<Promise<FileUpload>>((value) => {
          return value instanceof Promise;
        })
        .optional(),
      url: z.string().transform((value) => (value === '' ? undefined : value)),
    })
    .optional(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export class CreateWorkspaceInputDto extends createZodDto(createWorkspaceDto) {}
