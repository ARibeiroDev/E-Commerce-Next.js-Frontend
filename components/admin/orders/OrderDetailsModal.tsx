"use client";

import { useEffect, useRef } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Automatically open the modal
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  // Handle click outside the modal to close it
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  const handleClose = () => {
    dialogRef.current?.close();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
      className="backdrop:bg-black/60 backdrop:backdrop-blur-sm bg-gray-100 dark:bg-stone-900 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-gray-200 dark:border-stone-700 m-auto open:flex flex-col text-stone-900 dark:text-gray-100"
    >
      <header className="p-4 bg-gray-50 dark:bg-stone-900 flex justify-between items-center">
        <div className="flex flex-col">
          <h2
            id="modal-title"
            className="text-sm font-bold font-mono text-stone-400 mb-1"
          >
            ORDER ID
          </h2>
          <p className="text-sm md:text-base font-mono break-all font-semibold text-stone-900 dark:text-stone-100">
            {order.id}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-200 dark:hover:bg-stone-800 rounded-full transition-colors text-stone-500 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      <section className="flex-1 overflow-y-auto p-4 border border-gray-200 dark:border-stone-700 sm:p-6 bg-white dark:bg-stone-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Shipping Info
        </h3>
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

      <section className="flex-1 overflow-y-auto p-4 border border-t-0 border-gray-200 dark:border-stone-700 sm:p-6 bg-white dark:bg-stone-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Historical Items Snapshot
        </h3>
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

      <section className="flex-1 overflow-y-auto space-y-2 p-4  bg-gray-50 dark:bg-stone-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Administrative Actions
        </h3>
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
              className="w-full bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-950/50 text-red-600 text-sm font-semibold py-3 rounded-xl transition cursor-pointer text-center"
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
    </dialog>
  );
}
