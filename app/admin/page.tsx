"use client";

import { useEffect, useState } from "react";
import { getDashboardAnalytics, DashboardStats } from "@/lib/api/analytics";
import { DollarSign, Users, Smile, Package, TrendingUp } from "lucide-react";
import Link from "next/link";
import { KpiCard } from "@/components/admin/analytics/KpiCard";

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardAnalytics();
      setStats(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-stone-200 dark:bg-stone-800 rounded-xl"
            ></div>
          ))}
        </div>
        <div className="h-64 bg-stone-200 dark:bg-stone-800 rounded-xl w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <section
        role="alert"
        className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 border border-red-200 dark:border-red-900/30"
      >
        <p className="text-sm font-semibold">
          Analytical Sync Failure: {error}
        </p>
      </section>
    );
  }
  if (!stats) return null;

  return (
    <>
      <header>
        <h2 className="text-xl sm:text-2xl font-semibold">
          Overview Dashboard
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Real-time metrics and store performance.
        </p>
      </header>

      {/* KPI Cards */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        aria-label="Key Performance Indicators"
      >
        <KpiCard
          title="Total Sales"
          icon={
            <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          }
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
        >
          <p className="text-3xl font-bold tracking-tight">
            ${" "}
            {Number(stats.revenue).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </KpiCard>

        <KpiCard
          title="Total Users"
          icon={<Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
        >
          <p className="text-3xl font-bold tracking-tight">
            {stats.totalUsers}
          </p>
          <p className="text-xs mt-1 flex items-center gap-1 text-stone-500 dark:text-stone-400">
            <TrendingUp
              className="w-3 h-3 text-emerald-500"
              aria-hidden="true"
            />
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              +{stats.newUsersThisMonth}
            </span>{" "}
            this month
          </p>
        </KpiCard>

        <KpiCard
          title="Client Satisfaction"
          icon={
            <Smile className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          }
          iconBg="bg-purple-100 dark:bg-purple-900/30"
        >
          <p className="text-3xl font-bold tracking-tight">
            {stats.satisfactionRate}%
          </p>
          <div
            role="progressbar"
            aria-valuenow={stats.satisfactionRate}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Client satisfaction distribution scale"
            className="w-full bg-stone-200 dark:bg-stone-900 rounded-full h-1.5 mt-3 overflow-hidden"
          >
            <div
              className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${stats.satisfactionRate}%` }}
            />
          </div>
        </KpiCard>

        <KpiCard
          title="Product of the Month"
          icon={
            <Package className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          }
          iconBg="bg-amber-100 dark:bg-amber-900/30"
        >
          {stats.topProducts[0] ? (
            <Link
              href={`/shop/${stats.topProducts[0].slug}`}
              className="text-sm font-bold truncate block text-stone-900 dark:text-gray-100 hover:underline hover:text-stone-600 dark:hover:text-stone-300 focus-visible:outline-none focus-visible:underline"
            >
              {stats.topProducts[0].name}
            </Link>
          ) : (
            <p className="text-sm font-medium text-stone-400 dark:text-stone-500 italic">
              No sales recorded
            </p>
          )}
        </KpiCard>
      </section>

      {/* Top Products Detailed List */}
      <section
        className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6 shadow-sm"
        aria-labelledby="top-selling-heading"
      >
        <h3 className="text-lg font-bold mb-6" id="top-selling-heading">
          Top Selling Products
        </h3>

        {stats.topProducts.length === 0 ? (
          <p className="text-sm text-center py-6">
            No product data available yet.
          </p>
        ) : (
          <ul className="space-y-3" role="list">
            {stats.topProducts.map((product, index) => (
              <li key={product.sku}>
                <Link
                  href={`/shop/${stats.topProducts[index]?.slug}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:border-stone-300 transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-xs font-bold"
                      aria-hidden="true"
                    >
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{product.name}</p>
                      <p className="text-xs font-mono mt-0.5">
                        SKU: {product.sku}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <p className="font-bold">{product.sold}</p>
                    <p className="text-xs">units sold</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
