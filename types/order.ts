export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "REFUND_REQUESTED"
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
  id?: string;
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
  userId: string;
  expiresAt?: string;
  createdAt: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
};
