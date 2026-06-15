"use client";

import { Order } from "@/types/order";
import { getStatusStyle } from "@/utils/getStatusStyles";

interface MobileAdminOrdersProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export default function MobileAdminOrders({
  orders,
  onSelectOrder,
}: MobileAdminOrdersProps) {
  return (
    <section className="flex flex-col gap-4 xl:hidden">
      {orders.map((order) => (
        <article
          key={order.id}
          onClick={() => onSelectOrder(order)}
          className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-gray-200 dark:border-stone-700 shadow-sm cursor-pointer transition-colors"
        >
          <header className="flex justify-between items-start mb-3 gap-2">
            <div className="min-w-0">
              <h3 className="font-medium  truncate">{order.shippingName}</h3>
              <p className="text-xs  font-mono mt-0.5 break-all line-clamp-1">
                {order.id}
              </p>
            </div>
            <span
              className={`shrink-0 px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-full ${getStatusStyle(order.status)}`}
            >
              {order.status}
            </span>
          </header>

          <section className="flex justify-between items-end border-t border-gray-200 dark:border-stone-700 pt-3">
            <div>
              <p className="text-sm font-mono uppercase tracking-wider">
                Total
              </p>
              <p className="font-semibold">${Number(order.total).toFixed(2)}</p>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              View Details
            </p>
          </section>
        </article>
      ))}
    </section>
  );
}
