"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import useCart from "@/hooks/useCart";

import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import CheckoutReviewStep from "@/components/checkout/CheckoutReviewStep";
import CheckoutShippingStep from "@/components/checkout/CheckoutShippingStep";
import CheckoutPaymentStep from "@/components/checkout/CheckoutPaymentStep";

import { useCheckoutStore } from "@/stores/checkoutStore";
import { useAuthStore } from "@/stores/authStore";

import {
  createOrder,
  getOrderById,
  cancelOrder,
  getMyOrders,
} from "@/lib/api/orders";
import { ShippingFormInputs } from "@/types/validations/shippingForm";
import { toast } from "react-toastify";
import {
  extractStockConflict,
  StockConflict,
} from "@/utils/extractConflictError";
import CheckoutConflictModal from "@/components/checkout/CheckoutConflictModal";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

const SHIPPING_THRESHOLD = 100;
const SHIPPING_FEE = 15;

const CheckoutPage = () => {
  const router = useRouter();
  const { items, updateCartItem, removeCartItem } = useCart();

  const [isCancelling, setIsCancelling] = useState(false);
  const [isOrderExpired, setIsOrderExpired] = useState(false);

  // State to control the stock conflict modal
  const [conflictData, setConflictData] = useState<StockConflict | null>(null);

  const {
    step,
    setStep, // Pulled in to enforce state sync
    shippingData,
    setShippingData,
    pendingOrder,
    setPendingOrder,
    isCreatingOrder,
    setIsCreatingOrder,
    resetCheckout,
    confirmReview,
    confirmShipping,
    resumePendingCheckout,
  } = useCheckoutStore();

  const { user, isAuthenticated, isLoading } = useAuthStore();
  const hasHydrated = useCheckoutStore((state) => state.hasHydrated);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Order validation guard
  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    const validateOrder = async () => {
      try {
        // Storage integrity check: If token expired without manual logout
        // localStorage might still hold the previous user's checkout data, wipe it
        if (pendingOrder && pendingOrder.userId !== user.id) {
          console.warn(
            "Order user mismatch detected. Resetting checkout state.",
          );
          resetCheckout();
          return;
        }

        // If user returned after logging out, reset their checkout data
        if (!pendingOrder) {
          const res = await getMyOrders({
            limit: 1,
            sortBy: "createdAt",
            orderBy: "desc",
          });
          const latestOrder = res.data[0];

          if (latestOrder && latestOrder.status === "PENDING") {
            const isExpired =
              latestOrder.expiresAt &&
              new Date(latestOrder.expiresAt) < new Date();

            // Rehydrate the store
            if (!isExpired) {
              resumePendingCheckout(latestOrder);
            }
          }
          return; // The state update will trigger a re-render and hit step 3 validation next cycle.
        }

        // Standard validation for an existing order in localStorage
        const freshOrder = await getOrderById(pendingOrder.id);

        const isExpired =
          freshOrder.expiresAt && new Date(freshOrder.expiresAt) < new Date();

        const isInvalid = freshOrder.status !== "PENDING";

        if (isExpired || isInvalid) {
          setIsOrderExpired(true);
        } else {
          setPendingOrder(freshOrder);
          // Auto-sync step to 3 when resuming to ensure the UI renders correctly even if local storage `step` was wiped/corrupted
          if (step !== 3) {
            setStep(3);
          }
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes("not found")) {
          console.warn("Order no longer exists, resetting checkout.");
          resetCheckout();
        } else {
          console.error(
            "Order validation failed due to network/server error:",
            error,
          );
        }
      }
    };

    validateOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pendingOrder?.id,
    user?.id,
    isLoading,
    isAuthenticated,
    resetCheckout,
    setPendingOrder,
    setStep,
    step,
    pendingOrder,
    resumePendingCheckout,
  ]);

  const handleShippingSubmit = async (data: ShippingFormInputs) => {
    if (isCreatingOrder || pendingOrder) return;

    setShippingData(data);
    setIsCreatingOrder(true);

    try {
      const order = await createOrder(data);
      setPendingOrder(order);
      confirmShipping();
    } catch (error: unknown) {
      const conflict = extractStockConflict(error);

      if (conflict) {
        setConflictData(conflict);
        return;
      }

      console.error("Error creating order:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create order.",
      );
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!pendingOrder || isCancelling) return;

    setIsCancelling(true);
    try {
      await cancelOrder(pendingOrder.id);
      resetCheckout();
      router.push("/cart");
    } catch (error) {
      console.error("Failed to cancel order safely:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReturnToCart = () => {
    resetCheckout();
    setConflictData(null);
    router.push("/cart");
  };

  const handleAdjustAndContinue = () => {
    if (!conflictData) return;

    if (conflictData.availableStock > 0) {
      // Adjust the cart quantity down to what is available
      updateCartItem(conflictData.sku, conflictData.availableStock);
      toast.info(
        `Cart updated to the remaining ${conflictData.availableStock} units.`,
      );
      setConflictData(null);
    } else {
      // If it completely sold out while they were typing their address
      removeCartItem(conflictData.sku);
      toast.error(
        "This item has completely run out of stock and was removed from your cart.",
      );
      setConflictData(null);

      // If that was the only item in their cart, send them back
      if (items.length <= 1) {
        handleReturnToCart();
      }
    }
  };

  const hasActiveCheckout = !!pendingOrder;

  if (isLoading || !hasHydrated) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div aria-busy="true" className="animate-pulse font-medium">
          Loading checkout...
        </div>
      </main>
    );
  }

  if (!hasActiveCheckout && items.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[50vh]">
        <p className="font-medium">Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto p-6 flex flex-col gap-10">
      <header className="flex justify-center">
        <CheckoutSteps currentStep={step} />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 border border-gray-300 dark:border-stone-700 rounded-xl p-6 bg-white dark:bg-stone-900">
          {step === 1 && (
            <div className="flex flex-col gap-8">
              <CheckoutReviewStep />
              <button
                onClick={confirmReview}
                className="bg-black text-white dark:bg-white dark:text-black p-3 rounded-md hover:opacity-90 transition cursor-pointer"
              >
                Continue to shipping
              </button>
            </div>
          )}

          {step === 2 && (
            <CheckoutShippingStep
              defaultValues={shippingData || undefined}
              onSubmit={handleShippingSubmit}
            />
          )}

          {step === 3 && pendingOrder && (
            <div className="flex flex-col gap-6">
              <CheckoutPaymentStep
                order={pendingOrder}
                isExpired={isOrderExpired}
                onExpire={() => setIsOrderExpired(true)}
              />

              <div className="border-t pt-4 mt-2">
                {isOrderExpired ? (
                  <button
                    onClick={handleReturnToCart}
                    className="w-full bg-black text-white dark:bg-white dark:text-black p-3 rounded-md hover:opacity-90 transition cursor-pointer text-center font-medium shadow-sm"
                  >
                    Order Expired — Return to Cart
                  </button>
                ) : (
                  <button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="w-full text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 p-3 rounded-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center font-medium"
                  >
                    {isCancelling
                      ? "Processing cancellation..."
                      : "Cancel Order & Modify Cart"}
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        <CheckoutSummary
          items={items}
          pendingOrder={pendingOrder}
          shippingThreshold={SHIPPING_THRESHOLD}
          shippingFee={SHIPPING_FEE}
        />
      </div>

      {conflictData && (
        <CheckoutConflictModal
          conflictData={conflictData}
          handleAdjustAndContinue={handleAdjustAndContinue}
          handleReturnToCart={handleReturnToCart}
        />
      )}
    </main>
  );
};

export default CheckoutPage;
