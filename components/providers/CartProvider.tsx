"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useCartMergeOnLogin } from "@/hooks/useCartMergeOnLogin";

const CartProvider = () => {
  const { isAuthenticated, isLoading } = useAuthStore((state) => state);

  const fetchCart = useCartStore((state) => state.fetchCart);
  const resetCart = useCartStore((state) => state.resetCart);

  // Merge guest cart after auth finishes loading
  useCartMergeOnLogin();

  useEffect(() => {
    // Wait until auth initialization finishes
    if (isLoading) return;

    if (isAuthenticated) {
      fetchCart();
    } else {
      resetCart();
    }
  }, [isAuthenticated, isLoading, fetchCart, resetCart]);

  return null;
};

export default CartProvider;
