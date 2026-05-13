import { apiFetch } from "@/lib/api-client";
import { Cart } from "@/types/cart";

const endpoint = "cart";

export const getCart = () => {
  return apiFetch<Cart>(endpoint, {
    method: "GET",
    requiresAuth: true,
  });
};

export const addItemToCart = (sku: string, quantity: number) => {
  return apiFetch<Cart>(`${endpoint}/add`, {
    method: "POST",
    requiresAuth: true,
    body: JSON.stringify({
      sku,
      quantity,
    }),
  });
};

export const updateCartItem = (sku: string, quantity: number) => {
  return apiFetch<Cart>(`${endpoint}/update`, {
    method: "PATCH",
    requiresAuth: true,
    body: JSON.stringify({
      sku,
      quantity,
    }),
  });
};

export const removeCartItem = (sku: string) => {
  return apiFetch<Cart>(`${endpoint}/remove/${sku}`, {
    method: "DELETE",
    requiresAuth: true,
  });
};

export const clearCart = () => {
  return apiFetch<Cart>(`${endpoint}/clear`, {
    method: "DELETE",
    requiresAuth: true,
  });
};

export const mergeGuestCart = (
  items: {
    sku: string;
    quantity: number;
  }[],
) => {
  return apiFetch<Cart>(`${endpoint}/merge`, {
    method: "POST",
    requiresAuth: true,
    body: JSON.stringify({ items }),
  });
};
