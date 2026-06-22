"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/app/components/ui/Button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Mocktails", href: "#cocktails" },
  { label: "Packages", href: "/packages" },
  { label: "About", href: "#about" },
  { label: "Book Mock & Roll", href: "#book" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cool-white/80 backdrop-blur-md">
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 lg:py-6">
        {/* Logo — larger for brand presence */}
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
              className="font-body font-medium text-slate transition-colors duration-200 hover:text-slate/70"
            >
              {link.label}
            </Link>
          ))}
          <Button href="#book" hoverColor="peach-nectar">
            Book Mock &amp; Roll
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
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
            {/* Overlay Header */}
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

              {/* Close Button */}
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

            {/* Mobile Nav Links */}
            <div className="flex flex-col items-center justify-center flex-1 gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-body font-semibold text-slate text-2xl transition-colors duration-200 hover:text-slate/70"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                href="#book"
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
