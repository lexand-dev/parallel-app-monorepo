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
