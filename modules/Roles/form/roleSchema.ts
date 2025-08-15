import z from "zod";

export const roleSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  permissions: z
    .array(z.number())
    .min(1, { message: "At least one permission is required" }),
});

export type RoleSchema = z.infer<typeof roleSchema>;

export type RoleSchemaWithId = RoleSchema & { id: number };
