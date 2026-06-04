export const RoleBadge = ({ role }: { role: string }) => {
  const styles =
    role === "SUPERADMIN"
      ? "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
      : role === "ADMIN"
        ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
        : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-stone-700 dark:text-gray-300 dark:border-stone-600";

  return (
    <span
      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${styles}`}
    >
      {role}
    </span>
  );
};

export const StatusBadge = ({
  isActive,
  isVerified,
}: {
  isActive: boolean;
  isVerified: boolean;
}) => {
  if (!isActive) {
    return (
      <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-md text-xs font-semibold">
        Banned / Inactive
      </span>
    );
  }
  if (!isVerified) {
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-md text-xs font-semibold">
        Awaiting Verification
      </span>
    );
  }
  return (
    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-md text-xs font-semibold">
      Active
    </span>
  );
};
