"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/app/components/ui/Button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Mocktails", href: "/mocktails" },
  { label: "Packages", href: "/packages" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cool-white/80 backdrop-blur-md">
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 lg:py-6">
        {/* Logo */}
        <Link href="/" aria-label="Mock & Roll Home">
          <Image
            src="/logo.svg"
            alt="Mock & Roll"
            width={240}
            height={60}
            className="h-12 lg:h-16 w-auto"
            unoptimized
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`font-body font-medium transition-colors duration-200 ${
                isActive(link.href)
                  ? "text-slate border-b border-slate/40 pb-0.5"
                  : "text-slate/70 hover:text-slate"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button href="mailto:hello@mockandroll.com" hoverColor="peach-nectar">
            Book Mock &amp; Roll
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="md:hidden flex items-center justify-center w-11 h-11"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-slate"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="fixed inset-0 z-50 bg-cool-white flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <Link
                href="/"
                aria-label="Mock & Roll Home"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Image
                  src="/logo.svg"
                  alt="Mock & Roll"
                  width={200}
                  height={50}
                  className="h-12 w-auto"
                  unoptimized
                />
              </Link>
              <button
                type="button"
                className="flex items-center justify-center w-11 h-11"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-slate"
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`font-body font-semibold text-2xl transition-colors duration-200 ${
                    isActive(link.href)
                      ? "text-slate border-b border-slate/40 pb-0.5"
                      : "text-slate/70 hover:text-slate"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                href="mailto:hello@mockandroll.com"
                hoverColor="peach-nectar"
                className="mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Mock &amp; Roll
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
