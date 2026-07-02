import { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the ClothingCo customer support team.",
};

const ContactPage = () => {
  return (
    <main className="flex-1 px-[5vw] lg:px-[10vw] py-12 animate-appear flex flex-col lg:flex-row gap-12 lg:gap-16">
      <section className="flex-1 flex flex-col gap-8">
        <header>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg">
            Have a question about your order, our products, or just want to say
            hi? We&apos;d love to hear from you.
          </p>
        </header>

        <address className="flex flex-col gap-6 not-italic">
          <div className="flex items-center gap-4 p-6 rounded-xl bg-gray-200 dark:bg-stone-800">
            <Mail
              size={24}
              className="text-stone-600 dark:text-stone-400"
              aria-hidden="true"
            />
            <div>
              <h3 className="font-semibold text-lg">Email Us</h3>
              <p className="text-stone-600 dark:text-stone-400">
                support@clothingco.com
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-xl bg-gray-200 dark:bg-stone-800">
            <Phone
              size={24}
              className="text-stone-600 dark:text-stone-400"
              aria-hidden="true"
            />
            <div>
              <h3 className="font-semibold text-lg">Call Us</h3>
              <p className="text-stone-600 dark:text-stone-400">
                +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-xl bg-gray-200 dark:bg-stone-800">
            <MapPin
              size={24}
              className="text-stone-600 dark:text-stone-400"
              aria-hidden="true"
            />
            <div>
              <h3 className="font-semibold text-lg">Visit Us</h3>
              <p className="text-stone-600 dark:text-stone-400">
                123 Fashion Ave, NY 10001
              </p>
            </div>
          </div>
        </address>
      </section>

      <section className="flex-1">
        <ContactForm />
      </section>
    </main>
  );
};

export default ContactPage;
