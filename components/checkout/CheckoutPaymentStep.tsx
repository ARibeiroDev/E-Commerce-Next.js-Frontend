"use client";

import { confirmOrder } from "@/lib/api/orders";
import { Order } from "@/types/order";
import OrderExpirationTimer from "@/components/checkout/OrderExpirationTimer";
import { useState } from "react";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useForm } from "react-hook-form";
import {
  PaymentFormInputs,
  paymentFormSchema,
} from "@/types/validations/paymentForm";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  order: Order;
  isExpired: boolean;
  onExpire: () => void;
};

const CheckoutPaymentStep = ({ order, isExpired, onExpire }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const resetCheckout = useCheckoutStore((state) => state.resetCheckout);

  const resetCart = useCartStore((state) => state.resetCart);

  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormInputs>({
    resolver: zodResolver(paymentFormSchema),
  });

  const handleFakePayment = async () => {
    if (loading || isExpired) return;

    clearErrors();
    setLoading(true);

    try {
      await confirmOrder(order.id, crypto.randomUUID());

      resetCart();

      resetCheckout();

      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error: unknown) {
      setError("root", {
        message: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const orderItemsSubtotal = order.items.reduce(
    (acc, item) => acc + Number(item.priceAtPurchase) * item.quantity,
    0,
  );
  const shippingFee = Number(order.total) - orderItemsSubtotal;

  return (
    <section className="flex flex-col gap-6">
      {order.expiresAt && (
        <OrderExpirationTimer expiresAt={order.expiresAt} onExpire={onExpire} />
      )}

      <div className="border rounded-lg p-6 flex flex-col gap-4 bg-gray-50 dark:bg-stone-900/50">
        <h3 className="text-xl font-semibold">Payment Finalization</h3>
        <div className="flex justify-between font-medium">
          <p>Subtotal</p>
          <p>${orderItemsSubtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between font-medium">
          <p>Shipping</p>
          <p>{shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}</p>
        </div>
        <hr className="border-gray-200 dark:border-stone-700" />
        <div className="flex justify-between font-bold text-lg">
          <p>Total to Pay</p>
          <p>${Number(order.total).toFixed(2)}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handleFakePayment)}
        className="flex flex-col gap-4"
      >
        <div>
          <label className="text-sm font-medium mb-1 block">Name on Card</label>
          <input
            type="text"
            placeholder="John Doe"
            disabled={loading || isExpired}
            {...register("cardholderName")}
            className="w-full border border-gray-300 dark:border-stone-700 p-3 rounded-md bg-transparent"
          />
          {errors.cardholderName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.cardholderName.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="text-sm font-medium mb-1 block"
            htmlFor="cardNumber"
          >
            Card Number
          </label>
          <input
            id="cardNumber"
            type="text"
            placeholder="XXXX XXXX XXXX XXXX"
            disabled={loading || isExpired}
            {...register("cardNumber")}
            className="w-full border border-gray-300 dark:border-stone-700 p-3 rounded-md bg-transparent"
          />
          {errors.cardNumber && (
            <p className="text-sm text-red-500 mt-1">
              {errors.cardNumber.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="text-sm font-medium mb-1 block"
              htmlFor="expiryDate"
            >
              Expiry Date
            </label>
            <input
              id="expiryDate"
              type="text"
              placeholder="MM/YY"
              disabled={loading || isExpired}
              {...register("expiryDate")}
              className="w-full border border-gray-300 dark:border-stone-700 p-3 rounded-md bg-transparent"
            />
            {errors.expiryDate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.expiryDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block" htmlFor="cvv">
              CVV
            </label>
            <input
              id="cvv"
              type="text"
              placeholder="123"
              disabled={loading || isExpired}
              {...register("cvv")}
              className="w-full border border-gray-300 dark:border-stone-700 p-3 rounded-md bg-transparent"
            />
            {errors.cvv && (
              <p className="text-sm text-red-500 mt-1">{errors.cvv.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || isExpired}
          className="mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium p-3 rounded-md transition cursor-pointer"
        >
          {loading
            ? "Processing Payment..."
            : `Pay $${Number(order.total).toFixed(2)}`}
        </button>
      </form>
    </section>
  );
};

export default CheckoutPaymentStep;
