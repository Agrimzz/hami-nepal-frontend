import { z } from "zod";

export const causeSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  status: z.string().min(1, { message: "Status is required" }),
});

export type CauseSchema = z.infer<typeof causeSchema>;
