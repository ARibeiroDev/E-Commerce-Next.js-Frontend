"use client";

import { confirmOrder } from "@/lib/api/orders";
import { Order } from "@/types/order";
import OrderExpirationTimer from "@/components/checkout/OrderExpirationTimer";
import { useState } from "react";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useRouter } from "next/navigation";

type Props = {
  order: Order;
  isExpired: boolean;
  onExpire: () => void;
};

const CheckoutPaymentStep = ({ order, isExpired, onExpire }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const resetCheckout = useCheckoutStore((state) => state.resetCheckout);

  const handleFakePayment = async () => {
    if (loading || isExpired) return;

    setLoading(true);

    try {
      await confirmOrder(order.id, crypto.randomUUID());

      resetCheckout();

      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {order.expiresAt && (
        <OrderExpirationTimer expiresAt={order.expiresAt} onExpire={onExpire} />
      )}

      <div className="border rounded-lg p-6 flex flex-col gap-4">
        <h3 className="text-xl font-semibold">Order Summary</h3>

        {order.items.map((item) => (
          <div key={item.variantSku} className="flex justify-between text-sm">
            <div>
              <p>{item.productName}</p>

              <p className="text-gray-500">
                {item.size} / {item.color}
              </p>

              <p className="text-gray-500">Qty: {item.quantity}</p>
            </div>

            <p>${(Number(item.priceAtPurchase) * item.quantity).toFixed(2)}</p>
          </div>
        ))}

        <hr />

        <div className="flex justify-between font-semibold">
          <p>Total</p>

          <p>${Number(order.total).toFixed(2)}</p>
        </div>
      </div>

      <button
        onClick={handleFakePayment}
        disabled={loading || isExpired}
        className="cursor-pointer bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 text-white p-3 rounded-md transition"
      >
        {loading ? "Processing..." : "Simulate Payment"}
      </button>
    </div>
  );
};

export default CheckoutPaymentStep;
