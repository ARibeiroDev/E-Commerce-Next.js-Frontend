"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/lib/api/auth";
import Link from "next/link";
import Loading from "@/app/loading";

type StatusEnum = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<StatusEnum>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      setErrorMessage("No verification token found in the URL.");
      return;
    }

    // Boolean check to prevent Strict mode to fire twice during development
    let isMounted = true;

    const processVerification = async () => {
      try {
        await verifyEmail(token);
        if (isMounted) setStatus("success");
      } catch (error: unknown) {
        if (isMounted) {
          setStatus("error");
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "The verification link is invalid or has expired.",
          );
        }
      }
    };

    processVerification();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <main className="animate-appear flex flex-1 flex-col justify-center items-center gap-4 px-[5vw] lg:px-[10vw] my-8">
      <section className="w-full max-w-lg space-y-8 rounded-xl bg-gray-200 dark:bg-stone-800 p-8">
        <h2 className="text-center text-2xl font-bold tracking-tight">
          Email Verification
        </h2>
        <Suspense fallback={<Loading />}>
          <section className="mt-8 space-y-6 text-center">
            {status === "loading" && (
              <div className="space-y-4">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="text-stone-600 dark:text-gray-300">
                  Verifying your email...
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-6">
                <div className="rounded-md bg-green-50 dark:bg-green-900/30 p-4 text-sm text-green-700 dark:text-green-400">
                  Email verified successfully! Your account is now active.
                </div>
                <Link
                  href="/login"
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Go to Login
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-6">
                <div className="rounded-md bg-red-900/30 p-4 text-sm  text-red-800 dark:text-red-500">
                  {errorMessage}
                </div>
                <Link
                  href="/resend-verification"
                  className="inline-block font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Request a new verification link
                </Link>
              </div>
            )}
          </section>
        </Suspense>
      </section>
    </main>
  );
}
