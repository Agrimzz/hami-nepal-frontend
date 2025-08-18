import { z } from "zod";

export const userCreateSchema = z.object({
  full_name: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zip_code: z.string().optional(),
  skills: z.string().optional(),
  bio: z.string().optional(),
  profile_picture_id: z.string().optional(),
  group_ids: z.array(z.number()).optional(),
});

export const userEditSchema = z.object({
  full_name: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().optional(), // optional on edit
  phone_number: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zip_code: z.string().optional(),
  skills: z.string().optional(),
  bio: z.string().optional(),
  profile_picture: z
    .object({
      file: z.string().url(),
      file_type: z.string(),
      id: z.string(),
    })
    .nullable()
    .optional(),
  profile_picture_id: z.string().optional(),
  group_ids: z.array(z.any()).optional(), // backend sends empty array
  groups: z.array(z.any()).optional(),
  achievements: z.array(z.any()).optional(),
  date_joined: z.string().optional(),
  last_updated: z.string().optional(),
  is_active: z.boolean().optional(),
  is_staff: z.boolean().optional(),
  joined_as_volunteer_date: z.string().nullable().optional(),
});

export type UserCreateSchema = z.infer<typeof userCreateSchema>;
export type UserEditSchema = z.infer<typeof userEditSchema>;

export type UserSchemaWithId = UserEditSchema & { id: number };
