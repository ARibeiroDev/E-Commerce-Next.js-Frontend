"use client";

import { useEffect, useState, useCallback } from "react";
import { getUsers, deleteUser, UserQuery } from "@/lib/api/users";
import { PrivateUserDto } from "@/types/user";
import { useAuthStore } from "@/stores/authStore";
import MobileAdminUsers from "@/components/admin/users/MobileAdminUsers";
import DesktopAdminUsers from "@/components/admin/users/DesktopAdminUsers";
import { Search } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { PaginatedResponse } from "@/types/pagination";
import Pagination from "@/components/ui/Pagination";

type FilterType = "ALL" | "BANNED" | "UNVERIFIED";

export default function AdminUsersPage() {
  const currentUser = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 8);
  const activeFilter = (searchParams.get("filter") ?? "ALL") as FilterType;
  const searchQuery = searchParams.get("search") ?? "";

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const [users, setUsers] = useState<PaginatedResponse<
    PrivateUserDto[]
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams: UserQuery = {
        page,
        limit,
        ...(searchQuery ? { search: searchQuery } : {}),
      };

      if (activeFilter === "BANNED") queryParams.isActive = false;
      if (activeFilter === "UNVERIFIED") queryParams.isVerified = false;

      const res = await getUsers(queryParams);
      setUsers(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, limit, activeFilter, searchQuery]);

  // Sync state when query params change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Sync input value if URL resets or updates externally
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleParamChange = useCallback(
    (key: string, value: string | number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }

      if (key !== "page") {
        params.set("page", "1");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  // Debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (localSearch !== searchQuery) {
        handleParamChange("search", localSearch);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [handleParamChange, localSearch, searchQuery]);

  const handleDeactivate = async (id: string, username: string) => {
    if (!confirm(`Are you sure you want to deactivate ${username}'s account?`))
      return;
    try {
      await deleteUser(id);
      setUsers((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          data: prev.data.map((u) =>
            u.id === id ? { ...u, isActive: false } : u,
          ),
        };
      });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to deactivate");
    }
  };

  const usersList = users?.data ?? [];

  return (
    <>
      <header className="flex flex-col gap-4 mt-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold">User Management</h2>
          <button
            onClick={fetchUsers}
            className="text-sm px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors w-fit"
          >
            Refresh List
          </button>
        </div>

        <section className="flex flex-col xl:flex-row gap-4 justify-between bg-gray-100 dark:bg-stone-800 p-3 rounded-lg border border-gray-200 dark:border-stone-700">
          <div className="relative w-full xl:w-96">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-stone-500 dark:text-stone-400" />
            <input
              type="text"
              id="search"
              placeholder="Search by ID, username, or email..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md bg-white dark:bg-stone-900 border border-gray-300 dark:border-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-500 text-sm"
            />
          </div>

          <div className="flex items-center flex-wrap gap-2 pb-1 xl:pb-0">
            {(["ALL", "BANNED", "UNVERIFIED"] as FilterType[]).map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  handleParamChange("filter", tab === "ALL" ? "" : tab)
                }
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  activeFilter === tab
                    ? "bg-stone-900 text-white dark:bg-gray-100 dark:text-black"
                    : "bg-white dark:bg-stone-900 text-stone-600 dark:text-gray-300 border border-gray-300 dark:border-stone-600 hover:bg-gray-50 dark:hover:bg-stone-700"
                }`}
              >
                {tab === "ALL" && "All Users"}
                {tab === "BANNED" && "Banned / Inactive"}
                {tab === "UNVERIFIED" && "Awaiting Verification"}
              </button>
            ))}
          </div>
        </section>
      </header>

      {/* Inline state checks keep the data tables fluid and reactive without full layout flashes */}
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <span className="text-stone-500 animate-pulse">
            Loading users database...
          </span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-600 rounded-md mt-4">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
          <button onClick={fetchUsers} className="mt-2 underline">
            Retry
          </button>
        </div>
      ) : (
        <>
          {usersList.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-stone-800/50 rounded-lg border border-dashed border-gray-300 dark:border-stone-700">
              <p className="text-stone-500 font-medium">
                No users found matching your criteria.
              </p>
            </div>
          )}

          <MobileAdminUsers
            filteredUsers={usersList}
            currentUser={currentUser}
            handleDeactivate={handleDeactivate}
          />

          <DesktopAdminUsers
            filteredUsers={usersList}
            currentUser={currentUser}
            handleDeactivate={handleDeactivate}
          />

          {users && usersList.length > 0 && (
            <Pagination
              currentPage={users.meta.currentPage}
              totalPages={users.meta.totalPages}
              hasNextPage={users.meta.hasNextPage}
              hasPreviousPage={users.meta.hasPreviousPage}
              onPageChange={(p) => handleParamChange("page", p)}
            />
          )}
        </>
      )}
    </>
  );
}
