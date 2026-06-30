import z from "zod";

export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" })
    .regex(/^[a-zA-Z\s\-']+$/, {
      // Allows letters, spaces, hyphens, and apostrophes (O'Connell, Jean-Luc, etc.)
      message: "Name contains invalid characters",
    }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .pipe(z.email({ message: "Please provide a valid email" })),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters long" })
    .max(1000, { message: "Message cannot exceed 1000 characters" }),
});

export type ContactFormInputs = z.infer<typeof contactSchema>;
