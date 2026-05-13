import { ProductVariant } from "@/types/product";

export type CartItem = {
  id: string;
  cartId: string;
  variantId: ProductVariant["id"];
  quantity: number;
  productVariant: ProductVariant & {
    product: {
      id: string;
      title: string;
      basePrice: string;
      images: string[];
    };
  };
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
};
