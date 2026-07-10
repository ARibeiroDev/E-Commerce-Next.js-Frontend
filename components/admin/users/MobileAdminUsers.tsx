import { RoleBadge, StatusBadge } from "@/components/ui/RoleBadge";
import { AuthUserDto, PrivateUserDto } from "@/types/user";
import Link from "next/link";

export type AdminUsersProps = {
  filteredUsers: PrivateUserDto[];
  currentUser: AuthUserDto | null;
  handleDeactivate: (id: string, username: string) => void;
};

const MobileAdminUsers = ({
  filteredUsers,
  currentUser,
  handleDeactivate,
}: AdminUsersProps) => {
  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden"
      aria-label="User Profile Cards"
    >
      {filteredUsers.map((u) => {
        const isMe = currentUser?.id === u.id;
        const canDelete =
          currentUser?.role === "SUPERADMIN" ||
          (currentUser?.role === "ADMIN" && u.role !== "SUPERADMIN");

        return (
          <article
            key={u.id}
            className="p-4 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-lg flex flex-col gap-3 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <h3 className="font-bold text-lg">{u.username}</h3>

                <span className="text-[10px] text-stone-400 font-mono mt-1">
                  ID: {u.id.split("-")[0]}...
                </span>
              </div>
              <RoleBadge role={u.role} />
            </div>

            <div className="flex gap-2 text-xs">
              <StatusBadge isActive={u.isActive} isVerified={u.isVerified} />
            </div>

            <div className="mt-2 pt-3 border-t border-gray-100 dark:border-stone-700 flex justify-end gap-2">
              <Link
                href={`/admin/users/${u.id}`}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                Edit
              </Link>
              <button
                disabled={!canDelete || isMe || !u.isActive}
                onClick={() => handleDeactivate(u.id, u.username)}
                className="px-3 cursor-pointer py-1.5 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {u.isActive ? "Deactivate" : "Banned"}
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default MobileAdminUsers;
