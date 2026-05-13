import { getProducts } from "@/lib/api/products";
import { ProductQuery } from "@/types/product-query";
import { ArrowRight, Megaphone } from "lucide-react";
import Link from "next/link";
import ProductGrid from "./ProductGrid";

const ProductSection = async ({
  title,
  params,
}: {
  title?: string;
  params?: ProductQuery;
}) => {
  const { data: products } = await getProducts(params);

  return (
    <section className="flex flex-col px-[5vw] lg:px-[10vw] my-8">
      {title && (
        <header className="flex items-center gap-2 text-3xl">
          <Megaphone />
          <h2>{title}</h2>
        </header>
      )}

      <ProductGrid products={products} />

      <Link
        href="/shop"
        className="mt-4 flex items-center gap-1 place-self-end hover:translate-x-1 transition-all duration-300"
      >
        View all products <ArrowRight />
      </Link>
    </section>
  );
};

export default ProductSection;
