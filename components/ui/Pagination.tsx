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

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={
            currentPage === i + 1
              ? "font-bold dark:bg-gray-200 bg-stone-800 dark:text-stone-800 text-gray-200 py-2 px-2 sm:px-4 border rounded-lg cursor-pointer"
              : "border rounded-lg py-2 px-2 sm:px-4 cursor-pointer"
          }
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}

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
