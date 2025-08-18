import { z } from "zod";

export const taskCreateSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  due_date: z.string().min(1, { message: "Due Date is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  assignee_ids: z.array(z.any()).optional(),
  cause_id: z.string().optional(),
  event_id: z.string().optional(),
  priority: z.string().optional(),
});

export const taskEditSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  due_date: z.string().min(1, { message: "Due Date is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  assignee_ids: z.array(z.any()).optional(),
  cause_id: z.string().optional(),
  event_id: z.string().optional(),
  priority: z.string().optional(),
  assignees: z.array(z.any()).optional(),
  cause: z.object({ id: z.any() }).optional().nullable(),
  event: z.object({ id: z.any() }).optional().nullable(),
  created_at: z.string().optional(),
});

export type TaskCreateSchema = z.infer<typeof taskCreateSchema>;
export type TaskEditSchema = z.infer<typeof taskEditSchema>;

export type TaskSchemaWithId = TaskEditSchema & { id: number };
