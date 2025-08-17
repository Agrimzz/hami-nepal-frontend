import { z } from "zod";

export const causeCreateSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  status: z.string().min(1, { message: "Status is required" }),
});

export const causeEditSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  created_at: z.string().optional(),
});

export type CauseCreateSchema = z.infer<typeof causeCreateSchema>;
export type CauseEditSchema = z.infer<typeof causeEditSchema>;

export type CauseSchemaWithId = CauseEditSchema & { id: number };
