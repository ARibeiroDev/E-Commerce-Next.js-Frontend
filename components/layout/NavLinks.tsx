import { usePathname } from "next/navigation";
import Link from "next/link";

type NavLinksProps = {
  className?: string;
  onNavigate?: () => void; // Callback to be called when a link is clicked
  mobile?: boolean;
};

const NavLinks = ({ className, onNavigate, mobile = false }: NavLinksProps) => {
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
      {mobile && (
        <Link href="/" onClick={onNavigate}>
          Home
        </Link>
      )}
      <Link href="/shop" className={getClass("/shop")} onClick={onNavigate}>
        Shop
      </Link>
      <Link href="/about" className={getClass("/about")} onClick={onNavigate}>
        About
      </Link>
      <Link href="/blog" className={getClass("/blog")} onClick={onNavigate}>
        Blog
      </Link>
      <Link
        href="/contact"
        className={getClass("/contact")}
        onClick={onNavigate}
      >
        Contact
      </Link>
    </nav>
  );
};

export default NavLinks;
