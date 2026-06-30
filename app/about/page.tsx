import { Metadata } from "next";
import { Eye, ShieldCheck, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about ClothingCo, our mission, and our passion for fashion.",
};

const AboutPage = () => {
  return (
    <main className="flex-1 px-[5vw] lg:px-[10vw] py-12 animate-appear flex flex-col gap-16">
      <header className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        <section className="flex-1 flex flex-col gap-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Redefining your everyday essentials.
          </h2>
          <p className="text-lg leading-relaxed font-medium">
            We design clean, versatile clothing that empowers your everyday
            look. Born from a passion for minimalist design and high-quality
            fabrics, ClothingCo. is dedicated to providing premium clothing at
            accessible prices.
          </p>
        </section>
        <section className="flex-1 lg:pt-4 flex flex-col gap-4 text-stone-600 dark:text-stone-400">
          <p className="leading-relaxed">
            Fashion shouldn&apos;t be complicated. Our passionate team empowers
            our customers to use style as a form of expression by curating a
            diverse yet cohesive range of garments.
          </p>
          <p className="leading-relaxed">
            From the drafting table to your wardrobe, we focus on ethical
            manufacturing, durable materials, and timeless silhouettes. Whether
            you&apos;re looking for everyday staples or a standout piece for the
            weekend, we&apos;ve got you covered.
          </p>
        </section>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article className="p-8 rounded-xl bg-gray-200 dark:bg-stone-800 flex flex-col gap-4 transition-transform hover:-translate-y-1 duration-300">
          <Target size={32} />
          <h3 className="text-xl font-bold">Our Mission</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            To make high-quality, sustainable fashion accessible to everyone,
            empowering individuals to express their unique style with confidence
            and absolute ease.
          </p>
        </article>

        <article className="p-8 rounded-xl bg-gray-200 dark:bg-stone-800 flex flex-col gap-4 transition-transform hover:-translate-y-1 duration-300">
          <Eye size={32} />
          <h3 className="text-xl font-bold">Our Vision</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            To become a global leader in modern apparel, recognized for our
            unwavering commitment to quality, affordability, and radically
            inclusive design.
          </p>
        </article>

        <article className="p-8 rounded-xl bg-gray-200 dark:bg-stone-800 flex flex-col gap-4 transition-transform hover:-translate-y-1 duration-300">
          <ShieldCheck size={32} />
          <h3 className="text-xl font-bold">Our Values</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            Transparency in our supply chain, uncompromising durability in our
            stitching, and a customer-first approach to everything we build and
            ship.
          </p>
        </article>
      </section>
    </main>
  );
};

export default AboutPage;
