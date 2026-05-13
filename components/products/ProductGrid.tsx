import { Product } from "@/types/product";
import ProductCard from "@/components/products/ProductCard";

const ProductGrid = ({ products }: { products: Product[] }) => {
  return (
    <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 mt-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
