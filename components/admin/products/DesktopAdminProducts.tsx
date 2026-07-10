import { PaginatedResponse } from "@/types/pagination";
import { Product } from "@/types/product";
import { ArchiveRestore, Pen, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type AdminProductsProps = {
  data: PaginatedResponse<Product[]>;
  handleDelete: (slug: string) => void;
  handleRestore: (slug: string) => void;
  archivedView: boolean;
};

const DesktopAdminProducts = ({
  data,
  handleDelete,
  handleRestore,
  archivedView,
}: AdminProductsProps) => {
  return (
    <section className="hidden xl:block bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-lg overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-gray-50 dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold">
              Product
            </th>
            <th scope="col" className="px-6 py-4 font-semibold">
              Category
            </th>
            <th scope="col" className="px-6 py-4 font-semibold">
              Price
            </th>
            <th scope="col" className="px-6 py-4 font-semibold">
              Variants
            </th>
            <th scope="col" className="px-6 py-4 font-semibold text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-stone-700">
          {data.data.map((p) => (
            <tr
              key={p.id}
              className="hover:bg-gray-50 dark:hover:bg-stone-800/80 transition-colors group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <figure className="relative w-10 h-10 shrink-0">
                    <Image
                      src={p.images[0]}
                      alt={p.title}
                      fill
                      sizes="40px"
                      className="object-cover rounded bg-gray-100 dark:bg-stone-700 border border-gray-200 dark:border-stone-600"
                    />
                  </figure>
                  <Link
                    className="font-bold truncate max-w-xs"
                    href={`/admin/products/${p.slug}`}
                  >
                    {p.title}
                  </Link>
                </div>
              </td>
              <td className="px-6 py-4 text-stone-600 dark:text-stone-400">
                {p.category.name}
              </td>
              <td className="px-6 py-4 font-semibold text-stone-900 dark:text-stone-100">
                ${p.basePrice}
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 dark:bg-stone-700 dark:text-gray-300 dark:border-stone-600 rounded text-[10px] font-bold uppercase tracking-wider">
                  {p.variants.length}{" "}
                  {p.variants.length === 1 ? "Variant" : "Variants"}
                </span>
              </td>

              <td className="px-6 py-4">
                <div
                  className="flex justify-end items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    href={`/admin/products/${p.slug}`}
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
                    aria-label={`Edit ${p.title}`}
                  >
                    <Pen size={16} aria-hidden="true" />
                    Edit
                  </Link>
                  {archivedView ? (
                    <button
                      onClick={() => handleRestore?.(p.slug)}
                      className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ArchiveRestore size={16} aria-hidden="true" /> Restore
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(p.slug)}
                      className="text-red-600 dark:text-red-400 font-medium hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash size={16} aria-hidden="true" /> Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default DesktopAdminProducts;
