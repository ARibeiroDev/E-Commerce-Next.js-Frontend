interface KpiCardProps {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
}

export const KpiCard = ({ title, icon, iconBg, children }: KpiCardProps) => {
  return (
    <article className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col justify-between min-h-35">
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-sm font-medium text-stone-500 dark:text-stone-400">
          {title}
        </h3>
        <div className={`p-2 rounded-lg shrink-0 ${iconBg}`}>{icon}</div>
      </div>
      <div className="mt-2 flex-1 flex flex-col justify-end">{children}</div>
    </article>
  );
};
