"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type GuestCartItem = {
  sku: string;
  quantity: number;
  slug: string;

  productTitle: string;
  image: string;

  color: string;
  size: string;

  price: number;
  stock: number;
  discountPercentage: number | null;
};

export type GuestCartStore = {
  items: GuestCartItem[];

  // Actions
  addItem: (item: GuestCartItem) => void;
  removeItem: (sku: string) => void;
  updateItem: (sku: string, quantity: number) => void;
  clearCart: () => void;

  // Helpers
  getTotalItems: () => number;
  getItem: (sku: string) => GuestCartItem | undefined;
};

export const useGuestCartStore = create<GuestCartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Actions
      addItem: (item) => {
        let added = false;
        set((state) => {
          const existing = state.items.find((i) => i.sku === item.sku);

          const currentQty = existing?.quantity || 0;
          const nextQty = currentQty + item.quantity;

          const maxQty = item.stock;

          if (nextQty > maxQty) {
            added = false;
            return state;
          }

          added = true;

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.sku === item.sku
                  ? {
                      ...i,
                      quantity: nextQty,
                    }
                  : i,
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        });

        return added;
      },

      updateItem: (sku, quantity) => {
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter((i) => i.sku !== sku),
          }));
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.sku === sku ? { ...i, quantity } : i,
          ),
        }));
      },

      removeItem: (sku) => {
        set((state) => ({
          items: state.items.filter((i) => i.sku !== sku),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      // Helpers
      getTotalItems: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      getItem: (sku) => {
        return get().items.find((i) => i.sku === sku);
      },
    }),
    {
      name: "guest-cart",
      storage: createJSONStorage(() => sessionStorage), // swap to localStorage if you prefer persistence
    },
  ),
);
