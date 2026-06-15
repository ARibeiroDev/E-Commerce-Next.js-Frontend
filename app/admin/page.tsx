"use client";

import { useEffect, useState } from "react";
import { getDashboardAnalytics, DashboardStats } from "@/lib/api/analytics";
import { DollarSign, Users, Smile, Package, TrendingUp } from "lucide-react";
import Link from "next/link";

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

  const kpiCardStyle =
    "bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col justify-between";

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

  if (error) return <p className="p-4 text-red-500">{error}</p>;
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
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <article className={kpiCardStyle}>
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium">Gross Revenue</h3>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4">
            $
            {Number(stats.revenue).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
        </article>

        <article className={kpiCardStyle}>
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium">Total Users</h3>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold mt-4">{stats.totalUsers}</p>
            <p className="text-sm mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600 font-medium">
                +{stats.newUsersThisMonth}
              </span>{" "}
              this month
            </p>
          </div>
        </article>

        <article className={kpiCardStyle}>
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium">Client Satisfaction</h3>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Smile className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold">{stats.satisfactionRate}%</p>
            {/* Native CSS Progress Bar */}
            <div className="w-full bg-stone-200 dark:bg-stone-900 rounded-full h-1.5 mt-3">
              <div
                className="bg-purple-500 h-1.5 rounded-full"
                style={{ width: `${stats.satisfactionRate}%` }}
              ></div>
            </div>
          </div>
        </article>

        <article className={kpiCardStyle}>
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium">Product of the Month</h3>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Package className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          <Link href={`/shop/${stats.topProducts[0]?.slug}`}>
            <p className="text-sm font-bold truncate mt-4">
              {stats.topProducts[0]?.name || "No sales yet"}
            </p>
          </Link>
        </article>
      </section>

      {/* Top Products Detailed List */}
      <section className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-6">Top Selling Products</h3>

        {stats.topProducts.length === 0 ? (
          <p className="text-sm text-center py-6">
            No product data available yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <li key={product.sku}>
                <Link
                  href={`/shop/${stats.topProducts[index]?.slug}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:border-stone-300 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-xs font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{product.name}</p>
                      <p className="text-xs font-mono mt-0.5">
                        SKU: {product.sku}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
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
