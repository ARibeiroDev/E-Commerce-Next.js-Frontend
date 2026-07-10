"use client";

import { useEffect, useRef } from "react";
import type { AuditLog } from "@/lib/api/auditLog";
import { X } from "lucide-react";

type AuditLogModalProps = {
  log: AuditLog;
  onClose: () => void;
};

const AuditLogModal = ({ log, onClose }: AuditLogModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Automatically open the modal
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  // Handle click outside the modal to close it
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  const handleClose = () => {
    dialogRef.current?.close();
    onClose();
  };

  const isCreate = !log.oldValues && !!log.newValues;
  const isDelete = !!log.oldValues && !log.newValues;
  const dateObj = new Date(log.createdAt);

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
      className="backdrop:bg-black/60 backdrop:backdrop-blur-sm bg-gray-100 dark:bg-stone-900 rounded-2xl p-6 md:p-8 max-w-5xl w-full shadow-2xl border border-gray-200 dark:border-stone-700 m-auto open:flex flex-col text-stone-900 dark:text-gray-100"
    >
      <header className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-stone-900  flex justify-between items-center">
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
            Timestamp:{" "}
            <time dateTime={dateObj.toISOString()}>
              {dateObj.toLocaleString()}
            </time>
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

      <article className="flex-1 overflow-y-auto p-4 rounded-2xl sm:p-6 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-2 text-stone-500 dark:text-stone-400">
              Pre-Action State Snapshot
            </h4>
            <div className="bg-gray-50 dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-3 sm:p-4 overflow-x-auto max-h-80 font-mono text-xs text-stone-700 dark:text-gray-300 shadow-inner">
              {log.oldValues ? (
                <pre className="whitespace-pre-wrap wrap-break-word">
                  {JSON.stringify(log.oldValues, null, 2)}
                </pre>
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
                <pre className="whitespace-pre-wrap wrap-break-word">
                  {JSON.stringify(log.newValues, null, 2)}
                </pre>
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

      <footer className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-stone-900  flex justify-end">
        <button
          onClick={onClose}
          className="w-full cursor-pointer sm:w-auto px-6 py-2 bg-white dark:bg-stone-800 border border-gray-300 dark:border-stone-600 text-sm font-medium rounded-md text-stone-700 dark:text-stone-200 hover:bg-gray-50 dark:hover:bg-stone-700 transition-colors shadow-sm"
        >
          Close Inspector
        </button>
      </footer>
    </dialog>
  );
};

export default AuditLogModal;
