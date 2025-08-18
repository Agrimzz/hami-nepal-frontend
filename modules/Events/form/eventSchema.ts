import { z } from "zod";

export const eventCreateSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  event_date: z.string().min(1, { message: "Event Date is required" }),
  location: z.string().min(1, { message: "Locations is required" }),
  cause_id: z.string().min(1, { message: "Cause ID is required" }),
});

export const eventEditSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  event_date: z.string().min(1, { message: "Event Date is required" }),
  location: z.string().min(1, { message: "Locations is required" }),
  cause_id: z.string().min(1, { message: "Cause ID is required" }),
});

export type EventCreateSchema = z.infer<typeof eventCreateSchema>;
export type EventEditSchema = z.infer<typeof eventEditSchema>;

export type EventSchemaWithId = EventEditSchema & { id: number };
