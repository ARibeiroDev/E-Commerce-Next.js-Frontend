"use server";

import { revalidateTag } from "next/cache";

export const revalidateProduct = async (slug: string) => {
  revalidateTag(`product-:${slug}`, "max");
  console.log(`Cache cleared for product: ${slug}`);
};
