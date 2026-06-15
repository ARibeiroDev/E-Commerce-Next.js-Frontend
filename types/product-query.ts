export type ProductQuery = {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "basePrice" | "title";
  orderBy?: "asc" | "desc";
  categoryId?: string;
  title?: string;
  featured?: boolean;
  isArchived?: boolean;
  tags?: string[];
};
