"use client";

import { Order } from "@/types/order";
import Pagination from "@/components/ui/Pagination";
import { getStatusStyle } from "@/utils/getStatusStyles";

interface OrderHistoryProps {
  orders: Order[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onOrderSelect: (order: Order) => void;
}

export default function OrderHistory({
  orders,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onOrderSelect,
}: OrderHistoryProps) {
  return (
    <section className="md:col-span-2 flex flex-col h-full bg-gray-200 dark:bg-stone-800 p-6 rounded-xl border border-gray-300 dark:border-stone-700">
      <header className="mb-6">
        <h2 className="text-xl font-bold">Order History</h2>
      </header>

      {isLoading ? (
        <ul
          aria-busy="true"
          className="animate-pulse space-y-4 m-0 p-0 list-none"
        >
          {[1, 2, 3].map((skeleton) => (
            <li
              key={skeleton}
              className="h-20 bg-gray-300 dark:bg-stone-700 rounded-lg w-full"
            />
          ))}
        </ul>
      ) : orders.length === 0 ? (
        <article className="text-center py-12 bg-gray-100 dark:bg-stone-900 rounded-lg border border-dashed border-gray-400 dark:border-stone-600">
          <p className="font-medium text-gray-600 dark:text-gray-400">
            You haven&apos;t placed any orders yet.
          </p>
        </article>
      ) : (
        <>
          <ul className="list-none m-0 p-0 flex flex-col gap-4 flex-1">
            {orders.map((order) => (
              <li key={order.id}>
                <article
                  className="flex justify-between items-center p-4 bg-white dark:bg-stone-900 border border-transparent rounded-lg hover:border-gray-400 dark:hover:border-stone-500 cursor-pointer transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
                  onClick={() => onOrderSelect(order)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOrderSelect(order);
                    }
                  }}
                >
                  <div>
                    <h3 className="font-bold text-sm">
                      Order #{order.id.slice(-6).toUpperCase()}
                    </h3>
                    <time
                      dateTime={order.createdAt}
                      className="block text-xs text-gray-500 mt-1"
                    >
                      {new Date(order.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                  <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <span className="font-bold">
                      ${Number(order.total).toFixed(2)}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              hasNextPage={page < totalPages}
              hasPreviousPage={page > 1}
              onPageChange={onPageChange}
            />
          </div>
        </>
      )}
    </section>
  );
}
