import Link from "next/link";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterLinks = {
  title: string;
  links: FooterLink[];
};

const FOOTER_LINKS: FooterLinks[] = [
  {
    title: "More",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { label: "Facebook", href: "https://www.facebook.com/", external: true },
      {
        label: "Instagram",
        href: "https://www.instagram.com/",
        external: true,
      },
      { label: "Youtube", href: "https://www.youtube.com/", external: true },
      { label: "X", href: "https://www.x.com/", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms and Conditions", href: "/terms-and-conditions" },
      { label: "Cookies Policy", href: "/cookies-policy" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col gap-8 items-center sm:flex-row sm:items-start sm:justify-between sm:gap-0 bg-stone-950 text-gray-300 py-6 px-[5vw] lg:px-[10vw] text-sm">
      <section className="flex flex-col gap-4 items-center sm:items-start">
        <Link href="/" className="flex items-center gap-2">
          <p className="uppercase tracking-wider text-white">ClothingCo.</p>
        </Link>
        <p>&copy; {currentYear} ClothingCo.</p>
        <p>All rights reserved</p>
      </section>

      {FOOTER_LINKS.map((section) => (
        <nav
          key={section.title}
          className="flex flex-col gap-4 items-center sm:items-start"
          aria-label={section.title}
        >
          <h2 className="text-white font-semibold">{section.title}</h2>
          {section.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ))}
    </footer>
  );
};

export default Footer;
