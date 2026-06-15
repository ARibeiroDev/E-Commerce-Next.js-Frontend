import ProductForm from "@/components/forms/products/ProductForm";

const CreateProductPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex flex-col gap-2">
        <h3 className="text-xl lg:text-2xl font-bold">Create New Product</h3>
        <p className="text-sm text-gray-600 dark:text-stone-400">
          Fill in the details below to add a new product to your catalog.
        </p>
      </header>

      <ProductForm />
    </div>
  );
};

export default CreateProductPage;
