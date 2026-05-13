"use client";

import { registerUser } from "@/lib/api/auth";
import { RegisterFormInputs, registerFormSchema } from "@/types/registerForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerFormSchema),
  });

  const [success, setSuccess] = useState<string | null>(null);

  const handleRegisterForm: SubmitHandler<RegisterFormInputs> = async (
    data,
  ) => {
    setSuccess(null);
    clearErrors();
    try {
      await registerUser(data);

      setSuccess(
        "Account created! Please check your email to verify your account.",
      );
    } catch (error: unknown) {
      setError("root", {
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };

  return (
    <form
      className="flex flex-col gap-2 w-full md:w-1/2 max-w-lg px-6 py-4 rounded-xl bg-gray-200 dark:bg-stone-800"
      onSubmit={handleSubmit(handleRegisterForm)}
    >
      {/* Username */}
      <label htmlFor="username" className="text-sm mt-2">
        Username
      </label>
      <input
        required
        type="text"
        id="username"
        placeholder="John Doe"
        className="border border-gray-300 p-2 outline-0 text-sm focus:border-gray-400"
        {...register("username")}
      />
      {errors.username && (
        <p className="text-sm text-red-500">{errors.username.message}</p>
      )}

      {/* Email */}
      <label htmlFor="email" className="text-sm mt-2">
        Email
      </label>
      <input
        required
        type="email"
        id="email"
        placeholder="johndoe@example.com"
        className="border border-gray-300 p-2 outline-0 text-sm focus:border-gray-400"
        {...register("email")}
      />
      {errors.email && (
        <p className="text-sm text-red-500">{errors.email.message}</p>
      )}

      {/* Password */}
      <label htmlFor="password" className="text-sm mt-2">
        Password
      </label>
      <input
        required
        type="password"
        id="password"
        placeholder="John Doe"
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
        {isSubmitting ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
};

export default RegisterForm;
