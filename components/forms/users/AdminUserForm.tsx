"use client";

import { FormEvent, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { adminUpdateUser } from "@/lib/api/users";
import { useAuthStore } from "@/stores/authStore";
import type { PrivateUserDto, Role } from "@/types/user";
import { CircleCheck, CircleX } from "lucide-react";

interface AdminUserFormProps {
  initialUser: PrivateUserDto;
}

export default function AdminUserForm({ initialUser }: AdminUserFormProps) {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const roleSelectId = useId();

  // Initialize mutable state directly from the fetched user prop
  const [isActive, setIsActive] = useState<boolean>(initialUser.isActive);
  const [role, setRole] = useState<Role>(initialUser.role);

  // UX & Submission states
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Derived state to determine if the form has actually been modified
  const hasChanged =
    initialUser.isActive !== isActive || initialUser.role !== role;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasChanged) return;

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Pack request updates based on role permissions payload restrictions
      const payload: { isActive?: boolean; role?: Role } = { isActive };

      if (currentUser?.role === "SUPERADMIN") {
        payload.role = role;
      }

      await adminUpdateUser(initialUser.id, payload);
      setSuccess(true);

      // Delay navigation back slightly so user sees success feedback state
      setTimeout(() => {
        router.push("/admin/users");
        router.refresh(); // Force Next.js to re-fetch the users list
      }, 1500);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while saving changes.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm p-5 sm:p-6">
      {/* Form-level Error Handler */}
      {error && (
        <section
          role="alert"
          className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg text-red-700 dark:text-red-400 text-sm flex items-start gap-3"
        >
          <CircleX />
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-300">
              Update Failed
            </h3>
            <p className="mt-1">{error}</p>
          </div>
        </section>
      )}

      {/* Form-level Success Handler */}
      {success && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-lg text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-3"
        >
          <CircleCheck />
          <p className="font-medium">
            User profile successfully updated. Redirecting...
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ban/Unban Management */}
        <fieldset className="border-b border-stone-100 dark:border-stone-800 pb-6">
          <legend className="text-base font-bold text-stone-900 dark:text-white mb-1">
            Account Access Status
          </legend>
          <p className="text-xs text-stone-500 dark:text-gray-400 mb-4">
            Banning a user revokes their session identity permissions instantly
            across store features.
          </p>

          <section className="flex items-center justify-between p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/30">
            <div className="flex flex-col pr-4">
              <span className="text-sm font-semibold text-stone-900 dark:text-gray-100">
                {isActive
                  ? "Account Status: Active"
                  : "Account Status: Suspended / Banned"}
              </span>
              <span className="text-xs text-stone-500 dark:text-gray-400 mt-0.5">
                {isActive
                  ? "User has standard marketplace profile clearance and active access permissions."
                  : "User authorization tokens will fail verification access parameters."}
              </span>
            </div>

            {/* Switch Toggle Button */}
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive(!isActive)}
              disabled={submitting}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 ${
                isActive
                  ? "bg-stone-900 dark:bg-gray-100"
                  : "bg-stone-300 dark:bg-stone-700"
              }`}
            >
              <span className="sr-only">Toggle account active status</span>
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-stone-900 shadow ring-0 transition duration-200 ease-in-out ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </section>
        </fieldset>

        {/* Role Assignment & Hierarchy Controls Module */}
        <fieldset className="pb-4">
          <legend className="text-base font-bold text-stone-900 dark:text-white mb-1">
            Access Level Role Assignment
          </legend>
          <p className="text-xs text-stone-500 dark:text-gray-400 mb-4">
            {currentUser?.role === "SUPERADMIN"
              ? "Modify backend security layer group definitions. Exercise precise caution."
              : "You require a SUPERADMIN account classification layer to modify system roles."}
          </p>

          <section className="w-full">
            <label htmlFor={roleSelectId} className="sr-only">
              Select Authorization Role
            </label>
            <select
              id={roleSelectId}
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              disabled={currentUser?.role !== "SUPERADMIN" || submitting}
              className="w-full px-3 py-2 text-sm rounded-md bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 text-stone-900 dark:text-gray-100 disabled:bg-stone-100 dark:disabled:bg-stone-800 disabled:text-stone-500 dark:disabled:text-stone-400 disabled:cursor-not-allowed"
            >
              <option value="USER">
                USER (Standard Store Customer Permissions)
              </option>
              <option value="ADMIN">
                ADMIN (Inventory & Staff Management Tier)
              </option>
              <option value="SUPERADMIN">
                SUPERADMIN (Global Root System Owner Account)
              </option>
            </select>
          </section>
        </fieldset>

        <section className="flex items-center justify-end flex-wrap gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            onClick={() => {
              setIsActive(initialUser.isActive);
              setRole(initialUser.role);
            }}
            disabled={!hasChanged || submitting}
            className="w-full sm:max-w-50 px-4 py-2 text-sm font-medium rounded-md border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-stone-700 dark:text-stone-300"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={submitting || !hasChanged}
            className="w-full sm:max-w-50 px-4 py-2 text-sm font-medium rounded-md text-white dark:text-black bg-stone-900 dark:bg-gray-100 hover:bg-stone-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </section>
      </form>
    </div>
  );
}
