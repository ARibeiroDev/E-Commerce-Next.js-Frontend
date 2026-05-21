"use client";

import useCart from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";

const CheckoutReviewStep = () => {
  const { items } = useCart();

  return (
    <div className="flex flex-col gap-6">
      {items.map((item) => (
        <div
          key={item.sku}
          className="flex flex-col sm:flex-row gap-4 border-b border-gray-300 dark:border-stone-700 pb-6"
        >
          <Link href={`/shop/${item.slug}`}>
            <Image
              src={item.image}
              alt={item.title}
              width={120}
              height={120}
              className="rounded-lg object-cover aspect-square"
            />
          </Link>

          <div className="flex-1 flex flex-col gap-2">
            <h3 className="font-semibold text-lg">{item.title}</h3>

            <p className="text-sm text-gray-500">Size: {item.size}</p>

            <p className="text-sm text-gray-500">Color: {item.color}</p>

            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>

            <div className="mt-auto">
              <p className="font-semibold">
                ${(item.finalPrice * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CheckoutReviewStep;
