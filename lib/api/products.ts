import {
  CreateProductPayload,
  ProductVariantPayload,
} from "@/types/productForm";
import { apiFetch } from "../api-client";
import { PaginatedResponse } from "@/types/pagination";
import { Product } from "@/types/product";
import { ProductQuery } from "@/types/product-query";
import { cache } from "react";

const endpoint = "products";

const buildQuery = (params?: ProductQuery) => {
  const search = new URLSearchParams();

  if (!params) return "";

  if (params.page) search.set("page", params.page.toString());
  if (params.limit) search.set("limit", params.limit.toString());
  if (params.categoryId) search.set("categoryId", params.categoryId);
  if (params.title) search.set("title", params.title);
  if (params.featured !== undefined)
    search.set("featured", params.featured.toString());

  if (params.tags?.length) {
    params.tags.forEach((tag) => search.append("tags[]", tag.toLowerCase()));
  }

  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.orderBy) search.set("orderBy", params.orderBy);

  const query = search.toString();
  return query ? `?${query}` : "";
};

export const getProducts = cache((params?: ProductQuery) => {
  const query = buildQuery(params);

  return apiFetch<PaginatedResponse<Product[]>>(`${endpoint}${query}`, {
    next: { revalidate: 60 }, // Cache for 60s
  });
});

export const getProductBySlug = (slug: string) => {
  return apiFetch<Product>(`${endpoint}/${slug}`, {
    next: {
      tags: [`product-:${slug}`], // Unique tag for this specific product
      revalidate: 60,
    },
  });
};

export const getProductsByCategory = (categoryId: string) => {
  return apiFetch<Product[]>(`${endpoint}?categoryId=${categoryId}`);
};

export const createProduct = (product: CreateProductPayload) => {
  return apiFetch<Product>(endpoint, {
    method: "POST",
    body: JSON.stringify(product),
    requiresAuth: true,
  });
};

export const updateProduct = (
  slug: string,
  product: Partial<CreateProductPayload>,
) => {
  return apiFetch<Product>(`${endpoint}/${slug}`, {
    method: "PATCH",
    body: JSON.stringify(product),
    requiresAuth: true,
  });
};

export const deleteProduct = (slug: string) => {
  return apiFetch<void>(`${endpoint}/${slug}`, {
    method: "DELETE",
    requiresAuth: true,
  });
};

export const addProductVariant = (
  slug: string,
  variant: ProductVariantPayload,
) => {
  return apiFetch(`${endpoint}/${slug}/variants`, {
    method: "POST",
    body: JSON.stringify(variant),
    requiresAuth: true,
  });
};

export const updateProductVariant = (
  slug: string,
  sku: string,
  variant: ProductVariantPayload,
) => {
  return apiFetch(`${endpoint}/${slug}/variants/${sku}`, {
    method: "PATCH",
    body: JSON.stringify(variant),
    requiresAuth: true,
  });
};

export const deleteProductVariant = (slug: string, sku: string) => {
  return apiFetch(`${endpoint}/${slug}/variants/${sku}`, {
    method: "DELETE",
    requiresAuth: true,
  });
};
