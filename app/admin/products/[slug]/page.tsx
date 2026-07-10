"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductBySlug } from "@/lib/api/products";
import { Product } from "@/types/product";
import ProductForm from "@/components/forms/products/ProductForm";
import Loading from "@/app/loading";

export default function EditProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true; // Guard against setting state on unmounted components

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductBySlug(slug);
        if (isMounted) setProduct(data);
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load product",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div
        className="p-6 min-h-100 max-w-4xl mx-auto flex justify-center items-center h-64"
        aria-busy="true"
        aria-live="polite"
      >
        <Loading />
        <p className="text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div role="alert" className="p-6 max-w-4xl mx-auto">
        <p className="text-red-500 dark:text-stone-900 bg-red-100 dark:bg-red-200 p-4 rounded-md border border-red-200 dark:border-red-300">
          {error || "Product not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex flex-col gap-2">
        <h3 className="text-xl lg:text-2xl font-bold">
          Edit Product: {product.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-stone-400">
          Update the product details and manage variants below.
        </p>
      </header>

      <ProductForm initialData={product} />
    </div>
  );
}
