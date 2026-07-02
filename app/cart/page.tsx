"use client";

import CartItemCard from "@/components/cart/CartItemCard";
import useCart from "@/hooks/useCart";
import Link from "next/link";

const CartPage = () => {
  const { items, clearCart, updateCartItem, removeCartItem } = useCart();

  if (items.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center min-h-[50vh] p-6 animate-appear">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
          Your cart is empty
        </h2>
        <p className="text-center text-stone-600 dark:text-stone-400 mb-6">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/shop"
          className="bg-stone-900 border border-stone-900 dark:border-gray-100 text-gray-100 dark:bg-gray-100 dark:text-stone-900 px-6 py-3 rounded-lg font-medium hover:bg-transparent hover:text-stone-900 hover:dark:text-gray-100 transition-all duration-200"
        >
          Start Shopping
        </Link>
      </main>
    );
  }

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.finalPrice) * item.quantity;
  }, 0);

  return (
    <main className="flex-1 max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>

      <ul className="flex flex-col gap-2 mb-4">
        {items.map((item) => (
          <li
            key={item.sku}
            className="flex-1 flex flex-col gap-4 sm:flex-row items-start sm:items-center justify-between border border-gray-300 dark:border-stone-700 shadow-xs rounded-lg"
          >
            <CartItemCard
              item={item}
              onUpdate={updateCartItem}
              onRemove={removeCartItem}
            />
          </li>
        ))}
      </ul>

      <footer className="pt-4 border-t border-gray-200 dark:border-stone-700 flex flex-col gap-4 sm:flex-row sm:gap-0 justify-between items-start sm:items-center">
        <span className="text-xl font-semibold">
          Total: ${totalPrice.toFixed(2)}
        </span>
        <button
          onClick={clearCart}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto"
        >
          Clear Cart
        </button>

        <Link
          href="/checkout"
          className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded hover:opacity-90 transition w-full sm:w-auto text-center"
        >
          Proceed to Checkout
        </Link>
      </footer>
    </main>
  );
};

export default CartPage;
