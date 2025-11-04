import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

export const updateProjectSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === '' ? undefined : value)),
    ])
    .optional(),
});

export const updateProjectSchemaDto = z.object({
  id: z.string(),
  name: z.string().optional(),
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

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export class UpdateProjectInputDto extends createZodDto(
  updateProjectSchemaDto,
) {}
