"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getAllOrdersAdmin, updateOrderStatusAdmin } from "@/lib/api/orders";
import { Order } from "@/types/order";
import { PaginatedResponse } from "@/types/pagination";
import OrdersFilterBar from "@/components/admin/orders/OrdersFilterBar";
import MobileAdminOrders from "@/components/admin/orders/MobileAdminOrders";
import DesktopAdminOrders from "@/components/admin/orders/DesktopAdminOrders";
import OrderDetailsModal from "@/components/admin/orders/OrderDetailsModal";
import Pagination from "@/components/ui/Pagination";

export default function AdminOrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 6);
  const activeStatus = searchParams.get("status") ?? "ALL";
  const searchQuery = searchParams.get("search") ?? "";

  const [orders, setOrders] = useState<PaginatedResponse<Order[]> | null>(null);
  const [focusedOrder, setFocusedOrder] = useState<Order | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const res = await getAllOrdersAdmin({
        page,
        limit,
        status: activeStatus,
        search: searchQuery,
      });
      setOrders(res);

      if (focusedOrder) {
        const updatedFocused = res.data.find((o) => o.id === focusedOrder.id);
        if (updatedFocused) setFocusedOrder(updatedFocused);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load orders.");
    } finally {
      setIsFetching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeStatus, searchQuery]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleParamChange = useCallback(
    (key: string, value: string | number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === "ALL") params.delete(key);
      else params.set(key, value.toString());

      if (key !== "page") params.set("page", "1");

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    if (!confirm(`Confirm order status change to ${nextStatus}?`)) return;
    try {
      const updated = await updateOrderStatusAdmin(orderId, nextStatus);
      setFocusedOrder(updated);
      await fetchOrders();
    } catch (error: unknown) {
      alert(`Operation rejected. ${(error as Error).message}`);
    }
  };

  const isInitialLoad = isFetching && !orders;

  if (isInitialLoad) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        aria-busy="true"
        aria-live="polite"
      >
        <span className="text-stone-500 animate-pulse">Loading orders...</span>
      </div>
    );
  }

  return (
    <>
      <header className="border-b border-gray-200 dark:border-stone-800 pb-5">
        <h2 className="text-xl sm:text-2xl font-semibold">Orders Management</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Track incoming packages, authorize refunds, and manage order
          lifecycles.
        </p>
      </header>

      <OrdersFilterBar
        activeStatus={activeStatus}
        searchQuery={searchQuery}
        onParamChange={handleParamChange}
      />

      {error && (
        <div
          role="alert"
          className="p-4 bg-red-50 text-red-600 rounded-lg mt-4 border border-red-100"
        >
          <p>{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-2 text-sm underline font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {orders?.data.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg text-gray-400 mb-6">
          <p className="font-medium">No orders found matching criteria.</p>
        </div>
      ) : (
        <>
          <MobileAdminOrders
            orders={orders?.data || []}
            onSelectOrder={setFocusedOrder}
          />
          <DesktopAdminOrders
            orders={orders?.data || []}
            onSelectOrder={setFocusedOrder}
          />

          {orders && orders.data.length > 0 && (
            <Pagination
              currentPage={orders.meta.currentPage}
              totalPages={orders.meta.totalPages}
              hasNextPage={orders.meta.hasNextPage}
              hasPreviousPage={orders.meta.hasPreviousPage}
              onPageChange={(p) => handleParamChange("page", p)}
            />
          )}
        </>
      )}

      {focusedOrder && (
        <OrderDetailsModal
          order={focusedOrder}
          onClose={() => setFocusedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </>
  );
}
