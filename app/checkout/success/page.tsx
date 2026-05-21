"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Payment Successful 🎉</h1>

        <p className="text-gray-600">Your order has been confirmed.</p>
      </div>

      {orderId && (
        <div className="bg-gray-100 dark:bg-stone-800 p-4 rounded-md text-sm">
          <p className="text-gray-500">Your order ID:</p>
          <p className="font-mono font-semibold">{orderId}</p>
        </div>
      )}

      <div className="flex gap-4">
        <Link
          href="/orders"
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
}
