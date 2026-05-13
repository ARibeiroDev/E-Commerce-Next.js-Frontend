"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";

const CartProvider = () => {
  const { isAuthenticated } = useAuthStore((state) => state);

  const fetchCart = useCartStore((state) => state.fetchCart);
  const resetCart = useCartStore((state) => state.resetCart);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      resetCart();
    }
  }, [isAuthenticated, fetchCart, resetCart]);

  return null;
};

export default CartProvider;
