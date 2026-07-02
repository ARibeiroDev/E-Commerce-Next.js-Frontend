const ProductCardSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="relative bg-gray-200 dark:bg-stone-800 p-2 rounded-lg flex flex-col motion-safe:animate-pulse"
    >
      <div className="w-full aspect-square bg-gray-300 dark:bg-stone-700 rounded-lg" />
      <div className="h-6 bg-gray-300 dark:bg-stone-700 rounded mt-2 w-3/4" />
      <div className="h-5 bg-gray-300 dark:bg-stone-700 rounded mt-1 w-1/2" />
      <div className="flex items-center gap-2 mt-2">
        <div className="h-6 w-12 bg-gray-300 dark:bg-stone-700 rounded" />
        <div className="h-6 w-12 bg-gray-300 dark:bg-stone-700 rounded" />
      </div>
      <div className="h-8 bg-gray-300 dark:bg-stone-700 rounded mt-4 self-end w-20" />
    </div>
  );
};

export default ProductCardSkeleton;
