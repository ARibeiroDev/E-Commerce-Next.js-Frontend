"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { updateMe, deleteUser, getMe } from "@/lib/api/users";
import { getMyOrders, cancelOrder, requestRefund } from "@/lib/api/orders";
import { logoutUser } from "@/lib/api/auth";
import type { PrivateUserDto } from "@/types/user";
import { Order } from "@/types/order";
import { EditUserFormInputs } from "@/types/validations/editUserForm";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import OrderHistory from "@/components/profile/OrderHistory";
import OrderDetailsModal from "@/components/profile/OrderDetailsModal";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const resumePendingCheckout = useCheckoutStore(
    (state) => state.resumePendingCheckout,
  );

  const [fullProfile, setFullProfile] = useState<PrivateUserDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchProfile = async () => {
    try {
      const data = await getMe();
      setFullProfile(data as PrivateUserDto);
    } catch (error: unknown) {
      console.error("Failed to fetch profile", error);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchProfile();
    }
  }, [isLoading, isAuthenticated, user, router]);

  const fetchOrders = async (currentPage: number) => {
    setIsLoadingOrders(true);
    try {
      const res = await getMyOrders({ page: currentPage, limit: 8 });
      setOrders(res.data);
      setTotalPages(res.meta.totalPages);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchOrders(page);
  }, [isAuthenticated, page]);

  const handleUpdateProfile = async (data: EditUserFormInputs) => {
    const payload = {
      username: data.username,
      ...(data.password ? { password: data.password } : {}),
    };
    await updateMe(payload);
    if (fullProfile)
      setFullProfile({ ...fullProfile, username: data.username });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      await deleteUser(user.id);
      await logoutUser();
      logout();
      router.push("/");
    } catch (error: unknown) {
      console.error("Failed to delete account", error);
      setIsDeleting(false);
    }
  };

  const handleCancelOrder = async (id: string) => {
    await cancelOrder(id);
    fetchOrders(page);
    setSelectedOrder(null);
  };

  const handleRefundOrder = async (id: string) => {
    await requestRefund(id);
    fetchOrders(page);
    setSelectedOrder(null);
  };

  const handleResumeCheckout = (order: Order) => {
    resumePendingCheckout(order);
    router.push("/checkout");
  };

  if (!isAuthenticated || !user || !fullProfile) {
    return (
      <div className="flex-1 flex justify-center items-center font-medium text-lg min-h-[50vh]">
        <div aria-busy="true" className="animate-pulse">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 px-[5vw] lg:px-[10vw] py-8 animate-appear grid grid-cols-1 md:grid-cols-3 gap-8">
      <ProfileSidebar
        profile={fullProfile}
        onUpdateProfile={handleUpdateProfile}
        onDeleteAccount={handleDeleteAccount}
        isDeleting={isDeleting}
      />

      <OrderHistory
        orders={orders}
        isLoading={isLoadingOrders}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onOrderSelect={setSelectedOrder}
      />

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancelOrder={handleCancelOrder}
          onResumeCheckout={handleResumeCheckout}
          onRefundOrder={handleRefundOrder}
        />
      )}
    </main>
  );
}
