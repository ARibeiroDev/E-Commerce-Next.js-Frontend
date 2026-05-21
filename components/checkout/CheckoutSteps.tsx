import { useCheckoutStore } from "@/stores/checkoutStore";

type Props = {
  currentStep: number;
};

const steps = [
  {
    id: 1,
    title: "Review",
  },
  {
    id: 2,
    title: "Shipping",
  },
  {
    id: 3,
    title: "Payment",
  },
];

const CheckoutSteps = ({ currentStep }: Props) => {
  const { setStep, reviewConfirmed, shippingConfirmed } = useCheckoutStore();

  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16">
      {steps.map((step) => (
        <section
          key={step.id}
          onClick={() => {
            if (step.id === 1) setStep(1);
            if (step.id === 2 && reviewConfirmed) setStep(2);
            if (step.id === 3 && shippingConfirmed) setStep(3);
          }}
          className={`cursor-pointer flex items-center gap-2 border-b-2 pb-4 ${step.id === currentStep ? "border-gray-900 dark:border-white" : "border-gray-300 dark:border-stone-700"}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${step.id === currentStep ? "bg-gray-900 text-white dark:bg-white dark:text-black" : "bg-gray-300 dark:bg-stone-700"}`}
          >
            {step.id}
          </div>
          <p
            className={`text-sm font-medium ${step.id === currentStep ? "text-black dark:text-white" : "text-gray-500"}`}
          >
            {" "}
            {step.title}{" "}
          </p>
        </section>
      ))}
    </section>
  );
};

export default CheckoutSteps;
