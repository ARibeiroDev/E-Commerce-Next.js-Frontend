import z from "zod";

export const paymentFormSchema = z.object({
  cardholderName: z.string().min(2, "Cardholder name is required"),
  cardNumber: z
    .string()
    .regex(/^[\d\s]{16,19}$/, "Invalid card number (must be 16 digits)"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format must be MM/YY"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

export type PaymentFormInputs = z.infer<typeof paymentFormSchema>;
