"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash } from "lucide-react";
import { CartUIItem } from "@/types/uiCart";

interface CartItemCardProps {
  item: CartUIItem;
  onUpdate: (sku: string, qty: number) => void;
  onRemove: (sku: string) => void;
}

export default function CartItemCard({
  item,
  onUpdate,
  onRemove,
}: CartItemCardProps) {
  const finalPrice = Number(item.finalPrice);

  return (
    <article className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-stone-900  rounded-lg p-4 gap-4">
      <figure className="flex items-center gap-4 m-0">
        <Link
          href={`/shop/${item.slug}`}
          className="shrink-0 focus:outline-none focus:ring-2 focus:ring-stone-500 rounded-md"
        >
          <Image
            src={item.image}
            alt={`Image of ${item.title}`}
            width={100}
            height={100}
            priority
            className="object-cover rounded-lg aspect-square bg-gray-100 dark:bg-stone-800"
          />
        </Link>
        <figcaption className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-white line-clamp-2">
            <Link
              href={`/shop/${item.slug}`}
              className="hover:underline focus:outline-none rounded-sm"
            >
              {item.title}
            </Link>
          </h3>
          <div className="flex items-center flex-wrap gap-2 text-sm text-stone-600 dark:text-stone-400">
            <span className="font-medium text-stone-900 dark:text-gray-200">
              ${finalPrice.toFixed(2)}
            </span>
            {item.discountPercentage && item.discountPercentage > 0 && (
              <span className="text-green-700 dark:text-green-500 font-medium bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-xs">
                {item.discountPercentage}% OFF
              </span>
            )}
          </div>
          <div className="text-sm text-stone-500 dark:text-stone-400 mt-1 space-x-2">
            <span>
              Size:{" "}
              <strong className="font-medium text-stone-700 dark:text-stone-300">
                {item.size}
              </strong>
            </span>
            <br />
            <span>
              Color:{" "}
              <strong className="font-medium text-stone-700 dark:text-stone-300">
                {item.color}
              </strong>
            </span>
          </div>
        </figcaption>
      </figure>

      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 mt-2 sm:mt-0">
        <div className="flex items-center border border-gray-300 dark:border-stone-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-stone-800 h-10">
          <button
            onClick={() => onUpdate(item.sku, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label={`Decrease quantity of ${item.title}`}
            className="cursor-pointer w-10 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-stone-700 dark:text-stone-300 focus:outline-none focus:bg-gray-200 dark:focus:bg-stone-700"
          >
            −
          </button>

          <span className="w-12 h-full text-center flex items-center justify-center font-medium text-stone-900 dark:text-white bg-white dark:bg-stone-900 border-x border-gray-300 dark:border-stone-700 text-sm">
            {item.quantity}
          </span>

          <button
            onClick={() => onUpdate(item.sku, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            aria-label={`Increase quantity of ${item.title}`}
            className="cursor-pointer w-10 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-stone-700 dark:text-stone-300 focus:outline-none focus:bg-gray-200 dark:focus:bg-stone-700"
          >
            +
          </button>
        </div>

        <button
          onClick={() => onRemove(item.sku)}
          aria-label={`Remove ${item.title} from cart`}
          className="p-2.5 text-red-600 hover:text-red-700 dark:text-red-400  rounded-lg transition-colors cursor-pointer"
        >
          <Trash size={20} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
