import z from "zod";

export const editUserFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username cannot exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters numbers, and underscores",
    }),
  password: z
    .string()
    .or(z.literal("")) // Allows empty form input field to pass
    .refine((val) => val === "" || val.length >= 8, {
      message: "Password must be at least 8 characters long",
    })
    .refine(
      (val) =>
        val === "" ||
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*_.?]{8,}$/.test(val),
      {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, a special character, and can include only !@#$%^&*_.?",
      },
    )
    .optional(), // Allows absence of the field
});

export type EditUserFormInputs = z.infer<typeof editUserFormSchema>;
