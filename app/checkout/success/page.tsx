"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { getOrderById } from "@/lib/api/orders";
import Loading from "@/app/loading";

const SuccessPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { isLoading, isAuthenticated } = useAuthStore();

  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidOrder, setIsValidOrder] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!orderId) {
      router.replace("/shop");
      return;
    }

    const verifyOrder = async () => {
      try {
        const order = await getOrderById(orderId);

        if (order && order.status === "PAID") {
          setIsValidOrder(true);
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.message.includes("not found")) {
          console.warn("Order not found.");
        } else {
          console.error(
            "Order validation failed due to network/server error:",
            error,
          );
        }
        router.replace("/shop");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyOrder();
  }, [isAuthenticated, isLoading, router, orderId]);

  // Skeleton loading
  if (isVerifying) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center min-h-[50vh] p-6">
        <div
          role="status"
          aria-live="polite"
          className="animate-pulse flex flex-col items-center space-y-4"
        >
          <Loading />
          <p className="text-gray-500 font-medium text-sm">
            Verifying your order...
          </p>
        </div>
      </main>
    );
  }

  // Fallback for when the order is not found
  if (!isValidOrder) {
    return null;
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
      <header className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Payment Successful</h2>

        <p className="text-gray-600 dark:text-stone-400">
          Your order has been confirmed.
        </p>
      </header>

      {orderId && (
        <dl className="bg-gray-100 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 p-5 rounded-xl text-sm w-full max-w-150 text-center shadow-sm">
          <dt className="text-stone-500 dark:text-stone-400 font-medium mb-1">
            Your Order ID
          </dt>
          <dd className="font-mono font-bold text-base text-stone-900 dark:text-white select-all">
            {orderId}
          </dd>
        </dl>
      )}

      <div className="flex gap-4">
        <Link
          href="/profile"
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md"
        >
          View Orders
        </Link>

        <Link href="/shop" className="border px-4 py-2 rounded-md">
          Continue Shopping
        </Link>
      </div>
    </main>
  );
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex flex-col items-center justify-center min-h-[50vh] p-6">
          <div
            role="status"
            className="animate-pulse flex flex-col items-center space-y-4"
          >
            <Loading />
            <p className="text-stone-500 dark:text-stone-400 font-medium text-sm">
              Loading confirmation...
            </p>
          </div>
        </main>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
