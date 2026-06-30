import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
};

const RefundPolicyPage = () => {
  return (
    <main className="animate-appear flex-1 px-[5vw] lg:px-[10vw] py-12 flex flex-col gap-6">
      <h2 className="text-3xl font-bold">Refund Policy</h2>

      <p>
        At ClothingCo, we want you to be completely satisfied with your
        purchase. This Refund Policy explains how returns and refunds work on
        our website.
      </p>

      <section>
        <h3 className="text-xl font-semibold mt-4">
          1. Eligibility for Refunds
        </h3>
        <p>To be eligible for a refund, products must be:</p>
        <ul className="list-disc ml-5">
          <li>Unused and in the same condition that you received them</li>
          <li>In the original packaging</li>
          <li>Accompanied by a receipt or proof of purchase</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-4">2. Non-Refundable Items</h3>
        <p>Certain items are non-refundable, including:</p>
        <ul className="list-disc ml-5">
          <li>Gift cards</li>
          <li>Downloadable software or digital products</li>
          <li>Items marked as final sale</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-4">3. Refund Process</h3>
        <p>
          Once your return is received and inspected, we will notify you of the
          approval or rejection of your refund. If approved, your refund will be
          processed to your original payment method within 5-10 business days.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-4">4. Exchanges</h3>
        <p>
          We only replace items if they are defective or damaged. If you need to
          exchange an item, please{" "}
          <Link href="/contact" className="underline text-blue-600">
            contact
          </Link>{" "}
          our customer support for assistance.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-4">5. Shipping Refunds</h3>
        <p>
          Shipping costs are non-refundable, except in cases where we made an
          error with your order. If you receive a refund, the cost of return
          shipping will be deducted from your refund.
        </p>
      </section>

      <p className=" mt-6">
        For more details or to initiate a return, please{" "}
        <Link href="/contact" className="underline text-blue-600">
          contact
        </Link>{" "}
        our customer support. You may also want to review our{" "}
        <Link href="/terms-and-conditions" className="underline text-blue-600">
          Terms & Conditions
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="underline text-blue-600">
          Privacy Policy
        </Link>
        .
      </p>
    </main>
  );
};

export default RefundPolicyPage;
