import { CreditCard, Handshake, Headphones, Truck } from "lucide-react";

const SERVICES_DATA = [
  {
    icon: Truck,
    title: "Free shipping",
    description: "Free shipping on all orders over $100.",
  },
  {
    icon: Handshake,
    title: "Free returns",
    description: "Free returns within 30 days.",
  },
  {
    icon: Headphones,
    title: "Customer service",
    description: "Top of the line customer service.",
  },
  {
    icon: CreditCard,
    title: "Secure payments",
    description: "We accept all major credit cards.",
  },
];

const Services = () => {
  return (
    <section
      className="px-[5vw] lg:px-[10vw] grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 my-12"
      aria-labelledby="services-heading"
    >
      <h2 id="services-heading" className="sr-only">
        Our Services
      </h2>

      {SERVICES_DATA.map((service, index) => (
        <article key={index} className="flex items-center gap-4">
          <service.icon size={35} aria-hidden="true" />
          <div>
            <h3 className="text-lg font-medium">{service.title}</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {service.description}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
};

export default Services;
