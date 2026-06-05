import z from "zod";

export const registerFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username cannot exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters numbers, and underscores",
    }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .pipe(z.email({ message: "Please provide a valid email" })),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*_.?]{8,}$/, {
      message:
        "Password must contain at least one lowercase letter, one uppercase letter, one number, a special character and can include only !@#$%^&*_.?",
    })
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export type RegisterFormInputs = z.infer<typeof registerFormSchema>;
