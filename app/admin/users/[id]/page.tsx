"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getUserById } from "@/lib/api/auth";
import type { PrivateUserDto } from "@/types/user";
import { ArrowLeftIcon } from "lucide-react";
import AdminUserForm from "@/components/forms/users/AdminUserForm";
import Loading from "@/app/loading";

export default function AdminEditUserPage() {
  const { id } = useParams<{ id: string }>();

  const [targetUser, setTargetUser] = useState<PrivateUserDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTargetUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = await getUserById(id);

        if (!user) throw new Error("The requested user could not be found.");

        setTargetUser(user);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load user information.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTargetUser();
  }, [id]);

  if (loading) {
    return (
      <section className="flex min-h-100 items-center justify-center w-full px-4">
        <div className="flex flex-col items-center gap-2 text-stone-500">
          <Loading />
          <span className="text-sm font-medium animate-pulse">
            Fetching user data...
          </span>
        </div>
      </section>
    );
  }

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="py-2 border-b border-gray-200 dark:border-stone-800"
      >
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm hover:text-stone-500 transition-colors group"
        >
          <ArrowLeftIcon size={20} aria-hidden="true" />
          Back to User Directory
        </Link>
      </nav>

      <header className="mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Modify User Settings
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Update administrative authorization controls and system operational
          bans.
        </p>
      </header>

      {error || !targetUser ? (
        <section className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <p className="font-semibold">{error || "User not found"}</p>
        </section>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Identity Metadata Card */}
          <section className="bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl p-5 sm:p-6">
            <h3 className="text-md font-bold uppercase tracking-wider text-stone-400 mb-4">
              Identity Metadata
            </h3>
            <dl className="space-y-4">
              <div>
                <dt className="block text-xs font-medium text-stone-500 uppercase">
                  Username
                </dt>
                <dd className="text-base font-semibold break-all">
                  {targetUser.username}
                </dd>
              </div>
              <div>
                <dt className="block text-xs font-medium text-stone-500 uppercase">
                  Email Address
                </dt>
                <dd className="text-base font-medium break-all">
                  {targetUser.email}
                </dd>
              </div>
              <div>
                <dt className="block text-xs font-medium text-stone-500 uppercase">
                  System ID
                </dt>
                <dd className="text-xs font-mono bg-stone-200 dark:bg-stone-800 px-2 py-1 rounded block mt-1 break-all">
                  {targetUser.id}
                </dd>
              </div>
              <div>
                <dt className="block text-xs font-medium text-stone-500 uppercase mb-1">
                  Status
                </dt>
                <dd
                  className={`inline-flex items-center text-xs font-semibold ${targetUser.isVerified ? "text-emerald-600" : "text-amber-500"}`}
                >
                  {targetUser.isVerified
                    ? "Verified Safe"
                    : "Pending Verification"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="xl:col-span-2">
            <AdminUserForm initialUser={targetUser} />
          </section>
        </div>
      )}
    </>
  );
}
