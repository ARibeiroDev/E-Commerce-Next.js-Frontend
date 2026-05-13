export type Category = {
  id: string;
  name: string;
};

export type ProductVariant = {
  id: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  reservedStock: number;
  discountPercentage: number | null;
  finalPrice: string; // Prisma Decimal comes as string in JSON
  productId: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  categoryId: string;
  category: Category;
  basePrice: string;
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
};
