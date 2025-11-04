import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

export const ProjectSchemaInput = z.object({
  name: z.string(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === '' ? undefined : value)),
    ])
    .optional(),
  workspaceId: z.string(),
});

export const createProjectSchemaDto = z.object({
  name: z.string(),
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
  workspaceId: z.string(),
});

export type ProjectInput = z.infer<typeof ProjectSchemaInput>;
export class CreateProjectInputDto extends createZodDto(
  createProjectSchemaDto,
) {}
