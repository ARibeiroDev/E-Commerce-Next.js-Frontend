import { apiFetch } from "@/lib/api-client";

export type Category = {
  id: string;
  name: string;
};

export const getCategories = () => {
  return apiFetch<Category[]>("categories", {
    next: { revalidate: 60 },
  });
};
