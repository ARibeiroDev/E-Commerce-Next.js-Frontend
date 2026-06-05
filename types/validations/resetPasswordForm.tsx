import z from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%&*_.?]{8,}$/,
        "Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 special character.",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Attaches the error to the confirmPassword field
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
