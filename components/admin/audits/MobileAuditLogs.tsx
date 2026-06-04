import { AuditLog } from "@/lib/api/auditLog";
import { getActionStyles } from "@/utils/getActionStyles";

export type AuditLogListProps = {
  logs: AuditLog[];
  onSelect: (log: AuditLog) => void;
};

const MobileAuditLogs = ({ logs, onSelect }: AuditLogListProps) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
      {logs.map((log) => (
        <article
          key={log.id}
          onClick={() => onSelect(log)}
          className="p-4 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-lg flex flex-col gap-3 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
        >
          <section className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-stone-400 font-mono uppercase tracking-wider">
                Timestamp
              </span>
              <span className="text-sm font-mono text-stone-600 dark:text-stone-300">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
            <span
              className={`inline-flex items-center rounded p-1 text-[10px] font-bold uppercase tracking-wider border ${getActionStyles(
                log.action,
              )}`}
            >
              {log.action}
            </span>
          </section>

          <section className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-stone-400 font-mono uppercase tracking-wider">
                Actor
              </span>
              {log.actor ? (
                <span className="font-semibold text-sm">
                  {log.actor.username}
                </span>
              ) : (
                <span className="text-sm italic text-stone-500">System</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-stone-400 font-mono uppercase tracking-wider">
                Target
              </span>
              <span className="font-semibold text-[12px]">
                {log.targetType}
              </span>
            </div>
          </section>

          <section className="mt-2 pt-3 border-t border-gray-100 dark:border-stone-700 flex justify-between items-center">
            <span className="font-mono text-sm text-stone-400 truncate max-w-[60%]">
              ID: {log.targetId}
            </span>
            <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer">
              Inspect
            </button>
          </section>
        </article>
      ))}
    </section>
  );
};

export default MobileAuditLogs;
