"use client";

import {
  ShippingFormInputs,
  shippingFormSchema,
} from "@/types/validations/shippingForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {
  defaultValues?: ShippingFormInputs;
  onSubmit: (data: ShippingFormInputs) => void;
};

const CheckoutShippingStep = ({ defaultValues, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormInputs>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues,
  });

  const handleFormSubmit: SubmitHandler<ShippingFormInputs> = async (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4"
    >
      <div>
        <input
          type="text"
          placeholder="Full Name"
          {...register("shippingName")}
          className="w-full border p-3 rounded-md"
        />
        {errors.shippingName && (
          <p className="text-sm text-red-500 mt-1">
            {errors.shippingName.message}
          </p>
        )}
      </div>

      <div>
        <input
          type="text"
          placeholder="Phone Number"
          {...register("shippingPhone")}
          className="w-full border p-3 rounded-md"
        />
        {errors.shippingPhone && (
          <p className="text-sm text-red-500 mt-1">
            {errors.shippingPhone.message}
          </p>
        )}
      </div>

      <div>
        <input
          type="text"
          placeholder="Address"
          {...register("shippingAddress")}
          className="w-full border p-3 rounded-md"
        />
        {errors.shippingAddress && (
          <p className="text-sm text-red-500 mt-1">
            {errors.shippingAddress.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            placeholder="City"
            {...register("shippingCity")}
            className="w-full border p-3 rounded-md"
          />
          {errors.shippingCity && (
            <p className="text-sm text-red-500 mt-1">
              {errors.shippingCity.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Postal Code"
            {...register("shippingPostalCode")}
            className="w-full border p-3 rounded-md"
          />
          {errors.shippingPostalCode && (
            <p className="text-sm text-red-500 mt-1">
              {errors.shippingPostalCode.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Country"
            {...register("shippingCountry")}
            className="w-full border p-3 rounded-md"
          />
          {errors.shippingCountry && (
            <p className="text-sm text-red-500 mt-1">
              {errors.shippingCountry.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 bg-black text-white dark:bg-white dark:text-black p-3 rounded-md hover:opacity-90 transition cursor-pointer"
      >
        Continue to payment
      </button>
    </form>
  );
};

export default CheckoutShippingStep;
