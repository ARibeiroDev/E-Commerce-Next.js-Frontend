export const getActionStyles = (action: string) => {
  if (action.includes("DEACTIVATE") || action.includes("DELETE")) {
    return "bg-red-50 text-red-700 border border-red-100";
  }

  if (action.includes("CREATE")) {
    return "bg-green-50 text-green-700 border border-green-100";
  }

  return "bg-blue-50 text-blue-700 border border-blue-100";
};
