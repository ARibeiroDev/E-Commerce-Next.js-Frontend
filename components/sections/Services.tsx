import { CreditCard, Handshake, Headphones, Truck } from "lucide-react";

const Services = () => {
  return (
    <section className="px-[5vw] lg:px-[10vw] grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 my-12">
      <div className="flex items-center gap-4">
        <Truck size={35} />
        <div>
          <h3>Free shipping</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Free shipping on all orders over $100.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Handshake size={35} />
        <div>
          <h3>Free returns</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Free returns within 30 days.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Headphones size={35} />
        <div>
          <h3>Customer service</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Top of the line customer service.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <CreditCard size={35} />
        <div>
          <h3>Secure payments</h3>
          <p className="text-gray-500 dark:text-gray-400">
            We accept all major credit cards.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;
