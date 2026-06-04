"use client";

import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "@/lib/api/products";
import { Product } from "@/types/product";
import Pagination from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";
import { PaginatedResponse } from "@/types/pagination";
import DesktopAdminProducts from "@/components/admin/products/DesktopAdminProducts";
import MobileAdminProducts from "@/components/admin/products/MobileAdminProducts";

export default function AdminProductsPage() {
  const [data, setData] = useState<PaginatedResponse<Product[]> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts({ page, limit: 8 });
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
      fetchProducts(data?.meta.currentPage || 1);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-stone-500 animate-pulse">
          Loading products database...
        </span>
      </div>
    );
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!data)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="p-4">No products found.</p>
      </div>
    );

  return (
    <>
      <header className="flex justify-between items-center mt-4">
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

      <MobileAdminProducts data={data} handleDelete={handleDelete} />

      <DesktopAdminProducts data={data} handleDelete={handleDelete} />

      <Pagination
        currentPage={data.meta.currentPage}
        totalPages={data.meta.totalPages}
        hasNextPage={data.meta.hasNextPage}
        hasPreviousPage={data.meta.hasPreviousPage}
        onPageChange={(page) => fetchProducts(page)}
      />
    </>
  );
}
