import z from 'zod';
import { createZodDto } from 'nestjs-zod';

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}

export const TaskSchema = z.object({
  id: z.string().optional(),
  position: z.number().optional(),
  name: z.string().trim().min(1, 'Required'),
  status: z.nativeEnum(TaskStatus, { required_error: 'Required' }),
  workspaceId: z.string().trim().min(1, 'Required'),
  projectId: z.string().trim().min(1, 'Required'),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, 'Required'),
  description: z.string().optional(),
});

export type TaskInput = z.infer<typeof TaskSchema>;
export class CreateTaskInput extends createZodDto(TaskSchema) {}
