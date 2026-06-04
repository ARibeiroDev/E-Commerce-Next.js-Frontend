"use client";

import Loading from "@/app/loading";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

const AdminGuard = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuthStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Use replace instead of push so the unauthorized isn't kept in browser history
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  // Block rendeing until state is confirmed
  if (
    isLoading ||
    !user ||
    (user.role !== "ADMIN" && user.role !== "SUPERADMIN")
  ) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default AdminGuard;
