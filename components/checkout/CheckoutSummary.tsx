"use client";

import { Order } from "@/types/order";
import { CartUIItem } from "@/types/uiCart";

type Props = {
  items: CartUIItem[];
  pendingOrder: Order | null;
  shippingThreshold: number;
  shippingFee: number;
};

export default function CheckoutSummary({
  items,
  pendingOrder,
  shippingThreshold,
  shippingFee,
}: Props) {
  // Cart state calculations
  const subtotal = items.reduce(
    (acc, item) => acc + item.finalPrice * item.quantity,
    0,
  );
  const cartShippingFee = subtotal >= shippingThreshold ? 0 : shippingFee;
  const cartTotal = subtotal + cartShippingFee;

  // Order state calculations
  const orderItemsSubtotal = pendingOrder
    ? pendingOrder.items.reduce(
        (acc, item) => acc + Number(item.priceAtPurchase) * item.quantity,
        0,
      )
    : 0;
  const orderShippingFee = pendingOrder
    ? Number(pendingOrder.total) - orderItemsSubtotal
    : 0;

  return (
    <aside className="border border-gray-300 dark:border-stone-700 rounded-xl p-6 h-fit flex flex-col gap-6 bg-white dark:bg-stone-900/50">
      <h2 className="text-xl font-bold">Order Summary</h2>

      {pendingOrder ? (
        <dl className="flex flex-col gap-3 m-0">
          <div className="flex justify-between text-sm">
            <dt className="text-gray-600 dark:text-gray-400">Subtotal</dt>
            <dd className="font-medium">${orderItemsSubtotal.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-gray-600 dark:text-gray-400">Shipping</dt>
            <dd className="font-medium">
              {orderShippingFee === 0
                ? "Free"
                : `$${orderShippingFee.toFixed(2)}`}
            </dd>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-300 dark:border-stone-700 pt-3 mt-1">
            <dt>Total</dt>
            <dd>${Number(pendingOrder.total).toFixed(2)}</dd>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Total locked at order creation.
          </p>
        </dl>
      ) : (
        <dl className="flex flex-col gap-3 m-0">
          <div className="flex justify-between text-sm">
            <dt className="text-gray-600 dark:text-gray-400">Subtotal</dt>
            <dd className="font-medium">${subtotal.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-gray-600 dark:text-gray-400">Shipping</dt>
            <dd className="font-medium">
              {cartShippingFee === 0
                ? "Free"
                : `$${cartShippingFee.toFixed(2)}`}
            </dd>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-300 dark:border-stone-700 pt-3 mt-1">
            <dt>Total</dt>
            <dd>${cartTotal.toFixed(2)}</dd>
          </div>
          {cartShippingFee > 0 && (
            <p className="text-sm text-green-700 dark:text-green-400 font-medium mt-2">
              Add ${(shippingThreshold - subtotal).toFixed(2)} more for free
              shipping!
            </p>
          )}
        </dl>
      )}
    </aside>
  );
}
