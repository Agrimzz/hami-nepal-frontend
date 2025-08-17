import z from "zod";

export const donationCreateSchema = z.object({
  type: z.enum(["fund", "kind"]),
  amount: z.string().min(1, { message: "Amount is required" }),
});

export const donationEditSchema = z.object({
  type: z.enum(["fund", "kind"]),
  amount: z.string().optional(),
  donated_at: z.string().optional(),
});

export type DonationCreateSchema = z.infer<typeof donationCreateSchema>;
export type DonationEditSchema = z.infer<typeof donationEditSchema>;

export type DonationSchemaWithId = DonationEditSchema & { id: number };
