import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import type { ReadStreamOptions } from 'fs-capacitor';
import type { Readable } from 'node:stream';

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  // We omit the capacitor property because it's a private implementation detail that shouldn't be used outside.
  createReadStream: FileUploadCreateReadStream;
}

export type FileUploadCreateReadStream = (
  options?: FileUploadCreateReadStreamOptions,
) => Readable;

export interface FileUploadCreateReadStreamOptions {
  encoding?: ReadStreamOptions['encoding'];
  highWaterMark?: ReadStreamOptions['highWaterMark'];
}

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
