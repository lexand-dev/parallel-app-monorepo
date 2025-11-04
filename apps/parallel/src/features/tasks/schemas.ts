import { z } from "zod";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE"
}

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, "Required"),
  description: z.string().optional()
});

export const updateTaskSchema = z.object({
  id: z.string().trim().min(1, "Required"),
  name: z.string().trim().min(1, "Required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  dueDate: z.coerce.date(),
  projectId: z.string().trim().min(1, "Required"),
  assigneeId: z.string().trim().min(1, "Required")
});

export const taskSchema = z.object({
  id: z.string().trim().min(1, "Required"),
  name: z.string().trim().min(1, "Required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  dueDate: z.string(),
  assigneeId: z.string().trim().min(1, "Required"),
  description: z.string().optional(),
  position: z.number().int().min(0, "Position must be a non-negative integer")
});

export type Task = z.infer<typeof taskSchema>;

export type TaskFull = Task & {
  project: {
    id: string;
    name: string;
    image: string;
  };
  assignee: {
    name: string;
  };
};
