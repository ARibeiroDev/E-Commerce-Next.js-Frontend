"use client";

import AdminGuard from "@/guards/AdminGuard";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md md:rounded-r-none text-sm font-medium transition-colors ${pathname.startsWith(path) ? "bg-stone-800 text-gray-200 dark:bg-gray-300 dark:text-stone-900 font-semibold" : "hover:bg-gray-200 dark:hover:bg-stone-700"}`;

  return (
    <AdminGuard>
      <main className="animate-appear flex flex-1 flex-col gap-6 md:gap-0 md:flex-row">
        <aside className="w-full md:w-3/12 md:max-w-xs md:border-r md:border-gray-200 dark:md:border-stone-800">
          <Link href="/admin">
            <h2 className="text-center font-semibold uppercase tracking-wider border-b border-gray-200 dark:border-stone-800 py-4">
              Admin Console
            </h2>
          </Link>
          <nav className="flex items-center justify-evenly md:flex-col  md:items-end gap-0.5 mt-6">
            <Link
              href="/admin/products"
              className={linkClass("/admin/products")}
            >
              Products
            </Link>
            <Link href="/admin/users" className={linkClass("/admin/users")}>
              Users
            </Link>
            <Link href="/admin/orders" className={linkClass("/admin/orders")}>
              Orders
            </Link>

            {user?.role === "SUPERADMIN" && (
              <Link href="/admin/audits" className={linkClass("/admin/audits")}>
                Audits
              </Link>
            )}
          </nav>
        </aside>

        <section className="flex gap-6 flex-col h-full py-4 flex-1 md:w-9/12 px-[5vw] lg:px-[7vw] animate-appear">
          {children}
        </section>
      </main>
    </AdminGuard>
  );
}
