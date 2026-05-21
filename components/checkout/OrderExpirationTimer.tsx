"use client";

import { useEffect, useState } from "react";

type Props = {
  expiresAt: string;
  onExpire?: () => void;
};

const OrderExpirationTimer = ({ expiresAt, onExpire }: Props) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const checkExpiration = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();

      if (diff <= 0) {
        setExpired(true);
        setTimeLeft(null);
        if (onExpire) onExpire();
        return true;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      return false;
    };

    // Check immediately on mount
    if (checkExpiration()) return;

    const interval = setInterval(() => {
      if (checkExpiration()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  return (
    <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 p-3 rounded-md text-sm">
      {expired ? (
        <span>Your order has expired</span>
      ) : (
        <span>
          Your order is reserved for{" "}
          <span className="font-semibold">{timeLeft}</span>
        </span>
      )}
    </div>
  );
};

export default OrderExpirationTimer;
