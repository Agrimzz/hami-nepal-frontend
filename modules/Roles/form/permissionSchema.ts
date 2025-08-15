import z from "zod";

export const permissionSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: "Name is required" }),
});

export type PermissionSchema = z.infer<typeof permissionSchema>;
