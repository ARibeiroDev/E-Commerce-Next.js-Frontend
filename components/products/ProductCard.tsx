"use client";

import useCart from "@/hooks/useCart";
import { Product } from "@/types/product";
import { getDiscount } from "@/utils/discountedPrice";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: Product }) => {
  const pathName = usePathname();
  const { addToCart } = useCart();

  // Check if all variants are out of stock
  const isGlobalOutOfStock =
    product.variants.length === 0 ||
    product.variants.every((v) => v.stock === 0);

  // Check if product is archived
  const isArchived = product.isArchived;

  const maxDiscount = product.variants.reduce(
    (max, v) =>
      v.discountPercentage && v.discountPercentage > max
        ? v.discountPercentage
        : max,
    0,
  );

  const discountedPrice = getDiscount(Number(product.basePrice), maxDiscount);

  // Get unique sizes and colors, only recompute when variants change
  const sizes = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.size))),
    [product.variants],
  );
  const colors = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.color))),
    [product.variants],
  );

  // Initialize selection as unselected ("")
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  // If no color/size selected, evaluate stock across all options
  const availableSizes = useMemo(() => {
    return product.variants
      .filter(
        (v) => (!selectedColor || v.color === selectedColor) && v.stock > 0,
      )
      .map((v) => v.size);
  }, [product.variants, selectedColor]);

  const availableColors = useMemo(() => {
    return product.variants
      .filter((v) => (!selectedSize || v.size === selectedSize) && v.stock > 0)
      .map((v) => v.color);
  }, [product.variants, selectedSize]);

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor,
  );

  const handleAddToCart = async () => {
    let variantToUse = selectedVariant;

    // Fallback to first available
    if (!variantToUse) {
      variantToUse =
        product.variants.find(
          (v) =>
            (!selectedSize || v.size === selectedSize) &&
            (!selectedColor || v.color === selectedColor) &&
            v.stock > 0,
        ) || product.variants.find((v) => v.stock > 0);
    }

    // Prevent bypass stock checks
    if (!variantToUse || variantToUse.stock === 0) {
      toast.error("This product is currently out of stock");
      return;
    }

    const result = await addToCart({
      sku: variantToUse.sku,
      quantity: 1,
      slug: product.slug,
      productTitle: product.title,
      image: product.images[0],
      color: variantToUse.color,
      size: variantToUse.size,
      price: Number(variantToUse.finalPrice),
      stock: variantToUse.stock,
      discountPercentage: variantToUse.discountPercentage,
    });

    if (result?.success) {
      toast.success(
        `${product.title} (${variantToUse.size.toUpperCase()} / ${variantToUse.color}) added to cart`,
      );
    } else {
      toast.error(`Cannot add more than available stock`);
    }
  };

  return (
    <div
      key={product.id}
      className="relative bg-gray-200 dark:bg-stone-800 p-2 rounded-lg flex flex-col"
    >
      {/* Badges: Out of Sotck or Discount */}
      {isGlobalOutOfStock ? (
        <span className="absolute z-10 top-3 left-3 bg-stone-900 text-gray-100 dark:bg-gray-100 dark:text-stone-900 px-2 py-1 text-xs rounded font-medium shadow-md">
          Out of Stock
        </span>
      ) : maxDiscount > 0 ? (
        <span className="absolute z-10 top-3 right-3 bg-red-500 text-white px-2 py-1 text-xs rounded shadow-md">
          -{maxDiscount}%
        </span>
      ) : null}

      <figure className="overflow-hidden rounded-lg w-full">
        <Link
          href={`/shop/${product.slug}?from=${encodeURIComponent(pathName)}`}
        >
          <Image
            src={product.images[0]}
            alt={product.title}
            width={1000}
            height={1000}
            className={`aspect-square object-cover hover:scale-105 transition-all duration-300 ease-in-out ${isGlobalOutOfStock ? "brightness-30" : ""}`}
          />
        </Link>
        <figcaption className="sr-only">{product.title}</figcaption>
      </figure>

      <h3 className="font-semibold mt-2">{product.title}</h3>

      {/* Main price display */}
      <div className="flex items-center gap-2 flex-1 mt-1">
        {maxDiscount > 0 ? (
          <>
            <span className="line-through text-gray-500">
              ${product.basePrice}
            </span>
            <span className="text-green-500 font-bold">${discountedPrice}</span>
          </>
        ) : (
          <span className="font-bold">${product.basePrice}</span>
        )}
      </div>

      {isGlobalOutOfStock ? (
        <div className="flex-1 flex items-center justify-center mt-3 bg-gray-300 dark:bg-stone-700/50 rounded-md p-2">
          <span className="text-sm font-medium text-stone-500 dark:text-gray-400">
            Currently unavailable
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-4 text-xs mt-2">
          {/* Sizes */}
          <div className="flex flex-col gap-1">
            <span>Size</span>
            <select
              value={selectedSize}
              id="sizes"
              className="ring-1 ring-gray-300 rounded-md px-2 py-1 bg-transparent dark:bg-stone-700 text-stone-900 dark:text-white cursor-pointer"
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">- Sizes -</option>
              {sizes.map((size) => {
                const disabled = !availableSizes.includes(size);
                return (
                  <option
                    className="bg-gray-300 dark:bg-stone-700 text-stone-900 dark:text-white"
                    key={size}
                    value={size}
                    disabled={disabled}
                  >
                    {size.toUpperCase()}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Colors Selection */}
          <div className="flex flex-col gap-1">
            <span>Color</span>
            <div className="flex items-center gap-2">
              {colors.map((color) => {
                const disabled = !availableColors.includes(color);
                const isSelected = selectedColor === color;

                return (
                  <button
                    type="button"
                    key={color}
                    disabled={disabled}
                    onClick={() => setSelectedColor(isSelected ? "" : color)}
                    className={`border p-0.5 transition-all ${
                      isSelected
                        ? "border-stone-900 dark:border-white scale-110"
                        : "border-gray-300 dark:border-gray-400"
                    } ${
                      disabled
                        ? "opacity-20 cursor-not-allowed"
                        : "cursor-pointer hover:scale-105"
                    }`}
                  >
                    <div
                      className="w-3.5 h-3.5"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <button
        disabled={isGlobalOutOfStock || isArchived}
        className={`mt-4 self-end rounded-lg py-2 px-6 transition-all duration-200 ease-in-out ${
          isGlobalOutOfStock || isArchived
            ? "bg-gray-300 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed"
            : "bg-gray-300 dark:bg-stone-700 hover:bg-stone-900 hover:text-gray-300 text-stone-700 dark:text-gray-300 cursor-pointer"
        }`}
        onClick={handleAddToCart}
      >
        {isGlobalOutOfStock || isArchived ? "Out of stock" : "Add to cart"}
      </button>
    </div>
  );
};

export default ProductCard;
