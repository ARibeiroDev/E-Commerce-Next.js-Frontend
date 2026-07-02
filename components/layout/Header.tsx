"use client";

import Link from "next/link";
import NavLinks from "@/components/layout/NavLinks";
import { useEffect, useState } from "react";
import { ShoppingBagIcon, User, LogOut, WrenchIcon } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import useCart from "@/hooks/useCart";

const Header = () => {
  const [open, setOpen] = useState(false);

  const { user, logout, isAuthenticated, isLoading } = useAuthStore(
    (state) => state,
  );

  const { items } = useCart();

  const totalItems =
    items.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    const handleResize = () => setOpen(false);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="animate-slide shadow-xs dark:shadow-stone-800 z-10 flex justify-between items-center px-[5vw] lg:px-[7vw] min-h-18 relative">
      {/* Mobile menu */}
      <button
        className={`w-12 h-12 md:hidden cursor-pointer relative flex justify-center items-center ${open ? "toggle-btn" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle mobile menu"
        aria-expanded={open}
      >
        <div className="bg-stone-900 dark:bg-gray-100 w-6 sm:w-8 h-0.5 rounded absolute transition-all duration-500 before:content-[''] before:bg-stone-900 dark:before:bg-gray-100 before:w-6 before:sm:w-8 before:h-0.5 before:rounded before:absolute before:-translate-x-3 before:sm:-translate-x-4 before:-translate-y-2 before:transition-all before:duration-500 after:content-[''] after:bg-stone-900 dark:after:bg-gray-100 after:w-6 after:sm:w-8 after:h-0.5 after:rounded after:absolute after:-translate-x-3 after:sm:-translate-x-4 after:translate-y-2 after:transition-all after:duration-500 "></div>
      </button>

      <NavLinks
        onNavigate={() => setOpen(false)} // Closes the mobile menu upon click
        className={`z-10 flex md:hidden flex-col items-center justify-evenly uppercase absolute top-18 left-0 transition-all duration-500 ${open ? "translate-x-0" : "-translate-x-[200%]"} w-full h-[calc(100vh-4.5rem)] bg-gray-200/90 dark:bg-stone-900/95`}
        mobile
        aria-label="Mobile navigation"
      />

      {/* Logo */}
      <Link
        href="/"
        className="sr-only sm:not-sr-only md:text-xl uppercase tracking-wider"
      >
        <h1>ClothingCo.</h1>
      </Link>

      {/* Desktop menu */}
      <NavLinks
        className="hidden md:flex items-center gap-4 uppercase"
        aria-label="Main navigation"
      />

      {/* Icons */}
      <nav className="flex items-center gap-4" aria-label="User navigation">
        {isLoading ? (
          <p className="w-24 h-5 bg-gray-200 dark:bg-stone-800 rounded animate-pulse"></p>
        ) : isAuthenticated && user ? (
          <>
            <p>
              Hi,{" "}
              <Link href="/profile" className="border-b" title="Profile">
                {user?.username}
              </Link>{" "}
            </p>
            {isAuthenticated &&
              (user.role === "ADMIN" || user.role === "SUPERADMIN") && (
                <Link href="/admin" title="Admin Console">
                  <WrenchIcon />
                </Link>
              )}
            <LogOut
              onClick={logout}
              className="cursor-pointer"
              aria-label="Logout"
            />
          </>
        ) : (
          <Link href="/login" title="Login">
            <User />
          </Link>
        )}

        <Link href="/cart" className="relative" title="Cart">
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-black dark:bg-red-600 text-white rounded-full p-1 min-w-4 min-h-4 flex items-center justify-center aspect-square text-xs">
              {totalItems}
            </span>
          )}

          <ShoppingBagIcon />
        </Link>
        {!isAuthenticated && (
          <Link href="/register" className="border-l ml-1 pl-2 hidden md:block">
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
