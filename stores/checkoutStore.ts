"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CreateOrderPayload, Order } from "@/types/order";

type CheckoutStep = 1 | 2 | 3;

type CheckoutStore = {
  step: CheckoutStep;
  reviewConfirmed: boolean;
  shippingConfirmed: boolean;
  shippingData: CreateOrderPayload | null;
  pendingOrder: Order | null;
  isCreatingOrder: boolean;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setStep: (step: CheckoutStep) => void;
  confirmReview: () => void;
  confirmShipping: () => void;
  setShippingData: (data: CreateOrderPayload) => void;
  setPendingOrder: (order: Order | null) => void;
  setIsCreatingOrder: (value: boolean) => void;
  resumePendingCheckout: (order: Order) => void;
  resetCheckout: () => void;
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      step: 1,
      reviewConfirmed: false,
      shippingConfirmed: false,
      shippingData: null,
      pendingOrder: null,
      isCreatingOrder: false,
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      setStep: (step) => {
        const state = get();

        // BLOCK forward skipping
        if (step === 2 && !state.reviewConfirmed) return;
        if (step === 3 && !state.shippingConfirmed) return;
        if (step === 3 && !state.pendingOrder) return;

        set({ step });
      },

      confirmReview: () =>
        set({
          reviewConfirmed: true,
          step: 2,
        }),

      confirmShipping: () =>
        set({
          shippingConfirmed: true,
          step: 3,
        }),

      setShippingData: (shippingData) => set({ shippingData }),

      setPendingOrder: (pendingOrder) => set({ pendingOrder }),

      setIsCreatingOrder: (isCreatingOrder) => set({ isCreatingOrder }),

      resumePendingCheckout: (order) =>
        set({
          step: (get().shippingConfirmed
            ? 3
            : get().reviewConfirmed
              ? 2
              : 1) as CheckoutStep,
          reviewConfirmed: true,
          shippingConfirmed: true,
          pendingOrder: order,
          shippingData: {
            shippingName: order.shippingName,
            shippingPhone: order.shippingPhone,
            shippingAddress: order.shippingAddress,
            shippingCity: order.shippingCity,
            shippingPostalCode: order.shippingPostalCode,
            shippingCountry: order.shippingCountry,
          },
        }),

      resetCheckout: () =>
        set({
          step: 1,
          reviewConfirmed: false,
          shippingConfirmed: false,
          shippingData: null,
          pendingOrder: null,
          isCreatingOrder: false,
        }),
    }),
    {
      name: "checkout-storage",

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
