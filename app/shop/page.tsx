"use client";

import ProductCardSkeleton from "@/components/products/ProductCardSkeleton";
import ProductGrid from "@/components/products/ProductGrid";
import FiltersBar from "@/components/ui/FiltersBar";
import Pagination from "@/components/ui/Pagination";
import { getProducts } from "@/lib/api/products";
import { Category, getCategories } from "@/lib/api/categories";
import { PaginatedResponse, PaginationMeta } from "@/types/pagination";
import { Product } from "@/types/product";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const ShopPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read filters from URL
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 6);
  const categoryId = searchParams.get("categoryId") ?? "";
  const search = searchParams.get("title") ?? "";
  const sortBy =
    (searchParams.get("sortBy") as "createdAt" | "basePrice" | "title") ??
    "createdAt";
  const orderBy = (searchParams.get("orderBy") as "asc" | "desc") ?? "desc";

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error: unknown) {
        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: PaginatedResponse<Product[]> = await getProducts({
        page,
        limit,
        categoryId: categoryId || undefined,
        title: search || undefined,
        sortBy,
        orderBy,
      });

      setProducts(response.data);
      setMeta(response.meta);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, categoryId, search, sortBy, orderBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (
    key: string,
    value: string | number | { sortBy: string; orderBy: string },
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset page when filters change
    if (key !== "page") params.set("page", "1");

    if (key === "sort" && typeof value === "object") {
      params.set("sortBy", value.sortBy);
      params.set("orderBy", value.orderBy);
      params.delete("sort"); // Remove the old sort param if it exists
    } else {
      // Remove empty query params
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <main className="flex-1 px-[5vw] lg:px-[10vw] py-4 animate-appear">
      <h2 className="sr-only">Shop</h2>

      <FiltersBar
        search={search}
        selectedCategory={categoryId}
        categories={categories}
        sortBy={sortBy}
        orderBy={orderBy}
        handleFilterChange={handleFilterChange}
      />

      {isLoading && (
        <div
          role="status"
          aria-busy="true"
          aria-label="Loading products"
          className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 mt-4"
        >
          {Array.from({ length: limit }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <div role="alert" className="text-red-500">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div role="region" aria-live="polite" aria-label="Product results">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-8">No products found</div>
          )}
        </div>
      )}

      {meta && products.length > 0 && (
        <Pagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          hasNextPage={meta.hasNextPage}
          hasPreviousPage={meta.hasPreviousPage}
          onPageChange={(p) => handleFilterChange("page", p)}
        />
      )}
    </main>
  );
};

export default ShopPage;
