import { apiFetch } from "@/lib/api-client";
import { CreateOrderPayload, Order } from "@/types/order";
import { PaginatedResponse } from "@/types/pagination";

const endpoint = "orders";

export const createOrder = (payload: CreateOrderPayload) => {
  return apiFetch<Order>(endpoint, {
    method: "POST",
    body: JSON.stringify(payload),
    requiresAuth: true,
  });
};

export const getMyOrders = ({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  orderBy = "desc",
}: {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "status";
  orderBy?: "asc" | "desc";
}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy,
    orderBy,
  });

  return apiFetch<PaginatedResponse<Order[]>>(
    `${endpoint}/me?${params.toString()}`,
    {
      method: "GET",
      requiresAuth: true,
    },
  );
};

export const getOrderById = (orderId: string) => {
  return apiFetch<Order>(`${endpoint}/${orderId}`, {
    method: "GET",
    requiresAuth: true,
  });
};

export const confirmOrder = (orderId: string, paymentIntentId: string) => {
  return apiFetch<Order>(`${endpoint}/${orderId}/confirm`, {
    method: "PATCH",
    requiresAuth: true,
    body: JSON.stringify({ paymentIntentId }),
  });
};

export const cancelOrder = (orderId: string) => {
  return apiFetch<{ success: boolean; message: string }>(
    `${endpoint}/${orderId}/cancel`,
    {
      method: "PATCH",
      requiresAuth: true,
    },
  );
};
