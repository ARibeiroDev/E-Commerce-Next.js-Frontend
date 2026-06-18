import ProductInteraction from "@/components/products/ProductInteraction";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import BackButton from "@/components/ui/BackButton";
import { getProductBySlug } from "@/lib/api/products";
import { Product } from "@/types/product";
import { getDiscount } from "@/utils/discountedPrice";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product.title,
    description: product.description,
  };
}

const ProductPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ size?: string; color?: string }>;
}) => {
  const { slug } = await params;
  const { size, color } = await searchParams;

  const product: Product = await getProductBySlug(slug);

  const selectedColor = color || "";
  const selectedSize = size || "";

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor,
  );

  // Base product price
  const basePrice = Number(product.basePrice);

  // Global max discount for initial selection
  const maxDiscount = product.variants.reduce(
    (max, v) =>
      v.discountPercentage && v.discountPercentage > max
        ? v.discountPercentage
        : max,
    0,
  );

  // Selected variant discount
  const discount = selectedVariant
    ? (selectedVariant.discountPercentage ?? 0)
    : maxDiscount;

  // Calculate final price
  const finalPrice = getDiscount(basePrice, discount);

  return (
    <main className="flex-1 px-[5vw] lg:px-[10vw] flex flex-col">
      <Suspense fallback={<ProductSkeleton />}>
        <article className="flex flex-col gap-4 md:flex-row md:gap-12 my-8 bg-gray-200 dark:bg-stone-800 rounded-md p-4 transition-all duration-100 ease-in-out">
          <figure className="w-full md:max-w-5/12 transition-all duration-100 ease-in-out relative aspect-square">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="100%"
              className="object-cover rounded-md"
            />
            <figcaption className="sr-only">{product.title}</figcaption>
          </figure>
          <div className="flex flex-col">
            <section className="w-full flex-1 xl:w-7/12 transition-all duration-100 ease-in-out flex flex-col gap-4">
              <h2 className="text-3xl font-medium">{product.title}</h2>
              <p className="text-stone-600 dark:text-gray-300">
                {product.description}
              </p>
              <h3 className="text-xl sm:text-2xl font-semibold">
                {discount ? (
                  <>
                    <span className="line-through text-gray-400">
                      ${basePrice.toFixed(2)}
                    </span>
                    <span className="text-green-600 mx-2">${finalPrice}</span>
                    <span className="bg-red-500 text-white px-2 rounded">
                      -{discount}%
                    </span>
                  </>
                ) : (
                  <>${basePrice.toFixed(2)}</>
                )}
              </h3>
              <ProductInteraction
                product={product}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
              />
            </section>
            <section className="flex items-center gap-2 mt-4">
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
            <p className="text-stone-600 dark:text-gray-300 text-xs mt-4">
              By clicking Pay Now, you agree to ClothingCo&apos;s{" "}
              <Link
                href="/terms-and-conditions"
                className="underline hover:brightness-80"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="underline hover:brightness-80"
              >
                Privacy Policy
              </Link>
              . You authorize us to charge your selected payment method for the
              total amount shown. All sales are subject to our return and{" "}
              <Link
                href="/refund-policy"
                className="underline hover:brightness-80"
              >
                Refund Policies
              </Link>
              .
            </p>
          </div>
        </article>
      </Suspense>
      <BackButton styles="flex items-center gap-1 my-4 self-end cursor-pointer" />
    </main>
  );
};

export default ProductPage;
