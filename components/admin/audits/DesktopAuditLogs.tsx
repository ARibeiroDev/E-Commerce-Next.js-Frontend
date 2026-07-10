import { getActionStyles } from "@/utils/getActionStyles";
import { AuditLogListProps } from "./MobileAuditLogs";
import { SearchCode } from "lucide-react";

const DesktopAuditLogs = ({ logs, onSelect }: AuditLogListProps) => {
  return (
    <section className="hidden xl:block bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-lg overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-gray-50 dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold">
              Timestamp
            </th>
            <th scope="col" className="px-6 py-4 font-semibold">
              Action Event
            </th>
            <th scope="col" className="px-6 py-4 font-semibold">
              Actor
            </th>
            <th scope="col" className="px-6 py-4 font-semibold">
              Resource Space
            </th>
            <th scope="col" className="px-6 py-4 font-semibold text-right">
              Context
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-stone-700">
          {logs.map((log) => {
            const dateObj = new Date(log.createdAt);

            return (
              <tr
                key={log.id}
                className="hover:bg-gray-50 dark:hover:bg-stone-800/80 transition-colors"
              >
                <td className="px-6 py-4 text-stone-500 dark:text-stone-400 font-mono text-xs">
                  <time dateTime={dateObj.toISOString()}>
                    {dateObj.toLocaleString()}
                  </time>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider border ${getActionStyles(
                      log.action,
                    )}`}
                  >
                    {log.action}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {log.actor ? (
                    <span className="font-semibold">{log.actor.username}</span>
                  ) : (
                    <span className="text-xs italic text-stone-500">
                      System Automation Process
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-stone-500">
                      {log.targetId}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                      {log.targetType}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onSelect(log)}
                    aria-label={`Inspect details for log ${log.id}`}
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1 justify-end w-full cursor-pointer"
                  >
                    <SearchCode aria-hidden="true" />
                    Inspect
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default DesktopAuditLogs;
