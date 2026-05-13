import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col gap-8 items-center sm:flex-row sm:items-start sm:justify-between sm:gap-0 bg-stone-950 text-gray-300 py-6 px-[5vw] lg:px-[10vw] text-sm">
      <section className="flex flex-col gap-4 items-center sm:items-start">
        <Link href="/" className="flex items-center gap-2">
          <p className=" uppercase tracking-wider text-white">ClothingCo.</p>
        </Link>
        <p>&copy; {new Date().getFullYear()} ClothingCo.</p>
        <p>All rights reserved</p>
      </section>

      <section className="flex flex-col gap-4 items-center sm:items-start">
        <p className="text-white font-semibold">More</p>
        <Link href="/" className="hover:text-white">
          About
        </Link>
        <Link href="/" className="hover:text-white">
          Contact
        </Link>
        <Link href="/" className="hover:text-white">
          Blog
        </Link>
        <Link href="/" className="hover:text-white">
          Affiliate Program
        </Link>
      </section>
      <section className="flex flex-col gap-4 items-center sm:items-start">
        <p className="text-white font-semibold">Follow Us</p>
        <Link href="/" className="hover:text-white">
          Facebook
        </Link>
        <Link href="/" className="hover:text-white">
          Instagram
        </Link>
        <Link href="/" className="hover:text-white">
          Youtube
        </Link>
        <Link href="/" className="hover:text-white">
          X
        </Link>
      </section>
      <section className="flex flex-col gap-4 items-center sm:items-start">
        <p className="text-white font-semibold">Legal</p>
        <Link href="/privacy-policy" className="hover:text-white">
          Privacy Policy
        </Link>
        <Link href="/terms-and-conditions" className="hover:text-white">
          Terms and Conditions
        </Link>
        <Link href="/cookies-policy" className="hover:text-white">
          Cookies Policy
        </Link>
        <Link href="/refund-policy" className="hover:text-white">
          Refund Policy
        </Link>
      </section>
    </footer>
  );
};

export default Footer;
