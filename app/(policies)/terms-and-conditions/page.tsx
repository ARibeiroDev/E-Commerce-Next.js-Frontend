import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

const TermsAndConditionsPage = () => {
  return (
    <main className="animate-appear flex-1 px-[5vw] lg:px-[10vw] py-12 flex flex-col gap-6">
      <h2 className="text-3xl font-bold">Terms & Conditions</h2>

      <p>
        Welcome to ClothingCo. By accessing or using our website, you agree to
        comply with and be bound by these Terms & Conditions. Please read them
        carefully.
      </p>

      <section>
        <h3 className="text-xl font-semibold mt-4">1. Use of Website</h3>
        <p>
          You may browse, purchase products, and access content for personal,
          non-commercial use only. You must not misuse the website or interfere
          with its functionality.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-4">2. Orders & Payments</h3>
        <p>
          All orders are subject to product availability. Payments must be
          completed at checkout. We reserve the right to cancel orders due to
          pricing errors or stock issues.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-4">3. Returns & Refunds</h3>
        <p>
          Our return and refund policies apply. Please review our{" "}
          <Link href="/refund-policy" className="underline text-blue-600">
            Refund Policy
          </Link>{" "}
          for details.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-4">4. Changes to Terms</h3>
        <p>
          We may update these Terms & Conditions from time to time. Your
          continued use of the website constitutes acceptance of the changes.
        </p>
      </section>
    </main>
  );
};

export default TermsAndConditionsPage;
