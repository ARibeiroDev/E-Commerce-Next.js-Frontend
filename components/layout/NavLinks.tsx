import { usePathname } from "next/navigation";
import Link from "next/link";

type NavLinksProps = {
  className?: string;
  onNavigate?: () => void;
  mobile?: boolean;
};

const NAV_ITEMS = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const NavLinks = ({ className, onNavigate, mobile = false }: NavLinksProps) => {
  const pathname = usePathname();

  const baseClasses =
    "relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-stone-900 dark:after:bg-gray-100 after:origin-left after:transition-transform after:duration-300";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const getClass = (href: string) =>
    `${baseClasses} ${
      isActive(href)
        ? "after:scale-x-100"
        : "after:scale-x-0 hover:after:scale-x-100"
    }`;

  return (
    <nav className={className} aria-label="Main Navigation">
      {mobile && (
        <Link href="/" onClick={onNavigate}>
          Home
        </Link>
      )}

      {NAV_ITEMS.map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          className={getClass(href)}
          onClick={onNavigate}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
