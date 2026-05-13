"use client";

import { useCartStore } from "@/stores/cartStore";
import { Product } from "@/types/product";
import { getDiscount } from "@/utils/discountedPrice";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: Product }) => {
  const pathName = usePathname();

  const maxDiscount = product.variants.reduce(
    (max, v) =>
      v.discountPercentage && v.discountPercentage > max
        ? v.discountPercentage
        : max,
    0,
  );

  const discountedPrice = getDiscount(Number(product.basePrice), maxDiscount);

  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));

  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);

  const availableSizes = useMemo(() => {
    return product.variants
      .filter((v) => v.color === selectedColor && v.stock > 0)
      .map((v) => v.size);
  }, [product.variants, selectedColor]);

  const availableColors = useMemo(() => {
    return product.variants
      .filter((v) => v.size === selectedSize && v.stock > 0)
      .map((v) => v.color);
  }, [product.variants, selectedSize]);

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor,
  );

  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(selectedVariant.sku, 1).then(() => {
        toast.success(`${product.title} added to cart!`);
      });
    }
  };

  return (
    <div
      key={product.id}
      className="relative bg-gray-200 dark:bg-stone-800 p-2 rounded-lg flex flex-col"
    >
      {/* Discount badge */}
      {maxDiscount > 0 && (
        <span className="absolute z-10 top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded">
          -{maxDiscount}%
        </span>
      )}

      <figure className="overflow-hidden rounded-lg w-full">
        <Link
          href={`/shop/${product.slug}?from=${encodeURIComponent(pathName)}`}
        >
          <Image
            src={product.images[0]}
            alt={product.title}
            width={1000}
            height={1000}
            className="aspect-square object-cover hover:scale-105 transition-all duration-300 ease-in-out"
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

      {/* Sizes and colors */}
      <div className="flex items-center gap-4 text-xs mt-2">
        {/* Sizes */}
        <div className="flex flex-col gap-1">
          <span>Size</span>
          {/* TODO: Add sizes selected to product in order to add to cart */}
          <select
            value={selectedSize}
            id="sizes"
            className="ring-1 ring-gray-300 rounded-md px-2 py-1"
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {sizes.map((size) => {
              const disabled = !availableSizes.includes(size);

              return (
                <option
                  className="bg-gray-300 dark:bg-stone-700"
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

        {/* Colors */}
        <div className="flex flex-col gap-">
          <span>Color</span>
          {/* TODO: Add color selected to product in order to add to cart */}
          <div className="flex items-center gap-2">
            {colors.map((color) => {
              const disabled = !availableColors.includes(color);

              return (
                <button
                  type="button"
                  key={color}
                  disabled={disabled}
                  onClick={() => setSelectedColor(color)}
                  className={`border p-0.5 transition-all ${selectedColor === color ? "border-stone-900 dark:border-gray-300" : "border-gray-300"} ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
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

      <button
        className="mt-4 self-end rounded-lg hover:bg-stone-900 hover:text-gray-300 text-stone-700 dark:text-gray-300 py-2 px-6 cursor-pointer bg-gray-300 dark:bg-stone-700 transition-all duration-200 ease-in-out"
        onClick={handleAddToCart}
      >
        Add to cart
      </button>
    </div>
  );
};

export default ProductCard;
