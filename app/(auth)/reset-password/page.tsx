"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "@/lib/api/auth";
import Link from "next/link";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/types/validations/resetPasswordForm";
import { useAuthStore } from "@/stores/authStore";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    setError,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setError("root", { message: "Missing reset token." });
      return;
    }

    setSuccess(null);
    clearErrors();

    try {
      await resetPassword(token, data.password);

      useAuthStore.setState({
        accessToken: null,
        user: null,
        isAuthenticated: false,
      });

      setSuccess("Password reset successfully.");
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: unknown) {
      setError("root", {
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };

  return (
    <main className="animate-appear flex flex-1 flex-col justify-center items-center gap-4 px-[5vw] lg:px-[10vw] my-8">
      <section className="w-full max-w-lg space-y-8 rounded-xl bg-gray-200 dark:bg-stone-800 p-8">
        <h2 className="text-center text-2xl font-bold tracking-tight">
          Create New Password
        </h2>
        {!token && (
          <div className="text-center">
            <p className="text-red-600">Missing reset token.</p>
            <Link
              href="/forgot-password"
              className="mt-4 inline-block text-indigo-600 hover:underline"
            >
              Request a new link
            </Link>
          </div>
        )}
        {success && (
          <div className="text-center space-y-4">
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
              Password reset successfully. All previous sessions have been
              revoked.
            </div>
            <Link
              href="/login"
              className="inline-block font-medium text-indigo-600 hover:text-indigo-500"
            >
              Go to Login
            </Link>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm ${
                  errors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm ${
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </fieldset>

          {errors.root && (
            <p className="mt-1 text-sm text-red-600">{errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </section>
    </main>
  );
}
