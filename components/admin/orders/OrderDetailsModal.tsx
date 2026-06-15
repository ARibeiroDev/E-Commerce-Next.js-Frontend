"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Order } from "@/types/order";

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
}

export default function OrderDetailsModal({
  order,
  onClose,
  onUpdateStatus,
}: OrderDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white dark:bg-stone-800 rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-gray-200 dark:border-stone-700"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700 flex justify-between items-center">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold font-mono text-stone-400 mb-1">
              ORDER ID:
            </h3>
            <p className="text-sm md:text-base font-mono break-all font-semibold text-stone-900 dark:text-stone-100">
              {order.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-stone-800 rounded-full transition-colors text-stone-500 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <section className="flex-1 overflow-y-auto p-4 border-b border-gray-200 dark:border-stone-700 sm:p-6 bg-white dark:bg-stone-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Shipping Info
          </h4>
          <div className="text-sm space-y-1 text-stone-800 dark:text-stone-300">
            <p className="font-semibold text-stone-900 dark:text-stone-100">
              {order.shippingName}
            </p>
            <p>{order.shippingAddress}</p>
            <p>
              {order.shippingPostalCode} {order.shippingCity},{" "}
              {order.shippingCountry}
            </p>
          </div>
        </section>

        <section className="flex-1 overflow-y-auto p-4 border-b border-gray-200 dark:border-stone-700 sm:p-6 bg-white dark:bg-stone-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Historical Items Snapshot
          </h4>
          <div className="space-y-4 divide-y divide-stone-100 dark:divide-stone-900">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start text-sm pt-4 first:pt-0"
              >
                <div className="pr-4">
                  <p className="font-medium text-stone-900 dark:text-stone-100">
                    {item.productName}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 wrap-break-word">
                    SKU: {item.variantSku} | Color: {item.color} | Size:{" "}
                    {item.size}
                  </p>
                  <p className="text-xs text-stone-500 mt-1.5">
                    Qty: {item.quantity} &times; $
                    {Number(item.priceAtPurchase).toFixed(2)}
                  </p>
                </div>
                <span className="font-mono font-medium text-stone-900 dark:text-stone-100 shrink-0">
                  ${(item.quantity * Number(item.priceAtPurchase)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex-1 overflow-y-auto space-y-2 p-4 sm:p-6 bg-gray-50 dark:bg-stone-900">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Administrative Actions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {order.status === "PAID" && (
              <button
                onClick={() => onUpdateStatus(order.id, "SHIPPED")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 rounded-xl transition cursor-pointer shadow-sm text-center"
              >
                Dispatch Package (Mark Shipped)
              </button>
            )}
            {order.status === "SHIPPED" && (
              <button
                onClick={() => onUpdateStatus(order.id, "DELIVERED")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3 rounded-xl transition cursor-pointer shadow-sm text-center"
              >
                Confirm Delivery
              </button>
            )}
            {["REFUND_REQUESTED"].includes(order.status) && (
              <button
                onClick={() => onUpdateStatus(order.id, "REFUNDED")}
                className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-700/50 dark:hover:bg-red-900/50 text-red-600 text-sm font-semibold py-3 rounded-xl transition cursor-pointer text-center"
              >
                Approve Return/Refund
              </button>
            )}
            {order.status === "PENDING" && (
              <button
                onClick={() => onUpdateStatus(order.id, "CANCELLED")}
                className="w-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-sm font-semibold py-3 rounded-xl transition cursor-pointer text-center"
              >
                Cancel Pending Order
              </button>
            )}
          </div>
        </section>
      </article>
    </div>
  );
}
