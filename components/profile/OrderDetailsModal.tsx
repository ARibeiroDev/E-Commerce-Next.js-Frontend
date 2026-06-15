"use client";

import { Order, OrderItem } from "@/types/order";
import { useEffect } from "react";

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onCancelOrder: (orderId: string) => Promise<void>;
  onResumeCheckout: (order: Order) => void;
  onRefundOrder: (orderId: string) => Promise<void>;
}

export default function OrderDetailsModal({
  order,
  onClose,
  onCancelOrder,
  onResumeCheckout,
  onRefundOrder,
}: OrderDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      role="presentation"
      onClick={onClose}
      aria-hidden="true"
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-100 dark:bg-stone-900 rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-stone-700 flex flex-col"
      >
        <header className="flex justify-between items-start mb-6 shrink-0">
          <div>
            <h2 id="modal-title" className="text-2xl font-bold">
              Order Details
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              #{order.id.toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black dark:hover:text-gray-50 transition text-xl p-2 cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </header>

        <section className="space-y-6 flex-1 overflow-y-auto pr-2">
          {/* Status & Shipping Summary */}
          <div className="bg-gray-50 dark:bg-stone-800 p-5 rounded-xl text-sm border border-gray-200 dark:border-stone-700 space-y-3">
            <dl className="space-y-2 m-0">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400 font-medium">
                  Status:
                </dt>
                <dd className="font-semibold">{order.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400 font-medium">
                  Date:
                </dt>
                <dd>
                  <time dateTime={order.createdAt}>
                    {new Date(order.createdAt).toLocaleString()}
                  </time>
                </dd>
              </div>
            </dl>

            <hr className="border-gray-200 dark:border-stone-700" />

            <div>
              <strong className="text-gray-500 dark:text-gray-400 block mb-2 font-medium">
                Shipping Details:
              </strong>
              <address className="not-italic text-gray-800 dark:text-gray-200">
                <p>{order.shippingName}</p>
                <p>
                  {order.shippingAddress}, {order.shippingCity}
                </p>
                <p>
                  {order.shippingPostalCode}, {order.shippingCountry}
                </p>
              </address>
            </div>
          </div>

          {/* Items List */}
          <section>
            <h3 className="font-bold mb-3 border-b border-gray-300 dark:border-stone-700 pb-2">
              Items Purchased
            </h3>
            <ul className="space-y-3 m-0 p-0 list-none">
              {order.items?.map((item: OrderItem) => (
                <li
                  key={item.variantSku}
                  className="flex justify-between items-center text-sm bg-gray-50 dark:bg-stone-800 p-3 rounded-lg border border-gray-200 dark:border-stone-700"
                >
                  <div>
                    <p className="font-bold">{item.productName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Color: {item.color} <span className="mx-1">•</span>
                      Size: {item.size} <span className="mx-1">•</span>
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold">
                    ${Number(item.priceAtPurchase).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </section>

        {/* Footer & Actions */}
        <footer className="pt-6 mt-4 border-t border-gray-300 dark:border-stone-700 shrink-0">
          <div className="flex justify-between items-center font-black text-xl mb-6">
            <span>Total</span>
            <span>${Number(order.total).toFixed(2)}</span>
          </div>

          {/* Action Conditionals */}
          {order.status === "PENDING" && (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => onResumeCheckout(order)}
                className="w-full bg-stone-950 text-white rounded-xl py-3 hover:bg-stone-800 transition shadow-sm cursor-pointer font-medium"
              >
                Resume Checkout
              </button>
              <button
                onClick={() => onCancelOrder(order.id)}
                className="w-full bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-xl py-3 hover:bg-red-100 dark:hover:bg-red-900/40 transition shadow-sm cursor-pointer font-medium"
              >
                Cancel Pending Order
              </button>
              <p className="text-xs text-center text-gray-500 mt-1">
                Cancelling will release your reserved stock back to the store.
              </p>
            </div>
          )}

          {(order.status === "PAID" || order.status === "DELIVERED") && (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => onRefundOrder(order.id)}
                className="w-full bg-gray-200 text-stone-900 dark:bg-stone-800 dark:text-white rounded-xl py-3 hover:bg-gray-300 dark:hover:bg-stone-700 transition shadow-sm cursor-pointer font-medium"
              >
                Request Refund
              </button>
              <p className="text-xs text-center text-gray-500 mt-1">
                Refunds are subject to our 30-day return policy.
              </p>
            </div>
          )}
        </footer>
      </article>
    </div>
  );
}
