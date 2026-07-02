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
      <fieldset>
        <input
          id="shippingName"
          type="text"
          placeholder="Full Name"
          autoComplete="name"
          aria-invalid={!!errors.shippingName}
          aria-describedby={
            errors.shippingName ? "shippingName-error" : undefined
          }
          {...register("shippingName")}
          className="w-full border p-3 rounded-md"
        />
        {errors.shippingName && (
          <p
            id="shippingName-error"
            role="alert"
            className="text-sm text-red-500 mt-1"
          >
            {errors.shippingName.message}
          </p>
        )}
      </fieldset>

      <fieldset>
        <input
          id="shippingPhone"
          type="text"
          placeholder="Phone Number"
          autoComplete="tel"
          aria-invalid={!!errors.shippingPhone}
          aria-describedby={
            errors.shippingPhone ? "shippingPhone-error" : undefined
          }
          {...register("shippingPhone")}
          className="w-full border p-3 rounded-md"
        />
        {errors.shippingPhone && (
          <p
            id="shippingPhone-error"
            role="alert"
            className="text-sm text-red-500 mt-1"
          >
            {errors.shippingPhone.message}
          </p>
        )}
      </fieldset>

      <fieldset>
        <input
          id="shippingAddress"
          type="text"
          placeholder="Address"
          autoComplete="street-address"
          aria-invalid={!!errors.shippingAddress}
          aria-describedby={
            errors.shippingAddress ? "shippingAddress-error" : undefined
          }
          {...register("shippingAddress")}
          className="w-full border p-3 rounded-md"
        />
        {errors.shippingAddress && (
          <p
            id="shippingAddress-error"
            role="alert"
            className="text-sm text-red-500 mt-1"
          >
            {errors.shippingAddress.message}
          </p>
        )}
      </fieldset>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <fieldset>
          <input
            id="shippingCity"
            type="text"
            placeholder="City"
            autoComplete="address-level2"
            aria-invalid={!!errors.shippingCity}
            aria-describedby={
              errors.shippingCity ? "shippingCity-error" : undefined
            }
            {...register("shippingCity")}
            className="w-full border p-3 rounded-md"
          />
          {errors.shippingCity && (
            <p
              id="shippingCity-error"
              role="alert"
              className="text-sm text-red-500 mt-1"
            >
              {errors.shippingCity.message}
            </p>
          )}
        </fieldset>

        <fieldset>
          <input
            id="shippingPostalCode"
            type="text"
            placeholder="Postal Code"
            autoComplete="postal-code"
            aria-invalid={!!errors.shippingPostalCode}
            aria-describedby={
              errors.shippingPostalCode ? "shippingPostalCode-error" : undefined
            }
            {...register("shippingPostalCode")}
            className="w-full border p-3 rounded-md"
          />
          {errors.shippingPostalCode && (
            <p
              id="shippingPostalCode-error"
              role="alert"
              className="text-sm text-red-500 mt-1"
            >
              {errors.shippingPostalCode.message}
            </p>
          )}
        </fieldset>

        <fieldset>
          <input
            id="shippingCountry"
            type="text"
            placeholder="Country"
            aria-invalid={!!errors.shippingCountry}
            aria-describedby={
              errors.shippingCountry ? "shippingCountry-error" : undefined
            }
            {...register("shippingCountry")}
            className="w-full border p-3 rounded-md"
          />
          {errors.shippingCountry && (
            <p
              id="shippingCountry-error"
              role="alert"
              className="text-sm text-red-500 mt-1"
            >
              {errors.shippingCountry.message}
            </p>
          )}
        </fieldset>
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
