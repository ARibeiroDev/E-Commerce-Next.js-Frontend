import z from "zod";

export const loginFormSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, { message: "Username or email is required" })
    .refine(
      (val) => {
        // Valid email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Valid username regex (same as register)
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

        return emailRegex.test(val) || usernameRegex.test(val);
      },
      {
        message: "Must be a valid username or email",
      },
    ),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginFormInputs = z.infer<typeof loginFormSchema>;
