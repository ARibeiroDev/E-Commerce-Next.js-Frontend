"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { emailSchema, EmailValues } from "@/types/validations/emailForm";

interface EmailFormProps {
  title: string;
  description: string;
  buttonText: string;
  backToLoginText?: string;
  onSubmitAction: (email: string) => Promise<unknown>;
}

export default function EmailForm({
  title,
  description,
  buttonText,
  backToLoginText = "Back to login",
  onSubmitAction,
}: EmailFormProps) {
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    setError,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: EmailValues) => {
    setSuccess(null);
    clearErrors();

    try {
      await onSubmitAction(data.email);
      setSuccess("If an account exists, you will receive an email.");
    } catch (error: unknown) {
      setError("root", {
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };

  return (
    <main className="animate-appear flex flex-1 flex-col justify-center items-center gap-4 px-[5vw] lg:px-[10vw] my-8 bg-gray-100 dark:bg-stone-900">
      <section className="w-full max-w-lg space-y-8 rounded-xl bg-gray-200 dark:bg-stone-800 p-8">
        <header className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </header>

        {success ? (
          <div className="rounded-md bg-green-50 dark:bg-green-900/30 p-4 text-sm text-green-700 dark:text-green-400 text-center">
            {success}
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                {...register("email")}
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm dark:bg-stone-900 dark:border-stone-700  ${
                  errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
                placeholder="Enter your email"
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}

              {errors.root && (
                <p className="mt-2 rounded-md bg-red-200 dark:bg-red-900/30 p-2.5 text-sm text-red-600 dark:text-red-400 font-medium">
                  {errors.root.message}
                </p>
              )}
            </fieldset>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : buttonText}
            </button>
          </form>
        )}

        <div className="text-center text-sm">
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {backToLoginText}
          </Link>
        </div>
      </section>
    </main>
  );
}
