import { usePathname } from "next/navigation";
import Link from "next/link";

const NavLinks = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  const base =
    "relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-stone-900 dark:after:bg-gray-100 after:origin-left after:transition-transform after:duration-300";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const getClass = (href: string) =>
    `${base} ${
      isActive(href)
        ? "after:scale-x-100"
        : "after:scale-x-0 hover:after:scale-x-100"
    }`;

  return (
    <nav className={className}>
      <Link href="/shop" className={getClass("/shop")}>
        Shop
      </Link>
      <Link href="/about" className={getClass("/about")}>
        About
      </Link>
      <Link href="/blog" className={getClass("/blog")}>
        Blog
      </Link>
      <Link href="/contact" className={getClass("/contact")}>
        Contact
      </Link>
    </nav>
  );
};

export default NavLinks;
