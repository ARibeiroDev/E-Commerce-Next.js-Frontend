"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getAuditLogs, type AuditLog } from "@/lib/api/auditLog";
import DesktopAuditLogs from "@/components/admin/audits/DesktopAuditLogs";
import MobileAuditLogs from "@/components/admin/audits/MobileAuditLogs";
import Pagination from "@/components/ui/Pagination";
import { PaginationMeta } from "@/types/pagination";
import AuditLogModal from "@/components/admin/audits/AuditLogModal";

const AdminAuditsPage = () => {
  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 6);

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  useEffect(() => {
    if (user && user.role !== "SUPERADMIN") {
      router.replace("/admin");
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        setError(null);
        const response = await getAuditLogs({ page, limit });
        setLogs(response.data);
        setMeta(response.meta);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load audit repositories.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (user?.role === "SUPERADMIN") {
      fetchLogs();
    }
  }, [page, limit, user]);

  const handleFilterChange = (
    key: string,
    value: string | number | { sortBy: string; orderBy: string },
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (key === "sort" && typeof value === "object") {
      params.set("sortBy", value.sortBy);
      params.set("orderBy", value.orderBy);
    } else {
      params.set(key, value.toString());
    }

    // Reset page when filters change
    if (key !== "page") params.set("page", "1");

    // Remove empty query params
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value.toString());
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (user?.role !== "SUPERADMIN") return null;

  return (
    <>
      <header className="border-b border-gray-200 pb-5 mt-4">
        <h3 className="text-xl font-semibold">System Audits Logs</h3>
        <p className="mt-2 text-sm text-gray-400">
          Immutable historical telemetry records tracking admin activity,
          configurations modifications, and user promotion lifecycles.
        </p>
      </header>

      {error && (
        <p className="p-4 rounded-md bg-red-50 border border-red-200 text-sm text-red-700 mb-6">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <span className="text-stone-500 animate-pulse">
            Loading audits database...
          </span>
        </div>
      ) : logs.length === 0 ? (
        <p className="text-center py-12 border border-dashed border-gray-300 rounded-lg text-gray-400 mb-6">
          No audit entries recorded in system database.
        </p>
      ) : (
        <>
          <MobileAuditLogs logs={logs} onSelect={setSelectedLog} />

          <DesktopAuditLogs logs={logs} onSelect={setSelectedLog} />
        </>
      )}

      {/* Pagination Controls */}
      {meta && logs.length > 0 && (
        <Pagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          hasNextPage={meta.hasNextPage}
          hasPreviousPage={meta.hasPreviousPage}
          onPageChange={(page) => handleFilterChange("page", page)}
        />
      )}

      {selectedLog && (
        <AuditLogModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </>
  );
};

export default AdminAuditsPage;
