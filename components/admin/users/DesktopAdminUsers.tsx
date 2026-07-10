import { RoleBadge, StatusBadge } from "@/components/ui/RoleBadge";
import Link from "next/link";
import { AdminUsersProps } from "./MobileAdminUsers";
import { Pen, Trash } from "lucide-react";

const DesktopAdminUsers = ({
  filteredUsers,
  currentUser,
  handleDeactivate,
}: AdminUsersProps) => {
  return (
    <div className="hidden xl:block bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-lg overflow-hidden shadow-sm">
      <table
        className="w-full text-left text-sm whitespace-nowrap"
        aria-label="System users table"
      >
        <thead className="bg-gray-50 dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold">
              User
            </th>
            <th scope="col" className="px-6 py-4 font-semibold">
              Role
            </th>
            <th scope="col" className="px-6 py-4 font-semibold">
              Status
            </th>
            <th scope="col" className="px-6 py-4 font-semibold text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-stone-700">
          {filteredUsers.map((u) => {
            const isMe = currentUser?.id === u.id;
            const canDelete =
              currentUser?.role === "SUPERADMIN" ||
              (currentUser?.role === "ADMIN" && u.role !== "SUPERADMIN");

            return (
              <tr
                key={u.id}
                className="hover:bg-gray-50 dark:hover:bg-stone-800/80 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold">{u.username}</span>
                    <span className="text-[10px] text-stone-400 font-mono mt-0.5">
                      ID: {u.id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <RoleBadge role={u.role} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge
                    isActive={u.isActive}
                    isVerified={u.isVerified}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline flex items-center gap-1"
                    >
                      <Pen size={16} />
                      Edit
                    </Link>
                    <button
                      disabled={!canDelete || isMe || !u.isActive}
                      onClick={() => handleDeactivate(u.id, u.username)}
                      className="text-red-600 dark:text-red-400 font-medium cursor-pointer hover:underline disabled:opacity-30 disabled:cursor-not-allowed disabled:no-underline flex items-center gap-1"
                    >
                      <Trash size={16} />
                      {u.isActive ? "Deactivate" : "Banned"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DesktopAdminUsers;
