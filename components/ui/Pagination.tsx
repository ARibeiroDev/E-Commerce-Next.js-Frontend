"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: PaginationProps) => {
  const getPageNumbers = (): (number | string)[] => {
    // If total pages are a small number, render them sequentially
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    // Always display first page
    pages.push(1);

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Evaluate left gap for ellipsis display
    if (startPage > 2) {
      pages.push("...");
    }

    // Render localized sibling elements within the current page range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Evaluate right gap for ellipsis display
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Always display last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <section className="flex gap-2 justify-center flex-wrap my-4">
      <button
        className={
          hasPreviousPage
            ? "border rounded-lg p-1 sm:p-2 cursor-pointer"
            : "opacity-50 border rounded-lg p-1 sm:p-2"
        }
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
      >
        Previous
      </button>
      {/* Dynamic rendering of page numbers */}
      {pageNumbers.map((page, index) => {
        // Render a structural separator if the current iteration element is an Ellipsis string token
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2 sm:px-4 py-2 font-medium text-sm flex items-center justify-center"
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={`page-${page}`}
            className={
              currentPage === page
                ? "font-bold dark:bg-gray-200 bg-stone-800 dark:text-stone-800 text-gray-200 py-2 px-2 sm:px-4 border rounded-lg cursor-pointer transition-all"
                : "border rounded-lg py-2 px-2 sm:px-4 cursor-pointer"
            }
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </button>
        );
      })}

      <button
        className={
          hasNextPage
            ? "border rounded-lg p-1 sm:p-2 cursor-pointer"
            : "opacity-50 border rounded-lg p-1 sm:p-2"
        }
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
      >
        Next
      </button>
    </section>
  );
};

export default Pagination;
