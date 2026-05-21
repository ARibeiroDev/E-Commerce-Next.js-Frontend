"use client";

import useCart from "@/hooks/useCart";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CartPage = () => {
  const { items, clearCart, updateCartItem, removeCartItem } = useCart();

  if (items.length === 0)
    return <p className="flex-1 text-center mt-10">Your cart is empty.</p>;

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.finalPrice) * item.quantity;
  }, 0);

  return (
    <main className="flex-1 max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>

      <ul className="flex flex-col gap-4">
        {items.map((item) => {
          const finalPrice = Number(item.finalPrice);
          return (
            <li
              key={item.sku}
              className="flex-1 flex flex-col gap-4 sm:flex-row items-start sm:items-center justify-between bg-gray-200 dark:bg-stone-800 shadow rounded-lg p-4"
            >
              <Link href={`/shop/${item.slug}`}>
                <Image
                  src={item.image}
                  alt="Product"
                  width={100}
                  height={100}
                  className="object-cover rounded aspect-square self-center"
                />
              </Link>
              <div className="flex-1 flex flex-col gap-1">
                <h3 className="text-lg font-semibold">{item.title}</h3>

                <p>
                  Price: ${finalPrice.toFixed(2)}
                  {item.discountPercentage && item.discountPercentage > 0 && (
                    <span className="ml-2 text-green-600">
                      {item.discountPercentage}% off
                    </span>
                  )}
                </p>
                <p className="text-sm">Size: {item.size}</p>
                <p className="text-sm">Color: {item.color}</p>
              </div>

              <div className="w-full sm:w-auto flex justify-between gap-4 mt-3 sm:mt-0">
                <div className="flex items-center">
                  <button
                    onClick={() => updateCartItem(item.sku, item.quantity - 1)}
                    className="w-8 h-8 rounded-l-md border disabled:opacity-40 cursor-pointer"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-14 h-8 text-center border bg-transparent flex items-center justify-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartItem(item.sku, item.quantity + 1)}
                    className="w-8 h-8 rounded-r-md border disabled:opacity-40 cursor-pointer"
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeCartItem(item.sku)}
                  className="p-2 bg-red-500 text-white hover:bg-red-600 rounded-md cursor-pointer"
                >
                  <Trash />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <section className="mt-6 flex justify-between items-center">
        <span className="text-xl font-semibold">
          Total: ${totalPrice.toFixed(2)}
        </span>
        <button
          onClick={clearCart}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Cart
        </button>

        <Link
          href="/checkout"
          className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded hover:opacity-90 transition"
        >
          Proceed to Checkout
        </Link>
      </section>
    </main>
  );
};

export default CartPage;
