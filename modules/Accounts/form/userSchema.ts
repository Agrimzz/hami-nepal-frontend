import { z } from "zod";

export const userCreateSchema = z.object({
  full_name: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const userEditSchema = z.object({
  full_name: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().optional(), // not required on edit
});

export type UserCreateSchema = z.infer<typeof userCreateSchema>;
export type UserEditSchema = z.infer<typeof userEditSchema>;

export type UserSchemaWithId = UserEditSchema & { id: number };
