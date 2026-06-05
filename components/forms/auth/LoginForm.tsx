"use client";

import { useAuthStore } from "@/stores/authStore";
import {
  LoginFormInputs,
  loginFormSchema,
} from "@/types/validations/loginForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginFormSchema),
  });

  const [success, setSuccess] = useState<string | null>(null);

  const handleLoginForm: SubmitHandler<LoginFormInputs> = async (data) => {
    setSuccess(null);
    clearErrors();
    try {
      const user = await login(data);

      setSuccess("Logged in! Redirecting...");

      const redirectParam = searchParams.get("redirect");

      if (user.role === "ADMIN" || user.role === "SUPERADMIN") {
        // If admin was heading to a deep admin link, preserve it, otherwise send to default admin route
        if (redirectParam && redirectParam.startsWith("/admin")) {
          router.push(redirectParam);
        } else {
          router.push("/admin");
        }
      } else {
        // Standard user router with a security baseline check
        // Prevent normal uses from being sent to admin routes if manipulated via query
        if (redirectParam && !redirectParam.startsWith("/admin")) {
          router.push(redirectParam);
        } else {
          router.push("/");
        }
      }
    } catch (error: unknown) {
      setError("root", {
        message: error instanceof Error ? error.message : "Login Failed.",
      });
    }
  };

  return (
    <form
      className="flex flex-col gap-4 w-full md:w-1/2 max-w-lg bg-gray-200 dark:bg-stone-800 p-6 rounded-xl"
      onSubmit={handleSubmit(handleLoginForm)}
    >
      <label htmlFor="identifier" className="text-sm mt-2">
        Identifier
      </label>
      <input
        type="text"
        id="identifier"
        placeholder="username or email"
        className="border border-gray-300 p-2 outline-0 text-sm focus:border-gray-400"
        {...register("identifier")}
      />
      {errors.identifier && (
        <p className="text-sm text-red-500">{errors.identifier.message}</p>
      )}

      <label htmlFor="password" className="text-sm mt-2">
        Password
      </label>
      <input
        required
        type="password"
        id="password"
        placeholder="**********"
        className="border border-gray-300 p-2 outline-0 text-sm focus:border-gray-400"
        {...register("password")}
      />
      {errors.password && (
        <p className="text-sm text-red-500">{errors.password.message}</p>
      )}

      {errors.root && (
        <p className="text-sm text-red-500 text-center">
          {errors.root.message}
        </p>
      )}

      {success && (
        <p className="text-sm text-green-600 text-center">{success}</p>
      )}

      <button
        type="submit"
        className="mt-2 w-full p-2 bg-gray-300 hover:bg-gray-400 dark:bg-stone-700 dark:hover:bg-stone-600 transition-all duration-300 ease-in-out cursor-pointer max-w-48 rounded-md self-center disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting || success !== null}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
