import { apiFetch } from "@/lib/api-client";

export type TopProduct = {
  name: string;
  sku: string;
  sold: number;
  slug: string;
};

export type DashboardStats = {
  revenue: string; // Prisma Decimals arrive as strings over JSON
  satisfactionRate: number;
  newUsersThisMonth: number;
  totalUsers: number;
  topProducts: TopProduct[];
};

export const getDashboardAnalytics = () => {
  return apiFetch<DashboardStats>("analytics/dashboard", {
    method: "GET",
    requiresAuth: true,
  });
};
