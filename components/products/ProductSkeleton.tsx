const ProductSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-12 my-8 bg-gray-200 dark:bg-stone-800 rounded-md p-4 animate-pulse">
      <div className="w-full lg:w-5/12 relative aspect-square bg-gray-300 dark:bg-stone-700" />
      <div className="flex flex-col bg-gray-300 dark:bg-stone-700">
        <div className="w-full flex-1 lg:w-7/12 flex flex-col gap-4">
          <div className="bg-gray-400 dark:bg-stone-600 h-6 rounded" />
          <div className="bg-gray-400 dark:bg-stone-600 h-6 rounded" />
          <div className="bg-gray-400 dark:bg-stone-600 h-6 rounded" />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="bg-gray-400 dark:bg-stone-600 h-6 rounded" />
          <div className="bg-gray-400 dark:bg-stone-600 h-6 rounded" />
          <div className="bg-gray-400 dark:bg-stone-600 h-6 rounded" />
          <div className="bg-gray-400 dark:bg-stone-600 h-6 rounded" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
