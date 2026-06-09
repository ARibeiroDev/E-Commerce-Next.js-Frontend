"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { updateMe, deleteUser, getMe } from "@/lib/api/users";
import { getMyOrders, cancelOrder } from "@/lib/api/orders";
import { Order } from "@/types/order";
import { logoutUser } from "@/lib/api/auth";
import type { PrivateUserDto } from "@/types/user";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Pagination from "@/components/ui/Pagination";
import {
  EditUserFormInputs,
  editUserFormSchema,
} from "@/types/validations/editUserForm";
import OrderDetailsModal from "@/components/profile/OrderDetailsModal";

type FullUserProfile = PrivateUserDto & { createdAt: string };

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();

  // Profile Data State
  const [fullProfile, setFullProfile] = useState<FullUserProfile | null>(null);

  // Form Setup
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormInputs>({
    resolver: zodResolver(editUserFormSchema),
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Selected Order Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Danger Zone State
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Auth Protection & Initialization
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      setValue("username", user.username);
      // Fetch full profile data for the read-only sections
      getMe()
        .then((data) => setFullProfile(data as FullUserProfile))
        .catch((err) => console.error("Failed to load profile details", err));
    }
  }, [isLoading, isAuthenticated, user, router, setValue]);

  // 2. Fetch Orders
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

  // 3. Handlers
  const onUpdateSubmit: SubmitHandler<EditUserFormInputs> = async (data) => {
    setSuccessMsg(null);
    clearErrors();
    try {
      const payload = {
        username: data.username,
        ...(data.password ? { password: data.password } : {}),
      };
      await updateMe(payload);

      setSuccessMsg("Profile updated successfully!");
      setValue("password", ""); // Clear password field on success

      // Update local profile state to reflect new username instantly
      if (fullProfile) {
        setFullProfile({ ...fullProfile, username: data.username });
      }
    } catch (error: unknown) {
      setError("root", {
        message: error instanceof Error ? error.message : "Update failed.",
      });
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await cancelOrder(orderId);
      // Refresh orders and close modal if open
      fetchOrders(page);
      setSelectedOrder(null);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to cancel order");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirmDelete = prompt(
      `Warning: This action is irreversible. Type "${user.username}" to confirm deletion.`,
    );
    if (confirmDelete !== user.username) return;

    setIsDeleting(true);
    try {
      await deleteUser(user.id);
      await logoutUser();
      logout(); // clear Zustand store
      router.push("/");
    } catch (error: unknown) {
      alert(
        error instanceof Error ? error.message : "Failed to delete account",
      );
      setIsDeleting(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <p className="flex-1 flex justify-center items-center font-medium text-lg">
        Loading...
      </p>
    );
  }

  return (
    <main className="flex-1 px-[5vw] lg:px-[10vw] py-8 animate-appear grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* LEFT COLUMN: Profile Info, Settings, & Danger Zone */}
      <aside className="space-y-6 col-span-1">
        {/* 1. Account Overview (Read-Only) */}
        <header className="bg-gray-200 dark:bg-stone-800 p-6 rounded-xl border border-gray-300 dark:border-stone-700">
          <figure className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-300 dark:border-stone-700 m-0">
            <span className="w-14 h-14 bg-stone-950 text-gray-100 rounded-full flex items-center justify-center text-2xl font-bold">
              {fullProfile?.username?.charAt(0).toUpperCase()}
            </span>
            <figcaption>
              <h2 className="text-lg font-bold">{fullProfile?.username}</h2>
              <span className="text-sm font-semibold px-2 py-1 bg-gray-100 rounded-full text-stone-700 uppercase tracking-wider mt-1 inline-block">
                {fullProfile?.role}
              </span>
            </figcaption>
          </figure>

          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-sm font-medium uppercase tracking-wider mb-1 text-gray-500 dark:text-gray-400">
                Email Address
              </dt>
              <dd className="font-medium">{fullProfile?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium uppercase tracking-wider mb-1 text-gray-500 dark:text-gray-400">
                Account Status
              </dt>
              <dd className="font-medium">
                {fullProfile?.isActive ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
                <span className="mx-2 text-gray-400">|</span>
                {fullProfile?.isVerified ? (
                  <span className="text-green-600">Verified</span>
                ) : (
                  <span className="text-yellow-600">Pending Verification</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium uppercase tracking-wider mb-1 text-gray-500 dark:text-gray-400">
                Member Since
              </dt>
              <dd className="font-medium">
                {fullProfile?.createdAt
                  ? new Date(fullProfile.createdAt).toLocaleDateString()
                  : "Loading..."}
              </dd>
            </div>
          </dl>
        </header>

        {/* 2. Last Shipping Address (Read-Only, Dynamic) */}
        {orders.length > 0 && (
          <section className="bg-gray-200 dark:bg-stone-800 p-6 rounded-xl border border-gray-300 dark:border-stone-700">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-500 dark:text-gray-400">
              Last Used Address
            </h3>
            <address className="text-sm space-y-1 not-italic font-medium">
              <p>
                <strong>Name:</strong> {orders[0].shippingName}
              </p>
              <p>
                <strong>Address:</strong> {orders[0].shippingAddress}
              </p>
              <p>
                <strong>City:</strong> {orders[0].shippingCity}
              </p>
              <p>
                <strong>Postal Code:</strong> {orders[0].shippingPostalCode}
              </p>
              <p>
                <strong>Country:</strong> {orders[0].shippingCountry}
              </p>
              <p className="mt-2 pt-2 border-t border-gray-300 dark:border-stone-600">
                <strong>Phone:</strong> {orders[0].shippingPhone}
              </p>
            </address>
          </section>
        )}

        {/* 3. Editable Profile Settings Form */}
        <section className="bg-gray-200 dark:bg-stone-800 p-6 rounded-xl border border-gray-300 dark:border-stone-700">
          <h2 className="text-lg font-bold mb-4">Edit Info</h2>
          <form
            onSubmit={handleSubmit(onUpdateSubmit)}
            className="flex flex-col gap-4"
          >
            <fieldset className="space-y-1 border-none p-0 m-0">
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                type="text"
                {...register("username")}
                className="w-full border border-gray-300 dark:border-stone-700 p-2 rounded-lg outline-none focus:border-gray-500 bg-white dark:bg-stone-900 transition"
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </fieldset>

            <fieldset className="space-y-1 border-none p-0 m-0">
              <label htmlFor="password" className="block text-sm font-medium">
                New Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Leave blank to keep current"
                className="w-full border border-gray-300 dark:border-stone-700 p-2 rounded-lg outline-none focus:border-gray-500 bg-white dark:bg-stone-900 transition"
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </fieldset>

            {errors.root && (
              <p className="text-sm text-red-500 text-center font-medium">
                {errors.root.message}
              </p>
            )}

            {successMsg && (
              <p className="text-sm text-green-600 text-center font-medium">
                {successMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-stone-950 text-white rounded-lg py-2 hover:bg-stone-800 disabled:opacity-50 transition font-medium cursor-pointer"
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </section>

        {/* 4. Danger Zone */}
        <section className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-900/50">
          <h2 className="text-lg font-bold text-red-600 dark:text-red-500 mb-2">
            Danger Zone
          </h2>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="w-full bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 disabled:opacity-50 transition font-medium cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </button>
        </section>
      </aside>

      {/* RIGHT COLUMN: Order History */}
      <section className="md:col-span-2 flex flex-col h-full bg-gray-200 dark:bg-stone-800 p-6 rounded-xl border border-gray-300 dark:border-stone-700">
        <header className="mb-6">
          <h2 className="text-xl font-bold">Order History</h2>
        </header>

        {isLoadingOrders ? (
          <ul aria-busy="true" className="animate-pulse space-y-4">
            {[1, 2, 3].map((skeleton) => (
              <li
                key={skeleton}
                className="h-20 bg-gray-300 dark:bg-stone-700 rounded-lg w-full"
              ></li>
            ))}
          </ul>
        ) : orders.length === 0 ? (
          <article className="text-center py-12 bg-gray-100 dark:bg-stone-900 rounded-lg border border-dashed border-gray-400 dark:border-stone-600">
            <p className="font-medium text-gray-600 dark:text-gray-400">
              You haven&apos;t placed any orders yet.
            </p>
          </article>
        ) : (
          <div className="flex flex-col justify-between flex-1">
            <ul className="space-y-4 m-0 p-0 list-none">
              {orders.map((order) => (
                <li key={order.id}>
                  <article
                    className="flex justify-between items-center p-4 bg-white dark:bg-stone-900 border border-transparent rounded-lg hover:border-gray-400 dark:hover:border-stone-500 cursor-pointer transition-all shadow-sm"
                    onClick={() => setSelectedOrder(order)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setSelectedOrder(order);
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
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </article>
                </li>
              ))}
            </ul>

            {/* Pagination Implementation */}
            <footer className="pt-6 mt-6 border-t border-gray-300 dark:border-stone-700">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                hasNextPage={page < totalPages}
                hasPreviousPage={page > 1}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </footer>
          </div>
        )}
      </section>

      {/* MODAL: Order Details Overlay */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancelOrder={handleCancelOrder}
        />
      )}
    </main>
  );
}
