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
  const { setStep, reviewConfirmed, shippingConfirmed, pendingOrder } =
    useCheckoutStore();

  return (
    <nav aria-label="Checkout Progress">
      <ol className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16 m-0 p-0 list-none">
        {steps.map((step) => {
          // Lock navigation if the order has already been created on backend
          const isLocked = !!pendingOrder && step.id !== 3;
          const isActive = step.id === currentStep;

          return (
            <li
              key={step.id}
              onClick={() => {
                if (isLocked) return; // Prevent backtrack if order exists
                if (step.id === 1) setStep(1);
                if (step.id === 2 && reviewConfirmed) setStep(2);
                if (step.id === 3 && shippingConfirmed) setStep(3);
              }}
              className={`cursor-pointer flex items-center gap-2 border-b-2 pb-4 transition-all ${
                isLocked
                  ? "cursor-not-allowed opacity-40 border-transparent"
                  : "cursor-pointer border-gray-300 dark:border-stone-700 hover:border-gray-400"
              } ${isActive ? "border-gray-900 dark:border-white" : "border-gray-300 dark:border-stone-700"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? "bg-gray-900 text-white dark:bg-white dark:text-black" : "bg-gray-300 dark:bg-stone-700"}`}
              >
                {step.id}
              </div>
              <span
                className={`text-sm font-medium ${isActive ? "text-black dark:text-white" : "text-gray-500"}`}
              >
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default CheckoutSteps;
