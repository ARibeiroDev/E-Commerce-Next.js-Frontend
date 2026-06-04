import { apiFetch } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/pagination";

export type AuditLog = {
  id: string;
  action: string;
  actorId: string | null;
  actor?: {
    username: string;
    email: string;
  } | null;
  targetId: string;
  targetType: "USER" | "PRODUCT" | "ORDER";
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  createdAt: string;
};

export type AuditLogQuery = {
  page?: number;
  limit?: number;
};

export const getAuditLogs = (params?: AuditLogQuery) => {
  const search = new URLSearchParams();

  if (params?.page) search.set("page", params.page.toString());
  if (params?.limit) search.set("limit", params.limit.toString());

  const query = search.toString();
  return apiFetch<PaginatedResponse<AuditLog[]>>(
    `audit-log${query ? `?${query}` : ""}`,
    {
      requiresAuth: true,
    },
  );
};
