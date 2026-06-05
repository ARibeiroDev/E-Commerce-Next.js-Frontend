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

import { createOrder, getOrderById, cancelOrder } from "@/lib/api/orders";
import { ShippingFormInputs } from "@/types/validations/shippingForm";

const CheckoutPage = () => {
  const router = useRouter();
  const { items } = useCart();

  const [isCancelling, setIsCancelling] = useState(false);
  const [isOrderExpired, setIsOrderExpired] = useState(false);

  const {
    step,
    shippingData,
    setShippingData,
    pendingOrder,
    setPendingOrder,
    isCreatingOrder,
    setIsCreatingOrder,
    resetCheckout,
    confirmReview,
    confirmShipping,
  } = useCheckoutStore();

  const { isAuthenticated, isLoading } = useAuthStore();
  const hasHydrated = useCheckoutStore((state) => state.hasHydrated);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?redirect=/checkout");
    }
  }, [isAuthenticated, isLoading, router]);

  // Order validation guard
  useEffect(
    () => {
      if (isLoading || !isAuthenticated || !pendingOrder) return;

      const validateOrder = async () => {
        try {
          const freshOrder = await getOrderById(pendingOrder.id);

          const isExpired =
            freshOrder.expiresAt && new Date(freshOrder.expiresAt) < new Date();

          const isInvalid = freshOrder.status !== "PENDING";

          if (isExpired || isInvalid) {
            // Lock the UI instead of deteleting the cart
            setIsOrderExpired(true);
          } else {
            // Sync frontend state with fresh backend data
            setPendingOrder(freshOrder);
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      pendingOrder?.id, // Use ID to prevent infinite re-render loop
      isLoading,
      isAuthenticated,
      resetCheckout,
      setPendingOrder,
    ],
  );

  const handleShippingSubmit = async (data: ShippingFormInputs) => {
    if (isCreatingOrder || pendingOrder) return;

    setShippingData(data);
    setIsCreatingOrder(true);

    try {
      const order = await createOrder(data);
      setPendingOrder(order);
      confirmShipping();
    } catch (error) {
      console.error("Error creating order:", error);
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
    router.push("/cart");
  };

  const hasActiveCheckout = !!pendingOrder;

  if (isLoading || !hasHydrated) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p>Loading checkout...</p>
      </main>
    );
  }

  if (!hasActiveCheckout && items.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p>Your cart is empty.</p>
      </main>
    );
  }

  const subtotal = items.reduce(
    (acc, item) => acc + item.finalPrice * item.quantity,
    0,
  );

  return (
    <main className="flex-1 max-w-7xl mx-auto p-6 flex flex-col gap-10">
      <header className="flex justify-center">
        <CheckoutSteps currentStep={step} />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 border rounded-xl p-6">
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

        <aside className="border rounded-xl p-6 h-fit flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          {pendingOrder ? (
            <>
              <div className="flex justify-between">
                <span>Total</span>

                <span className="font-semibold">
                  ${Number(pendingOrder.total).toFixed(2)}
                </span>
              </div>

              <p className="text-sm text-gray-500">
                Total locked at order creation.
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span>Subtotal</span>

                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>

                <span>${subtotal.toFixed(2)}</span>
              </div>
            </>
          )}
        </aside>
      </div>
    </main>
  );
};

export default CheckoutPage;
