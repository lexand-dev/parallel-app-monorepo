import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import type { FileUpload } from '../../projects/dto/create-project.input';

export const updateWorkspaceSchema = z.object({
  id: z.string().trim().min(1, 'Workspace ID is required'),
  name: z.string().trim().min(1, 'Name workspace is required'),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === '' ? undefined : value)),
    ])
    .optional(),
});

export const updateWorkspaceDto = z.object({
  id: z.string().trim().min(1, 'Workspace ID is required'),
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

export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export class UpdateWorkspaceInputDto extends createZodDto(updateWorkspaceDto) {}
