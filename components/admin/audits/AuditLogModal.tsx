"use client";

import { useEffect } from "react";
import type { AuditLog } from "@/lib/api/auditLog";
import { X } from "lucide-react";

type AuditLogModalProps = {
  log: AuditLog;
  onClose: () => void;
};

const AuditLogModal = ({ log, onClose }: AuditLogModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const isCreate = !log.oldValues && !!log.newValues;
  const isDelete = !!log.oldValues && !log.newValues;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity"
      onClick={onClose}
      aria-hidden="true"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white dark:bg-stone-800 rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-gray-200 dark:border-stone-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700 flex justify-between items-center">
          <div className="flex flex-col">
            <h3
              id="modal-title"
              className="text-lg font-bold text-stone-900 dark:text-white"
            >
              Log Inspector:{" "}
              <span className="font-mono text-stone-500 dark:text-stone-400 text-sm ml-2">
                {log.id}
              </span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 uppercase tracking-wider font-mono">
              Timestamp: {new Date(log.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-stone-800 rounded-full transition-colors text-stone-500 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Body */}
        <article className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-stone-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-2 text-stone-500 dark:text-stone-400">
                Pre-Action State Snapshot
              </h4>
              <div className="bg-gray-50 dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-3 sm:p-4 overflow-x-auto max-h-80 font-mono text-xs text-stone-700 dark:text-gray-300 shadow-inner">
                {log.oldValues ? (
                  <pre>{JSON.stringify(log.oldValues, null, 2)}</pre>
                ) : (
                  <span className="italic text-stone-400">
                    {isCreate
                      ? "No historical state available (New Entity)"
                      : "No historical state available"}
                  </span>
                )}
              </div>
            </section>

            <section>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-2 text-stone-500 dark:text-stone-400">
                Mutated State Snapshot
              </h4>
              <div className="bg-gray-50 dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-3 sm:p-4 overflow-x-auto max-h-80 font-mono text-xs text-stone-700 dark:text-gray-300 shadow-inner">
                {log.newValues ? (
                  <pre>{JSON.stringify(log.newValues, null, 2)}</pre>
                ) : (
                  <span className="italic text-stone-400">
                    {isDelete
                      ? "No resulting state available (Entity Deleted)"
                      : "No resulting state available"}
                  </span>
                )}
              </div>
            </section>
          </div>
        </article>

        {/* Footer */}
        <footer className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-stone-900 border-t border-gray-200 dark:border-stone-700 flex justify-end">
          <button
            onClick={onClose}
            className="w-full cursor-pointer sm:w-auto px-6 py-2 bg-white dark:bg-stone-800 border border-gray-300 dark:border-stone-600 text-sm font-medium rounded-md text-stone-700 dark:text-stone-200 hover:bg-gray-50 dark:hover:bg-stone-700 transition-colors shadow-sm"
          >
            Close Inspector
          </button>
        </footer>
      </section>
    </div>
  );
};

export default AuditLogModal;
