export type CartUIItem = {
  sku: string;

  title: string;
  slug: string;

  image: string;

  quantity: number;

  size: string;
  color: string;

  stock: number;

  basePrice: number;
  finalPrice: number;

  discountPercentage: number | null;
};
