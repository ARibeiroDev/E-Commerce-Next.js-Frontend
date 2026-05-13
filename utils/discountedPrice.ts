export const getDiscount = (price: number, discount: number | null) => {
  if (!discount || discount === 0) return price.toFixed(2);
  return (price - (price * discount) / 100).toFixed(2);
};
