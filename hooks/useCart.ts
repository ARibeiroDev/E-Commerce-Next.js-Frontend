"use client";

import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { GuestCartItem, useGuestCartStore } from "@/stores/guestCartStore";
import { CartUIItem } from "@/types/uiCart";

const useCart = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const userCart = useCartStore((state) => state.cart);

  const guestItems = useGuestCartStore((state) => state.items);

  // Guest actions
  const addGuestItem = useGuestCartStore((state) => state.addItem);
  const updateGuestItem = useGuestCartStore((state) => state.updateItem);
  const removeGuestItem = useGuestCartStore((state) => state.removeItem);
  const clearGuestCart = useGuestCartStore((state) => state.clearCart);

  // User actions
  const addUserItem = useCartStore((state) => state.addToCart);
  const updateUserItem = useCartStore((state) => state.updateCartItem);
  const removeUserItem = useCartStore((state) => state.removeCartItem);
  const clearUserCart = useCartStore((state) => state.clearCart);

  // Normalized UI items
  const items: CartUIItem[] = isAuthenticated
    ? (userCart?.items ?? []).map((item) => ({
        sku: item.productVariant.sku,
        title: item.productVariant.product.title,
        image: item.productVariant.product.images[0],
        basePrice: Number(item.productVariant.product.basePrice),
        finalPrice: Number(item.productVariant.finalPrice),
        discountPercentage: item.productVariant.discountPercentage,
        slug: item.productVariant.product.slug,
        quantity: item.quantity,
        size: item.productVariant.size,
        color: item.productVariant.color,
        stock: item.productVariant.stock,
      }))
    : guestItems.map((item) => ({
        sku: item.sku,
        title: item.productTitle,
        image: item.image,
        basePrice:
          item.discountPercentage && item.discountPercentage < 100
            ? Number(
                (item.price / (1 - item.discountPercentage / 100)).toFixed(2),
              )
            : item.price,
        finalPrice: item.price,
        discountPercentage: item.discountPercentage,
        slug: item.slug,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        stock: item.stock,
      }));

  return {
    items,
    isAuthenticated,

    addToCart: async (item: GuestCartItem) => {
      if (isAuthenticated) {
        try {
          await addUserItem(item.sku, item.quantity);
          return { success: true };
        } catch (error: unknown) {
          console.error(
            error instanceof Error ? error.message : "An error occurred",
          );
          return { success: false };
        }
      }

      const success = addGuestItem(item);
      return { success };
    },

    updateCartItem: isAuthenticated ? updateUserItem : updateGuestItem,

    removeCartItem: isAuthenticated ? removeUserItem : removeGuestItem,

    clearCart: isAuthenticated ? clearUserCart : clearGuestCart,
  };
};

export default useCart;
