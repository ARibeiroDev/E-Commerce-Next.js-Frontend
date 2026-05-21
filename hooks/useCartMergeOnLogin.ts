"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useGuestCartStore } from "@/stores/guestCartStore";
import { mergeGuestCart } from "@/lib/api/cart";
import { useCartStore } from "@/stores/cartStore";

export const useCartMergeOnLogin = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  const guestItems = useGuestCartStore((state) => state.items);
  const clearGuestCart = useGuestCartStore((state) => state.clearCart);

  const fetchCart = useCartStore((state) => state.fetchCart);

  // Tracks previous auth state so that a true login event can be detected
  const prevAuthRef = useRef(false);

  // Prevents double merge (React 18 Strict mode runs twice in dev)
  const mergedRef = useRef(false);

  useEffect(() => {
    // Wait for hydration to finish before doing anything
    if (isLoading) return;

    const justLoggedIn = !prevAuthRef.current && isAuthenticated;
    const justLoggedOut = prevAuthRef.current && !isAuthenticated;

    // Update previous auth state for next render cycle
    prevAuthRef.current = isAuthenticated;

    // Reset on logout
    if (justLoggedOut) {
      mergedRef.current = false;
      return;
    }

    // Only trigger merge once per login
    if (!justLoggedIn) return;

    // Prevent double merge execution
    if (mergedRef.current) return;

    // No guest cart to merge
    if (!guestItems.length) {
      mergedRef.current = true;
      return;
    }

    const runMerge = async () => {
      try {
        mergedRef.current = true;

        // Send guest cart to backend
        await mergeGuestCart(guestItems);

        // Only clear guest cart after successful merge
        clearGuestCart();

        // Refresh server cart after merge
        await fetchCart();
      } catch (error: unknown) {
        console.error(
          error instanceof Error
            ? error.message
            : "An error occurred while merging guest cart.",
        );

        // Allow retry on next login attempt if merge fails
        mergedRef.current = false;
      }
    };

    runMerge();
  }, [isAuthenticated, isLoading, guestItems, clearGuestCart, fetchCart]);
};
