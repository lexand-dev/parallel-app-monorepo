import z from 'zod';

export const workspaceSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, 'Required'),
  description: z.string().trim().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type WorkspaceType = z.infer<typeof workspaceSchema>;
