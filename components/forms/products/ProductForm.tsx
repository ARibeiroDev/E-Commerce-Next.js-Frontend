"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Category, getCategories } from "@/lib/api/categories";
import {
  createProduct,
  updateProduct,
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "@/lib/api/products";
import {
  UpdateProductFormInputs,
  updateProductSchema,
} from "@/types/validations/productForm";
import { Product } from "@/types/product";
import { revalidateProduct } from "@/utils/revalidateCache";

interface ProductFormProps {
  initialData?: Product; // If provided, form is in Edit Mode
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [categories, setCategories] = useState<Category[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletedSkus, setDeletedSkus] = useState<string[]>([]);

  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProductFormInputs>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: isEditing
      ? {
          title: initialData.title,
          description: initialData.description,
          categoryId: initialData.categoryId,
          basePrice: Number(initialData.basePrice),
          featured: initialData.featured,
          tags: initialData.tags?.join(", ") || "",
          images: initialData.images?.join(", ") || "",
          variants: initialData.variants.map((v) => ({
            sku: v.sku,
            color: v.color,
            size: v.size,
            stock: v.stock,
            discountPercentage: v.discountPercentage || 0,
          })),
        }
      : {
          featured: false,
          variants: [{ color: "", size: "", stock: 0, discountPercentage: 0 }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Fetch Categories
  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data);
        // Preselect category
        if (isEditing && initialData.categoryId) {
          setValue("categoryId", initialData.categoryId, {
            shouldValidate: true,
          });
        }
      })
      .catch(console.error);
  }, [isEditing, initialData, setValue]);

  const handleRemoveVariant = (index: number) => {
    if (!confirm("Delete this variant?")) return;

    const variant = fields[index];
    if (isEditing && variant.sku) {
      setDeletedSkus((prev) => [...prev, variant.sku as string]);
    }
    remove(index);
  };

  const onSubmit: SubmitHandler<UpdateProductFormInputs> = async (data) => {
    setSuccess(null);
    clearErrors("root");

    try {
      const basePayload = {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        basePrice: data.basePrice,
        featured: data.featured,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        images: data.images
          ? data.images
              .split(",")
              .map((i) => i.trim())
              .filter(Boolean)
          : [],
      };

      if (isEditing) {
        // Edit mode logic
        const updatedProduct = await updateProduct(
          initialData.slug,
          basePayload,
        );
        const activeSlug = updatedProduct.slug;

        if (deletedSkus.length > 0) {
          await Promise.all(
            deletedSkus.map((sku) => deleteProductVariant(activeSlug, sku)),
          );
        }

        await Promise.all(
          data.variants.map((variant) => {
            const variantPayload = {
              color: variant.color,
              size: variant.size,
              stock: variant.stock,
              discountPercentage: variant.discountPercentage,
            };
            return variant.sku
              ? updateProductVariant(activeSlug, variant.sku, variantPayload)
              : addProductVariant(activeSlug, variantPayload);
          }),
        );

        await revalidateProduct(initialData.slug);
        setSuccess("Product successfully updated!");
      } else {
        // Create mode logic
        const createPayload = { ...basePayload, variants: data.variants };
        await createProduct(createPayload);
        setSuccess("Product successfully created!");
        reset();
      }

      router.push("/admin/products");
    } catch (error: unknown) {
      setError("root", {
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const inputStyles =
    "border border-gray-300 p-2 outline-0 text-sm focus:border-gray-400 rounded-md w-full bg-white dark:bg-stone-900 dark:border-stone-700";

  return (
    <form
      className="flex flex-col gap-4 w-full bg-gray-100 dark:bg-stone-800 p-4 rounded-xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Basic Info Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold">Basic Information</h4>
          {isEditing && (
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              Edit Mode
            </span>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            {...register("title")}
            placeholder="Product Title"
            className={inputStyles}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className={inputStyles}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Category</label>
            <select {...register("categoryId")} className={inputStyles}>
              <option value="">--Select a Category--</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Base Price (€)</label>
            <input
              type="number"
              step="0.01"
              {...register("basePrice", { valueAsNumber: true })}
              className={inputStyles}
            />
            {errors.basePrice && (
              <p className="text-sm text-red-500">{errors.basePrice.message}</p>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <label className="flex items-center space-x-3 cursor-pointer my-2">
              <input
                type="checkbox"
                {...register("featured")}
                className="w-5 h-5 rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm font-medium">Feature this product</span>
            </label>
          </div>
          {errors.featured && (
            <p className="text-sm text-red-500">{errors.featured.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Tags (comma separated)</label>
          <input {...register("tags")} className={inputStyles} />
          {errors.tags && (
            <p className="text-sm text-red-500">{errors.tags.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            Images (comma separated URLs)
          </label>
          <input {...register("images")} className={inputStyles} />
          {errors.images && (
            <p className="text-sm text-red-500">{errors.images.message}</p>
          )}
        </div>
      </section>

      <hr className="border-gray-300 dark:border-stone-600 my-2" />

      {/* Variants Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold">Variants</h4>
          <button
            type="button"
            onClick={() =>
              append({ color: "", size: "", stock: 0, discountPercentage: 0 })
            }
            className="text-sm bg-gray-200 hover:bg-gray-300 dark:bg-stone-700 px-3 py-1 rounded transition-colors"
          >
            + Add Variant
          </button>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border border-gray-300 dark:border-stone-600 rounded-md bg-gray-50 dark:bg-stone-900 space-y-3 relative"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">
                Variant {index + 1}{" "}
                {field.sku ? (
                  <span className="text-gray-400 font-normal">
                    (SKU: {field.sku})
                  </span>
                ) : (
                  <span className="text-green-500 font-normal">(New)</span>
                )}
              </span>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  {...register(`variants.${index}.color`)}
                  placeholder="Color"
                  className={inputStyles}
                />
                {errors.variants?.[index]?.color && (
                  <p className="text-sm text-red-500">
                    {errors.variants[index]?.color?.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register(`variants.${index}.size`)}
                  placeholder="Size"
                  className={inputStyles}
                />
                {errors.variants?.[index]?.size && (
                  <p className="text-sm text-red-500">
                    {errors.variants[index]?.size?.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="number"
                  {...register(`variants.${index}.stock`, {
                    valueAsNumber: true,
                  })}
                  placeholder="Stock"
                  className={inputStyles}
                />
                {errors.variants?.[index]?.stock && (
                  <p className="text-sm text-red-500">
                    {errors.variants[index]?.stock?.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="number"
                  {...register(`variants.${index}.discountPercentage`, {
                    valueAsNumber: true,
                  })}
                  placeholder="Discount (%)"
                  className={inputStyles}
                />
                {errors.variants?.[index]?.discountPercentage && (
                  <p className="text-sm text-red-500">
                    {errors.variants[index]?.discountPercentage?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Status & Submit */}
      {errors.root && (
        <p className="text-sm text-red-500 text-center font-medium">
          {errors.root.message}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-600 text-center font-medium">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || success !== null}
        className="mt-4 w-full md:w-auto md:self-end px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isSubmitting
          ? "Processing..."
          : isEditing
            ? "Save Changes"
            : "Create Product"}
      </button>
    </form>
  );
}
