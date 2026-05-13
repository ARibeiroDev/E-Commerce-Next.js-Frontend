import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const PrivacyPolicyPage = () => {
  return (
    <main className="animate-appear flex-1 px-[5vw] lg:px-[10vw] py-12 flex flex-col gap-6">
      <h2 className="text-3xl font-bold">Privacy Policy</h2>

      <p>
        At ClothingCo, your privacy is important to us. This Privacy Policy
        explains how we collect, use, and protect your personal information when
        you use our website.
      </p>

      <section>
        <h3 className="text-xl font-semibold mt-4">
          1. Information We Collect
        </h3>
        <p>
          We collect personal information such as your name, email, address, and
          payment details when you place an order or create an account.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-4">
          2. How We Use Your Information
        </h3>
        <p>
          Your information is used to process orders, provide customer service,
          send promotional emails (if subscribed), and improve our website
          experience.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-4">3. Sharing Information</h3>
        <p>
          We do not sell your personal data. We may share information with
          payment processors, shipping providers, or legal authorities as
          required by law.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-4">4. Cookies</h3>
        <p>
          Our website uses cookies to enhance your experience. Please see our{" "}
          <Link href="/cookies-policy" className="underline text-blue-600">
            Cookies Policy
          </Link>{" "}
          for more details.
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;
