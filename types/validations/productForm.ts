import { z } from "zod";

export const productVariantSchema = z.object({
  color: z.string().min(1, "Color is required"),
  size: z.string().min(1, "Size is required"),
  stock: z.number().int().min(0, "Stock must be at least 0"),
  discountPercentage: z
    .number()
    .min(0, "Cannot be less than 0")
    .max(100, "Cannot exceed 100"),
});

export const createProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  basePrice: z.number().positive("Price must be greater than 0"),
  featured: z.boolean(),
  tags: z.string().optional(),
  images: z.string().min(1, "At least one image URL is required"),
  variants: z
    .array(productVariantSchema)
    .min(1, "At least one variant is required"),
});

export type CreateProductFormInputs = z.infer<typeof createProductSchema>;

export type CreateProductPayload = {
  title: string;
  description: string;
  categoryId: string;
  basePrice: number;
  featured: boolean;
  tags: string[];
  images: string[];
  variants: {
    color: string;
    size: string;
    stock: number;
    discountPercentage?: number;
  }[];
};

export type ProductVariantPayload = {
  color: string;
  size: string;
  stock: number;
  discountPercentage: number;
};

export const updateProductVariantSchema = z.object({
  sku: z.string().optional(), // Existing variants have a SKU, new ones don't
  color: z.string().min(1, "Color is required"),
  size: z.string().min(1, "Size is required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  discountPercentage: z
    .number()
    .min(0, "Cannot be less than 0")
    .max(100, "Cannot exceed 100"),
});

export const updateProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  basePrice: z.number().positive("Price must be greater than 0"),
  featured: z.boolean(),
  tags: z.string().optional(),
  images: z.string().min(1, "At least one image URL is required"),
  variants: z
    .array(updateProductVariantSchema)
    .min(1, "At least one variant is required"),
});

export type UpdateProductFormInputs = z.infer<typeof updateProductSchema>;
