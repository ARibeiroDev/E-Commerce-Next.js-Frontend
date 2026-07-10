"use server";

import { revalidateTag } from "next/cache";

export const revalidateProducts = async () => {
  revalidateTag("products", "max");
};

export const revalidateProduct = async (slug: string) => {
  revalidateTag(`product-:${slug}`, "max");
};
