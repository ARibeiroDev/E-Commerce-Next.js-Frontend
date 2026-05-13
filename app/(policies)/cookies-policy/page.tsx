import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies Policy",
};

const CookiesPolicyPage = () => {
  return (
    <main className="animate-appear flex-1 px-[5vw] lg:px-[10vw] py-12 flex flex-col gap-6">
      <h2 className="text-3xl font-bold">Cookies Policy</h2>

      <p>
        ClothingCo uses cookies to improve your browsing experience. This policy
        explains what cookies are, how we use them, and your choices.
      </p>

      <section>
        <h3 className="text-xl font-semibold mt-4">1. What Are Cookies?</h3>
        <p>
          Cookies are small text files stored on your device by websites to
          remember information about your visit, preferences, or actions.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-4">2. How We Use Cookies</h3>
        <p>We use cookies to:</p>
        <ul className="list-disc ml-5">
          <li>Remember your login and preferences</li>
          <li>Analyze website traffic</li>
          <li>Enhance personalization and product recommendations</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-4">3. Your Choices</h3>
        <p>
          You can choose to block or delete cookies via your browser settings.
          Note that some features may not work properly if cookies are disabled.
        </p>
      </section>
    </main>
  );
};

export default CookiesPolicyPage;
