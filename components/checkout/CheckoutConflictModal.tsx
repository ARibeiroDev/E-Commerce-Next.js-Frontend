import { StockConflict } from "@/utils/extractConflictError";
import { useEffect, useRef } from "react";

type CheckoutConflictModalProps = {
  conflictData: StockConflict;
  handleAdjustAndContinue: () => void;
  handleReturnToCart: () => void;
};

const CheckoutConflictModal = ({
  conflictData,
  handleAdjustAndContinue,
  handleReturnToCart,
}: CheckoutConflictModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="modal-title"
      className="backdrop:bg-black/60 backdrop:backdrop-blur-sm bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 w-full max-w-md m-auto open:flex flex-col animate-appear"
    >
      <header className="flex flex-col gap-3">
        <h3
          className="text-lg font-bold text-stone-900 dark:text-white"
          id="modal-title"
        >
          Stock Availability Changed
        </h3>
        {conflictData.availableStock > 0 ? (
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            The item you are trying to purchase has limited stock availability.
            The item&apos;s SKU{" "}
            <span className="font-mono font-bold text-stone-900 dark:text-white">
              {conflictData.sku}
            </span>{" "}
            now only has
            <span className="font-bold text-orange-500">
              {" "}
              {conflictData.availableStock} units
            </span>{" "}
            left.
          </p>
        ) : (
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            The item you are trying to purchase is currently out of stock.
          </p>
        )}
      </header>

      <section className="mt-6 flex flex-col gap-3">
        {conflictData.availableStock > 0 ? (
          <button
            onClick={handleAdjustAndContinue}
            className="w-full rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-white hover:bg-stone-800 transition-colors dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200"
          >
            Adjust cart to {conflictData.availableStock} units & try again
          </button>
        ) : (
          <button
            onClick={handleAdjustAndContinue}
            className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Remove out of stock item from cart
          </button>
        )}

        <button
          onClick={handleReturnToCart}
          className="w-full rounded-lg bg-stone-100 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-200 transition-colors dark:bg-stone-800 dark:text-gray-300 dark:hover:bg-stone-700"
        >
          Cancel and return to cart
        </button>
      </section>
    </dialog>
  );
};

export default CheckoutConflictModal;
