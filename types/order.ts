// types/order.ts

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type CreateOrderPayload = {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
};

export type OrderItem = {
  productName: string;
  variantSku: string;
  size: string;
  color: string;
  quantity: number;
  priceAtPurchase: string;
};

export type Order = {
  id: string;
  status: OrderStatus;
  total: string;
  items: OrderItem[];
  expiresAt?: string;
  createdAt: string;
};
