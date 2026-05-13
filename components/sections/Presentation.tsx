import Image from "next/image";
import Link from "next/link";

const Presentation = () => {
  return (
    <section className="flex flex-col lg:flex-row md:items-center justify-center gap-8 px-[5vw] lg:px-[10vw] py-6">
      <figure className="lg:w-7/12">
        <Image
          src="https://images.pexels.com/photos/15024989/pexels-photo-15024989.jpeg"
          alt="Stylish man and woman posing in a studio with modern attire, showcasing elegance."
          width={1000}
          height={1000}
          className="rounded-md"
          loading="lazy"
        />
        <figcaption className="sr-only">
          Stylish man and woman posing in a studio with modern attire,
          showcasing elegance.
        </figcaption>
      </figure>
      <section className="lg:w-5/12 flex flex-col gap-2 xl:gap-6">
        <h2 className="text-5xl lg:text-6xl whitespace-nowrap font-medium">
          ClothingCo.
        </h2>
        <p>
          We design clean, versatile clothing that{" "}
          <strong className="font-semibold">empowers </strong>
          your everyday look.
        </p>
        <h3 className="text-2xl lg:text-4xl mt-2 font-medium">
          Express yourself through fashion
        </h3>
        <p>
          Our passionate fashion team empowers our customers to use fashion as
          expression by inspiring them with a diverse range of brands and
          styles.
        </p>

        <Link
          href="/about"
          className="mt-10 bg-stone-800 text-gray-100 border border-stone-800 dark:bg-gray-100 dark:text-stone-800 uppercase font-semibold p-4 max-w-40 text-center rounded-xl transition-all duration-200 ease-in-out hover:bg-transparent hover:border-stone-800 hover:border hover:text-stone-800 dark:hover:text-gray-100 hover:dark:border-gray-100"
        >
          Read More
        </Link>
      </section>
    </section>
  );
};

export default Presentation;
