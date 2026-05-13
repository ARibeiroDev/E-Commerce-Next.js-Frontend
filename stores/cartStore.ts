"use client";

import { create } from "zustand";
import * as cartApi from "@/lib/api/cart";
import { Cart } from "@/types/cart";

type CartStore = {
  cart: Cart | null;
  loading: boolean;

  fetchCart: () => Promise<void>;

  addToCart: (sku: string, quantity: number) => Promise<void>;

  updateCartItem: (sku: string, quantity: number) => Promise<void>;

  removeCartItem: (sku: string) => Promise<void>;

  clearCart: () => Promise<void>;

  resetCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });

    try {
      const cart = await cartApi.getCart();

      set({ cart });
    } finally {
      set({
        loading: false,
      });
    }
  },

  addToCart: async (sku, quantity) => {
    const cart = await cartApi.addItemToCart(sku, quantity);

    set({ cart });
  },

  updateCartItem: async (sku, quantity) => {
    const cart = await cartApi.updateCartItem(sku, quantity);

    set({ cart });
  },
  removeCartItem: async (sku) => {
    const cart = await cartApi.removeCartItem(sku);

    set({
      cart,
    });
  },

  clearCart: async () => {
    const cart = await cartApi.clearCart();

    set({
      cart,
    });
  },

  resetCart: () => {
    set({
      cart: null,
    });
  },
}));
