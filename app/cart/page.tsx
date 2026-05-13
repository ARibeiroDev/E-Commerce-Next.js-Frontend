"use client";

import { useCartStore } from "@/stores/cartStore";
import { Trash } from "lucide-react";
import Image from "next/image";

const CartPage = () => {
  const cart = useCartStore((state) => state.cart);
  const loading = useCartStore((state) => state.loading);
  const updateCartItem = useCartStore((state) => state.updateCartItem);
  const removeCartItem = useCartStore((state) => state.removeCartItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const items = cart?.items || [];

  if (loading)
    // TODO: Replace by cartSkeleton later
    return (
      <p className="flex-1 text-center mt-10 animate-pulse">Loading cart...</p>
    );

  if (items.length === 0)
    return <p className="flex-1 text-center mt-10">Your cart is empty.</p>;

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.productVariant.finalPrice) * item.quantity;
  }, 0);

  return (
    <main className="flex-1 max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>

      <ul className="flex flex-col gap-4">
        {items.map((item) => {
          const finalPrice = Number(item.productVariant.finalPrice);
          return (
            <li
              key={item.id}
              className="flex-1 flex flex-col gap-4 sm:flex-row items-start sm:items-center justify-between bg-gray-200 dark:bg-stone-800 shadow rounded-lg p-4"
            >
              <Image
                src={item.productVariant.product.images[0]}
                alt="Product"
                width={100}
                height={100}
                className="object-cover rounded aspect-square self-center"
              />
              <div className="flex-1 flex flex-col gap-1">
                <h3 className="text-lg font-semibold">
                  {item.productVariant.product.title}
                </h3>
                <p>
                  Price: ${finalPrice.toFixed(2)}
                  {item.productVariant.discountPercentage &&
                    item.productVariant.discountPercentage > 0 && (
                      <span className="ml-2 text-green-600">
                        {item.productVariant.discountPercentage}% off
                      </span>
                    )}
                </p>
                <p className="text-sm">Size: {item.productVariant.size}</p>
                <p className="text-sm">Color: {item.productVariant.color}</p>
              </div>

              <div className="w-full sm:w-auto flex justify-between gap-4 mt-3 sm:mt-0">
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      updateCartItem(item.productVariant.sku, item.quantity - 1)
                    }
                    className="w-8 h-8 rounded-l-md border disabled:opacity-40 cursor-pointer"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-14 h-8 text-center border bg-transparent flex items-center justify-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateCartItem(item.productVariant.sku, item.quantity + 1)
                    }
                    className="w-8 h-8 rounded-r-md border disabled:opacity-40 cursor-pointer"
                    disabled={item.quantity >= item.productVariant.stock}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeCartItem(item.productVariant.sku)}
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
      </section>
    </main>
  );
};

export default CartPage;
