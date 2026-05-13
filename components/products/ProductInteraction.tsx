"use client";

import { useCartStore } from "@/stores/cartStore";
import { Product } from "@/types/product";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
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
  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor,
  );
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  const maxStock = selectedVariant?.stock || 1;

  const safeQuantity = Math.min(quantity, maxStock);

  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));

  const isOutOfStock = !selectedVariant || selectedVariant.stock === 0;

  // Available sizes for selected color
  const availableSizes = useMemo(() => {
    return product.variants
      .filter((v) => v.color === selectedColor && v.stock > 0)
      .map((v) => v.size);
  }, [product.variants, selectedColor]);

  // Available colors for selected size
  const availableColors = useMemo(() => {
    return product.variants
      .filter((v) => v.size === selectedSize && v.stock > 0)
      .map((v) => v.color);
  }, [product.variants, selectedSize]);

  const handleTypeChange = (type: "size" | "color", value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set(type, value);

    const nextVariant = product.variants.find((v) => {
      const nextSize = type === "size" ? value : selectedSize;

      const nextColor = type === "color" ? value : selectedColor;

      return v.size === nextSize && v.color === nextColor;
    });

    if (nextVariant) {
      setQuantity((prev) => Math.min(prev, nextVariant.stock));
    }

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (!selectedVariant) return;

    if (type === "increment") {
      setQuantity((prev) => (prev < selectedVariant.stock ? prev + 1 : prev));
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(selectedVariant.sku, safeQuantity).then(() => {
        toast.success(`${product.title} added to cart!`);
      });
    }
  };

  return (
    <section className="flex flex-col gap-6 mt-4">
      {/* Colors */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Color</span>

        <div className="flex items-center gap-2 flex-wrap">
          {colors.map((color) => {
            const disabled = !availableColors.includes(color);

            return (
              <button
                key={color}
                disabled={disabled}
                onClick={() => handleTypeChange("color", color)}
                className={`
                  px-4 py-2 rounded-md border transition-all duration-200
                  ${
                    color === selectedColor
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

            return (
              <button
                key={size}
                disabled={disabled}
                onClick={() => handleTypeChange("size", size)}
                className={`
                  px-4 py-2 rounded-md border transition-all duration-200
                  ${
                    size === selectedSize
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
        {selectedVariant?.stock
          ? `${selectedVariant.stock} in stock`
          : "Out of stock"}
      </p>

      {/* Quantity */}
      <div className="flex items-center">
        <button
          onClick={() => handleQuantityChange("decrement")}
          className="w-10 h-10 rounded-l-md border cursor-pointer"
        >
          -
        </button>

        <input
          type="text"
          value={safeQuantity}
          min={1}
          max={selectedVariant?.stock || 1}
          onChange={(e) => {
            if (!selectedVariant) return;

            let value = Number(e.target.value);

            if (isNaN(value)) value = 1;

            value = Math.max(1, value);
            value = Math.min(value, selectedVariant.stock);

            setQuantity(value);
          }}
          className="w-14 h-10 text-center border bg-transparent"
        />

        <button
          onClick={() => handleQuantityChange("increment")}
          disabled={!selectedVariant || quantity >= selectedVariant.stock}
          className="w-10 h-10 rounded-r-md border disabled:opacity-40 cursor-pointer"
        >
          +
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-2">
        <button
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="w-full py-3 rounded-md bg-stone-900 text-white dark:bg-gray-100 dark:text-black disabled:opacity-40 cursor-pointer"
        >
          Add to cart
        </button>

        <button
          disabled={isOutOfStock}
          onClick={() => {
            console.log("Buy now", {
              productId: product.id,
              variantId: selectedVariant?.id,
              quantity: safeQuantity,
            });

            router.push("/checkout");
          }}
          className="w-full py-3 rounded-md bg-orange-500 text-white disabled:opacity-40 cursor-pointer"
        >
          Buy now
        </button>
      </div>
    </section>
  );
};

export default ProductInteraction;
