"use client";

import { Order } from "@/types/order";
import { getStatusStyle } from "@/utils/getStatusStyles";
import { Eye } from "lucide-react";

interface DesktopAdminOrdersProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export default function DesktopAdminOrders({
  orders,
  onSelectOrder,
}: DesktopAdminOrdersProps) {
  return (
    <section className="hidden xl:block bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700 font-medium">
            <th scope="col" className="p-4 w-1/4">
              Order ID
            </th>
            <th scope="col" className="p-4 w-1/3">
              Customer
            </th>
            <th scope="col" className="p-4 w-1/6">
              Total
            </th>
            <th scope="col" className="p-4 w-1/4">
              Status
            </th>
            <th scope="col" className="p-4 w-1/4 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-stone-700">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 dark:hover:bg-stone-800/80 transition-colors"
            >
              <td className="p-4 font-mono text-sm truncate max-w-50 ">
                {order.id}
              </td>
              <td className="p-4">
                <div className="font-medium">{order.shippingName}</div>
                <div className="text-sm font-mono mt-0.5">
                  {order.shippingPhone}
                </div>
              </td>
              <td className="p-4 font-medium">
                ${Number(order.total).toFixed(2)}
              </td>
              <td className="p-4">
                <span
                  className={`px-2.5 py-1 text-sm font-semibold rounded-full ${getStatusStyle(order.status)}`}
                >
                  {order.status.replace("_", " ")}
                </span>
              </td>
              <td className="p-4 text-right">
                <button
                  onClick={() => onSelectOrder(order)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`View details for order ${order.id}`}
                >
                  <Eye size={16} aria-hidden="true" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
