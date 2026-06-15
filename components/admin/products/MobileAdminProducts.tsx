import Image from "next/image";
import { useRouter } from "next/navigation";
import type { AdminProductsProps } from "./DesktopAdminProducts";

const MobileAdminProducts = ({
  data,
  handleDelete,
  handleRestore,
  archivedView,
}: AdminProductsProps) => {
  const router = useRouter();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
      {data.data.map((p) => (
        <article
          key={p.id}
          onClick={() => router.push(`/admin/products/${p.slug}`)}
          className="p-4 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-lg flex flex-col gap-4 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
        >
          <section className="flex flex-1 items-start gap-4">
            <figure className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20">
              <Image
                src={p.images[0]}
                alt={p.title}
                fill
                sizes="80px"
                className="object-cover rounded border border-gray-200 dark:border-stone-600 bg-gray-100 dark:bg-stone-700"
              />
              <figcaption className="sr-only">{p.title}</figcaption>
            </figure>

            <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
              <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100 leading-tight">
                {p.title}
              </h3>
              <div className="flex flex-wrap justify-between items-end gap-2 mt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-stone-400 font-mono tracking-wider">
                    {p.category.name}
                  </span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    ${p.basePrice}
                  </span>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 dark:bg-stone-700 dark:text-gray-300 dark:border-stone-600 rounded text-[10px] font-bold uppercase tracking-wider">
                  {p.variants.length} Variants
                </span>
              </div>
            </div>
          </section>

          <section className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-stone-700">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/admin/products/${p.slug}`);
              }}
              className="px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
            >
              Edit
            </button>
            {archivedView ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRestore?.(p.slug);
                }}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"
              >
                Restore
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(p.slug);
                }}
                className="px-3 py-1.5 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
              >
                Archive
              </button>
            )}
          </section>
        </article>
      ))}
    </section>
  );
};

export default MobileAdminProducts;
