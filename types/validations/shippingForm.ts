import z from "zod";

export const shippingFormSchema = z.object({
  shippingName: z.string().min(2, "Name must contain at least 2 characters"),

  shippingPhone: z.string().min(6, "Phone number is too short"),

  shippingAddress: z.string().min(5, "Address is too short"),

  shippingCity: z.string().min(2, "City is required"),

  shippingPostalCode: z.string().min(3, "Postal code is required"),

  shippingCountry: z.string().min(2, "Country is required"),
});

export type ShippingFormInputs = z.infer<typeof shippingFormSchema>;
