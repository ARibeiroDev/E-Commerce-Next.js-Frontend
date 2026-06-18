"use client";

import useCart from "@/hooks/useCart";
import { Product } from "@/types/product";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";

const ProductInteraction = ({
  product,
  selectedSize,
  selectedColor,
}: {
  product: Product;
  selectedSize: string;
  selectedColor: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);

  // Normalize incoming props to handle unselected route state
  const sizeFilter = selectedSize || "";
  const colorFilter = selectedColor || "";

  const selectedVariant = product.variants.find(
    (v) => v.size === sizeFilter && v.color === colorFilter,
  );

  // Dynamic stock based on selected size and color
  const maxStock = useMemo(() => {
    if (selectedVariant)
      return Math.max(0, selectedVariant.stock - selectedVariant.reservedStock);
    const filtered = product.variants.filter(
      (v) =>
        (!sizeFilter || v.size === sizeFilter) &&
        (!colorFilter || v.color === colorFilter),
    );
    return filtered.length > 0 ? Math.max(...filtered.map((v) => v.stock)) : 1;
  }, [selectedVariant, product.variants, sizeFilter, colorFilter]);

  useEffect(() => {
    if (maxStock > 0 && quantity > maxStock) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuantity(maxStock);
    } else if (maxStock === 0) {
      setQuantity(1);
    }
  }, [maxStock, quantity]);

  // Global are out of stock
  const isGlobalOutOfStock =
    product.variants.length === 0 ||
    product.variants.every((v) => v.stock === 0);

  // Check if product is archived
  const isArchived = product.isArchived;

  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));

  const isOutOfStock =
    sizeFilter && colorFilter
      ? !selectedVariant || selectedVariant.stock === 0
      : isGlobalOutOfStock;

  // Available sizes for selected color
  const availableSizes = useMemo(() => {
    return product.variants
      .filter((v) => (!colorFilter || v.color === colorFilter) && v.stock > 0)
      .map((v) => v.size);
  }, [product.variants, colorFilter]);

  // Available colors for selected size
  const availableColors = useMemo(() => {
    return product.variants
      .filter((v) => (!sizeFilter || v.size === sizeFilter) && v.stock > 0)
      .map((v) => v.color);
  }, [product.variants, sizeFilter]);

  const handleTypeChange = (type: "size" | "color", value: string) => {
    if (isArchived) return; // Defensive guard

    const params = new URLSearchParams(searchParams.toString());
    const current = type === "size" ? sizeFilter : colorFilter;

    if (current === value) {
      params.delete(type);
    } else {
      params.set(type, value);
    }

    const nextSize =
      type === "size" ? (current === value ? "" : value) : sizeFilter;
    const nextColor =
      type === "color" ? (current === value ? "" : value) : colorFilter;

    const nextVariant = product.variants.find(
      (v) => v.size === nextSize && v.color === nextColor,
    );

    if (nextVariant) {
      const nextAvailableStock = Math.max(
        0,
        nextVariant.stock - nextVariant.reservedStock,
      );
      setQuantity((prev) =>
        Math.min(prev, nextAvailableStock > 0 ? nextAvailableStock : 1),
      );
    }

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (isArchived || maxStock === 0) return;
    if (type === "increment") {
      setQuantity((prev) => (prev < maxStock ? prev + 1 : prev));
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  const getTargetVariant = () => {
    if (selectedVariant) return selectedVariant;

    // Fallback
    return (
      product.variants.find(
        (v) =>
          (!sizeFilter || v.size === sizeFilter) &&
          (!colorFilter || v.color === colorFilter) &&
          v.stock - v.reservedStock > 0,
      ) ||
      product.variants.find((v) => v.stock - v.reservedStock > 0) ||
      product.variants[0]
    );
  };

  const handleAddToCart = async () => {
    if (isArchived) {
      toast.error("This product is archived and cannot be added to the cart.");
      return;
    }

    const variantToUse = getTargetVariant();
    const currentAvailableStock = variantToUse
      ? Math.max(0, variantToUse.stock - variantToUse.reservedStock)
      : 0;

    if (!variantToUse || currentAvailableStock === 0) {
      toast.error("The selected variant is currently out of stock.");
      return;
    }

    if (quantity > currentAvailableStock) {
      toast.error(
        `Cannot add. Only ${currentAvailableStock} items left in stock.`,
      );
      return;
    }

    const result = await addToCart({
      sku: variantToUse.sku,
      quantity,
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
        `${product.title} (${variantToUse.size.toUpperCase()} / ${variantToUse.color}) added to cart!`,
      );
    } else {
      toast.error("Cannot add more than available stock.");
    }
  };

  const handleBuyNow = () => {
    if (isArchived) {
      toast.error("This product is archived and cannot be purchased.");
      return;
    }

    const variantToUse = getTargetVariant();
    if (!variantToUse) return;

    const currentAvailableStock = Math.max(
      0,
      variantToUse.stock - variantToUse.reservedStock,
    );
    if (currentAvailableStock === 0) {
      toast.error("Out of stock!");
      return;
    }

    const checkoutQuantity = Math.min(quantity, currentAvailableStock);

    addToCart({
      sku: variantToUse.sku,
      quantity: checkoutQuantity,
      slug: product.slug,
      productTitle: product.title,
      image: product.images[0],
      color: variantToUse.color,
      size: variantToUse.size,
      price: Number(variantToUse.finalPrice),
      stock: variantToUse.stock,
      discountPercentage: variantToUse.discountPercentage,
    });

    router.push("/checkout");
  };

  // Early return pattern: If all variants are out of stock or archived
  if (isArchived) {
    return (
      <section className="flex flex-col gap-6 mt-4">
        <div className="bg-gray-200 dark:bg-stone-700/50 p-4 rounded-md border border-gray-300 dark:border-stone-600 flex items-center justify-center">
          <span className="font-medium text-stone-600 dark:text-gray-300">
            This product is currently archived
          </span>
        </div>
        <div className="flex flex-col gap-3 mt-2">
          <button
            disabled
            className="w-full py-3 rounded-md bg-gray-300 dark:bg-stone-700 text-stone-500 dark:text-gray-500 cursor-not-allowed transition-all"
          >
            Add to cart
          </button>
          <button
            disabled
            className="w-full py-3 rounded-md bg-gray-300 dark:bg-stone-700 text-stone-500 dark:text-gray-500 cursor-not-allowed transition-all"
          >
            Buy now
          </button>
        </div>
      </section>
    );
  }

  if (isGlobalOutOfStock) {
    return (
      <section className="flex flex-col gap-6 mt-4">
        <div className="bg-gray-200 dark:bg-stone-700/50 p-4 rounded-md border border-gray-300 dark:border-stone-600 flex items-center justify-center">
          <span className="font-medium text-stone-600 dark:text-gray-300">
            This product is currently out of stock
          </span>
        </div>
        <div className="flex flex-col gap-3 mt-2">
          <button
            disabled
            className="w-full py-3 rounded-md bg-gray-300 dark:bg-stone-700 text-stone-500 dark:text-gray-500 cursor-not-allowed transition-all"
          >
            Add to cart
          </button>
          <button
            disabled
            className="w-full py-3 rounded-md bg-gray-300 dark:bg-stone-700 text-stone-500 dark:text-gray-500 cursor-not-allowed transition-all"
          >
            Buy now
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 mt-4">
      {/* Colors */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Color</span>

        <div className="flex items-center gap-2 flex-wrap">
          {colors.map((color) => {
            const disabled = !availableColors.includes(color);
            const isSelected = color === colorFilter;

            return (
              <button
                key={color}
                disabled={disabled}
                onClick={() => handleTypeChange("color", color)}
                className={`
                  px-4 py-2 rounded-md border transition-all duration-200
                  ${
                    isSelected
                      ? "bg-stone-900 text-white dark:bg-gray-100 dark:text-black"
                      : "bg-transparent"
                  }
                  ${
                    disabled
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer hover:opacity-80"
                  }
                `}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Size</span>

        <div className="flex items-center gap-2 flex-wrap">
          {sizes.map((size) => {
            const disabled = !availableSizes.includes(size);
            const isSelected = size === sizeFilter;

            return (
              <button
                key={size}
                disabled={disabled}
                onClick={() => handleTypeChange("size", size)}
                className={`
                  px-4 py-2 rounded-md border transition-all duration-200
                  ${
                    isSelected
                      ? "bg-stone-900 text-white dark:bg-gray-100 dark:text-black"
                      : "bg-transparent"
                  }
                  ${
                    disabled
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer hover:opacity-80"
                  }
                `}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock */}
      <p className="text-sm text-stone-500 dark:text-gray-400">
        {selectedVariant
          ? maxStock > 0
            ? `${maxStock} in stock`
            : "Out of stock"
          : sizeFilter || colorFilter
            ? "Select remaining options to see exact stock"
            : "Select variant options"}
      </p>

      {/* Quantity */}
      <div className="flex items-center">
        <button
          type="button"
          disabled={quantity <= 1 || isOutOfStock}
          onClick={() => handleQuantityChange("decrement")}
          className="w-10 h-10 rounded-l-md border cursor-pointer"
        >
          -
        </button>

        <input
          type="number"
          value={maxStock === 0 ? 0 : quantity}
          disabled={isOutOfStock || maxStock === 0}
          min={1}
          max={maxStock}
          onChange={(e) => {
            let value = parseInt(e.target.value, 10);
            if (isNaN(value) || value < 1) value = 1;
            if (value > maxStock) value = maxStock;
            setQuantity(value);
          }}
          className="w-14 h-10 text-center border bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:margin-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:margin-0 [&::-webkit-inner-spin-button]:appearance-none"
        />

        <button
          type="button"
          onClick={() => handleQuantityChange("increment")}
          disabled={quantity >= maxStock || isOutOfStock}
          className="w-10 h-10 rounded-r-md border disabled:opacity-40 cursor-pointer"
        >
          +
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-2">
        <button
          disabled={isOutOfStock || maxStock === 0}
          onClick={handleAddToCart}
          className="w-full py-3 rounded-md bg-stone-900 text-white dark:bg-gray-100 dark:text-black disabled:opacity-40 cursor-pointer"
        >
          Add to cart
        </button>

        <button
          disabled={isOutOfStock || maxStock === 0}
          onClick={handleBuyNow}
          className="w-full py-3 rounded-md bg-orange-500 text-white disabled:opacity-40 cursor-pointer"
        >
          Buy now
        </button>
      </div>
    </section>
  );
};

export default ProductInteraction;
