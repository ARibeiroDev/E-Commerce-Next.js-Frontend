import { apiFetch } from "@/lib/api-client";
import type { Role, PrivateUserDto } from "@/types/user";
import type { PaginatedResponse } from "@/types/pagination";
import { cache } from "react";

const endpoint = "users";

// SELF

export const getMe = () => {
  return apiFetch<PrivateUserDto>(`${endpoint}/me`, {
    requiresAuth: true,
  });
};

export const updateMe = (data: { username?: string; password?: string }) => {
  return apiFetch<PrivateUserDto>(`${endpoint}/me`, {
    method: "PATCH",
    body: JSON.stringify(data),
    requiresAuth: true,
  });
};

// ADMIN

export type UserQuery = {
  page?: number;
  limit?: number;
  username?: string;
  email?: string;
  search?: string;
  isActive?: boolean;
  isVerified?: boolean;
};

const buildQuery = (params?: UserQuery) => {
  const searchParams = new URLSearchParams();

  if (!params) return "";

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.username) searchParams.set("username", params.username);
  if (params.email) searchParams.set("email", params.email);
  if (params.search) searchParams.set("search", params.search);

  if (params.isActive !== undefined) {
    searchParams.set("isActive", params.isActive.toString());
  }
  if (params.isVerified !== undefined) {
    searchParams.set("isVerified", params.isVerified.toString());
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const getUsers = cache((params?: UserQuery) => {
  const query = buildQuery(params);

  return apiFetch<PaginatedResponse<PrivateUserDto[]>>(`${endpoint}${query}`, {
    next: { revalidate: 60 }, // cache for 60s
    requiresAuth: true,
  });
});

export const adminUpdateUser = (
  id: string,
  data: { role?: Role; isActive?: boolean },
) => {
  return apiFetch<PrivateUserDto>(`${endpoint}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    requiresAuth: true,
  });
};

export const deleteUser = (id: string) => {
  return apiFetch<PrivateUserDto>(`${endpoint}/${id}`, {
    method: "DELETE",
    requiresAuth: true,
  });
};
