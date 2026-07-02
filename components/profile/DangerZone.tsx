"use client";

import { useState } from "react";

interface DangerZoneProps {
  username: string;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

export default function DangerZone({
  username,
  onDelete,
  isDeleting,
}: DangerZoneProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = () => {
    if (confirmText === "Delete " + username) {
      onDelete();
    }
  };

  return (
    <section className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-900/50">
      <h2 className="text-lg font-bold text-red-600 dark:text-red-500 mb-2">
        Delete Account
      </h2>
      <p className="text-sm text-red-600 dark:text-red-400 mb-4">
        Once you delete your account, there is no going back.
      </p>

      {!isConfirming ? (
        <button
          onClick={() => setIsConfirming(true)}
          className="w-full bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 transition font-medium cursor-pointer"
        >
          Delete Account
        </button>
      ) : (
        <div className="space-y-3 animate-appear">
          <label className="block text-sm font-medium text-red-700 dark:text-red-300">
            Type &quot;Delete <strong>{username}</strong>&quot; to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full border border-red-300 dark:border-red-800 p-2 rounded-lg outline-none bg-white dark:bg-stone-900 transition"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setIsConfirming(false)}
              disabled={isDeleting}
              className="flex-1 bg-gray-200 dark:bg-stone-800  rounded-lg py-2 hover:bg-stone-500 transition text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={confirmText !== "Delete " + username || isDeleting}
              className="flex-1 bg-red-600 rounded-lg py-2 hover:bg-red-700 disabled:opacity-50 transition text-sm font-medium cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Confirm"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
