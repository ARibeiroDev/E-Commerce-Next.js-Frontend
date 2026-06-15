"use client";

import { useEffect, useState } from "react";
import { getProducts, deleteProduct, updateProduct } from "@/lib/api/products";
import { Product } from "@/types/product";
import Pagination from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";
import { PaginatedResponse } from "@/types/pagination";
import DesktopAdminProducts from "@/components/admin/products/DesktopAdminProducts";
import MobileAdminProducts from "@/components/admin/products/MobileAdminProducts";
import { revalidateProduct, revalidateProducts } from "@/utils/revalidateCache";

export default function AdminProductsPage() {
  const [data, setData] = useState<PaginatedResponse<Product[]> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [archivedView, setArchivedView] = useState(false);

  const router = useRouter();

  const fetchProducts = async (page = 1, archived = archivedView) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts({ page, limit: 8, isArchived: archived });
      setData(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      await deleteProduct(slug);
      await revalidateProduct(slug);
      await revalidateProducts();
      fetchProducts(data?.meta.currentPage || 1, archivedView);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleRestore = async (slug: string) => {
    if (!confirm("Restore this product to active status?")) return;

    try {
      await updateProduct(slug, { isArchived: false });
      await revalidateProduct(slug);
      await revalidateProducts();
      fetchProducts(data?.meta.currentPage || 1, archivedView);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Restore failed");
    }
  };

  const handleViewChange = (archived: boolean) => {
    setArchivedView(archived);
    fetchProducts(1, archived);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <header className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-semibold">Products</h2>

        <button
          onClick={() => router.push("/admin/products/create")}
          className="group flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded min-w-12 min-h-12 px-2 overflow-hidden transition-all duration-300 cursor-pointer"
          aria-label="Create New Product"
          title="Create New Product"
        >
          <span className=" font-bold">+</span>

          <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
            New Product
          </span>
        </button>
      </header>

      <nav className="flex gap-2 bg-gray-100 dark:bg-stone-800 p-1 rounded-md w-max mb-6">
        <button
          onClick={() => handleViewChange(false)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer ${
            !archivedView
              ? "bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-white"
              : "text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => handleViewChange(true)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer ${
            archivedView
              ? "bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-white"
              : "text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
          }`}
        >
          Deleted
        </button>
      </nav>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <span className="text-stone-500 animate-pulse">
            Loading products...
          </span>
        </div>
      ) : error ? (
        <p className="p-4 text-red-500">{error}</p>
      ) : !data || data.data.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg text-gray-400 mb-6">
          <p className="text-stone-500">
            No {archivedView ? "archived" : "active"} products found.
          </p>
        </div>
      ) : (
        <>
          <MobileAdminProducts
            data={data}
            handleDelete={handleDelete}
            handleRestore={handleRestore}
            archivedView={archivedView}
          />
          <DesktopAdminProducts
            data={data}
            handleDelete={handleDelete}
            handleRestore={handleRestore}
            archivedView={archivedView}
          />

          <Pagination
            currentPage={data.meta.currentPage}
            totalPages={data.meta.totalPages}
            hasNextPage={data.meta.hasNextPage}
            hasPreviousPage={data.meta.hasPreviousPage}
            onPageChange={(page) => fetchProducts(page, archivedView)}
          />
        </>
      )}
    </>
  );
}
