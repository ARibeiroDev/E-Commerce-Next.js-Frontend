import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import ProductInteraction from "@/components/products/ProductInteraction";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import BackButton from "@/components/ui/BackButton";
import { getProductBySlug, getProducts } from "@/lib/api/products";
import { Product } from "@/types/product";
import { getDiscount } from "@/utils/discountedPrice";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ size?: string; color?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product || product.isArchived) return { title: "Product Not Found" };

    return {
      title: `${product.title}`,
      description:
        product.description || "Quality Clothing at Affordable Prices",
    };
  } catch (error: unknown) {
    return { title: "Shop" };
  }
}

// Pre-generation of static paths for products to enhance performance and SEO
export const generateStaticParams = async () => {
  try {
    const { data: products } = await getProducts({ limit: 30, page: 1 });
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch {
    return [];
  }
};

type ContentProps = {
  slug: string;
  selectedSize: string;
  selectedColor: string;
};

const ProductDetailContent = async ({
  slug,
  selectedSize,
  selectedColor,
}: ContentProps) => {
  const product: Product = await getProductBySlug(slug);

  if (!product || product.isArchived) return notFound();

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor,
  );

  // Base product price
  const basePrice = Number(product.basePrice);

  // If a variant is selected, use its discount. Otherwise, calculate max discount for badge.
  const activeDiscount = selectedVariant?.discountPercentage || 0;
  const maxDiscount = product.variants.reduce(
    (max, v) =>
      v.discountPercentage && v.discountPercentage > max
        ? v.discountPercentage
        : max,
    0,
  );

  const currentPrice =
    activeDiscount > 0 ? getDiscount(basePrice, activeDiscount) : basePrice;
  const hasSelectedDiscount = activeDiscount > 0;
  const hasAnyDiscount = maxDiscount > 0;

  // SEO structured data for Google Merchant/Rich Results
  // Modern E-Commerce must-have
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: product.images?.[0],
    description: product.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: Number(currentPrice).toFixed(2),
      availability: product.variants.some((v) => v.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 my-4 items-start">
        <figure className="w-full relative aspect-square bg-stone-100 dark:bg-stone-800 rounded-xl overflow-hidden shadow-sm">
          <Image
            src={product.images?.[0]}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
            draggable="false"
          />
          <figcaption className="sr-only">{product.title}</figcaption>
          {hasSelectedDiscount ? (
            <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">
              {activeDiscount}% OFF
            </span>
          ) : hasAnyDiscount ? (
            <span className="absolute top-4 left-4 bg-stone-900 dark:bg-stone-100 dark:text-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">
              Up to {maxDiscount}% OFF
            </span>
          ) : null}
        </figure>
        <div className="flex flex-col gap-6">
          <section>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">
              {product.title}
            </h2>
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl font-bold text-stone-900 dark:text-gray-100">
                ${Number(currentPrice).toFixed(2)}
              </span>
              {hasSelectedDiscount && (
                <span className="text-lg text-stone-400 line-through">
                  ${basePrice.toFixed(2)}
                </span>
              )}
            </div>
          </section>

          <hr className="border-stone-200 dark:border-stone-700" />

          <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-sm md:text-base">
            {product.description}
          </p>
          <ProductInteraction
            product={product}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
          />

          <div className="mt-6 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700">
            <section
              className="flex items-center gap-3"
              aria-label="Accepted payment methods"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Secured Checkout:
              </span>
              <Image
                src="https://cdn.brandfetch.io/id-Wd4a4TS/theme/dark/id31tBizMM.svg?c=1bxid64Mup7aczewSAYMX&t=1727787879793"
                alt="Paypal"
                width={54}
                height={54}
                className="dark:invert-50 aspect-auto"
              />
              <Image
                src="https://cdn.brandfetch.io/idxAg10C0L/theme/dark/idsqGvSNgF.svg?c=1bxid64Mup7aczewSAYMX&t=1746435898701"
                alt="Stripe"
                width={48}
                height={48}
                className="dark:invert-50 aspect-auto"
              />
              <Image
                src="https://cdn.brandfetch.io/idhem73aId/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1679062242416"
                alt="Visa"
                width={40}
                height={40}
                className="dark:invert-50 aspect-auto"
              />
            </section>
            <p className="text-stone-500 dark:text-stone-400 text-[11px] leading-normal mt-3">
              By executing purchases, you authorize transactions under
              ClothingCo&apos;s{" "}
              <Link
                href="/terms-and-conditions"
                className="underline hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="underline hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              . Conversions are safeguarded under our{" "}
              <Link
                href="/refund-policy"
                className="underline hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                Refund Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </article>
    </>
  );
};

const ProductPage = async ({ params, searchParams }: PageProps) => {
  const { slug } = await params;
  const { size, color } = await searchParams;

  return (
    <main className="flex-1 px-[5vw] lg:px-[10vw] animate-appear flex flex-col min-h-screen">
      <BackButton styles="cursor-pointer flex items-center gap-1 my-4 self-start text-stone-600 dark:text-gray-400 hover:text-stone-900 dark:hover:text-white transition-colors" />

      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetailContent
          slug={slug}
          selectedSize={size || ""}
          selectedColor={color || ""}
        />
      </Suspense>
    </main>
  );
};

export default ProductPage;
