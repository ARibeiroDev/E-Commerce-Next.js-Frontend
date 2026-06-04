const Loading = () => {
  return (
    <div className="flex flex-1 h-full items-center justify-center bg-white dark:bg-stone-900">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900 dark:border-stone-700 dark:border-t-white" />
    </div>
  );
};

export default Loading;
