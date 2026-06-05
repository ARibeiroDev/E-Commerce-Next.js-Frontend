import z from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .pipe(z.email({ message: "Please provide a valid email" })),
});

export type EmailValues = z.infer<typeof emailSchema>;
