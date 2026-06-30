"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  ContactFormInputs,
} from "@/types/validations/contactForm";
import { useState } from "react";
import { sendSupportEmail } from "@/lib/api/contact";

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
  });

  const [success, setSuccess] = useState<string | null>(null);

  const handleContactForm: SubmitHandler<ContactFormInputs> = async (data) => {
    setSuccess(null);
    clearErrors();
    try {
      await sendSupportEmail(data);

      setSuccess("Message sent! We'll get back to you soon.");
    } catch (error: unknown) {
      setError("root", {
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleContactForm)}
      className="bg-gray-200 dark:bg-stone-800 p-8 rounded-xl flex flex-col gap-5"
    >
      <h2 className="text-2xl font-bold mb-2">Send a Message</h2>

      <fieldset className="flex flex-col gap-2">
        <label htmlFor="fullName" className="text-sm font-medium">
          Full Name
        </label>
        <input
          {...register("fullName")}
          type="text"
          id="fullName"
          disabled={isSubmitting}
          className="border border-gray-300 p-2 outline-0 text-sm focus:border-gray-400"
          placeholder="John Doe"
        />
        {errors.fullName && (
          <span className="text-red-500 text-xs font-semibold">
            {errors.fullName.message}
          </span>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email Address
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          disabled={isSubmitting}
          className="border border-gray-300 p-2 outline-0 text-sm focus:border-gray-400"
          placeholder="john@example.com"
        />
        {errors.email && (
          <span className="text-red-500 text-xs font-semibold">
            {errors.email.message}
          </span>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          {...register("message")}
          id="message"
          rows={5}
          disabled={isSubmitting}
          className="border border-gray-300 p-2 outline-0 text-sm focus:border-gray-400"
          placeholder="How can we help you?"
        ></textarea>
        {errors.message && (
          <span className="text-red-500 text-xs font-semibold">
            {errors.message.message}
          </span>
        )}
      </fieldset>

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
        disabled={isSubmitting}
        className="mt-4 bg-stone-800 text-gray-100 border border-stone-800 dark:bg-gray-100 dark:text-stone-800 font-semibold p-4 rounded-xl transition-all duration-200 ease-in-out hover:bg-transparent hover:text-stone-800 hover:border-stone-800 dark:hover:bg-transparent dark:hover:text-gray-100 dark:hover:border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? "Sending..." : "Submit Message"}
      </button>
    </form>
  );
};
