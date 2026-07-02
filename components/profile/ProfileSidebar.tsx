"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditUserFormInputs,
  editUserFormSchema,
} from "@/types/validations/editUserForm";
import type { PrivateUserDto } from "@/types/user";
import DangerZone from "./DangerZone";

interface ProfileSidebarProps {
  profile: PrivateUserDto;
  onUpdateProfile: (data: EditUserFormInputs) => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  isDeleting: boolean;
}

export default function ProfileSidebar({
  profile,
  onUpdateProfile,
  onDeleteAccount,
  isDeleting,
}: ProfileSidebarProps) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormInputs>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: { username: profile.username },
  });

  const onSubmit: SubmitHandler<EditUserFormInputs> = async (data) => {
    setSuccessMsg(null);
    clearErrors();
    try {
      await onUpdateProfile(data);
      setSuccessMsg("Profile updated successfully!");
      setValue("password", ""); // Clear password field after successful update
    } catch (error: unknown) {
      setError("root", {
        message: (error as Error).message || "Update failed.",
      });
    }
  };

  return (
    <aside className="space-y-6 col-span-1">
      <section className="bg-gray-200 dark:bg-stone-800 p-6 rounded-xl border border-gray-300 dark:border-stone-700">
        <figure className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-300 dark:border-stone-700 m-0">
          <div className="w-14 h-14 bg-stone-950 text-gray-100 rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
            {profile.username?.charAt(0).toUpperCase()}
          </div>
          <figcaption>
            <h2 className="text-lg font-bold truncate">{profile.username}</h2>
            <span className="text-sm font-semibold px-2 py-1 bg-gray-100 rounded-full text-stone-700 uppercase tracking-wider mt-1 inline-block">
              {profile.role}
            </span>
          </figcaption>
        </figure>

        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-sm font-medium uppercase tracking-wider mb-1 text-gray-500">
              Email Address
            </dt>
            <dd className="font-medium truncate">{profile.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium uppercase tracking-wider mb-1 text-gray-500">
              Account Status
            </dt>
            <dd className="font-medium">
              <span
                className={profile.isActive ? "text-green-600" : "text-red-600"}
              >
                {profile.isActive ? "Active" : "Inactive"}
              </span>
              <span className="mx-2 text-gray-400">|</span>
              <span
                className={
                  profile.isVerified ? "text-green-600" : "text-yellow-600"
                }
              >
                {profile.isVerified ? "Verified" : "Pending"}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium uppercase tracking-wider mb-1 text-gray-500">
              Member Since
            </dt>
            <dd className="font-medium">
              {new Date(profile.createdAt).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </section>

      <section className="bg-gray-200 dark:bg-stone-800 p-6 rounded-xl border border-gray-300 dark:border-stone-700">
        <h2 className="text-lg font-bold mb-4">Edit Info</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <fieldset className="space-y-1 border-none p-0 m-0">
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              autoComplete="username"
              className="w-full border border-gray-300 dark:border-stone-700 p-2 rounded-lg outline-none bg-white dark:bg-stone-900 transition focus:ring-2 focus:ring-stone-500"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </fieldset>

          <fieldset className="space-y-1 border-none p-0 m-0">
            <label htmlFor="password" className="block text-sm font-medium">
              New Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Leave blank to keep current"
              className="w-full border border-gray-300 dark:border-stone-700 p-2 rounded-lg outline-none bg-white dark:bg-stone-900 transition focus:ring-2 focus:ring-stone-500"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </fieldset>

          {errors.root && (
            <p className="text-sm text-red-500 text-center font-medium">
              {errors.root.message}
            </p>
          )}
          {successMsg && (
            <p
              className="text-sm text-green-600 text-center font-medium"
              role="status"
            >
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-stone-950 text-white rounded-lg py-2 hover:bg-stone-800 disabled:opacity-50 transition font-medium cursor-pointer"
          >
            {isSubmitting ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </section>

      <DangerZone
        username={profile.username}
        onDelete={onDeleteAccount}
        isDeleting={isDeleting}
      />
    </aside>
  );
}
