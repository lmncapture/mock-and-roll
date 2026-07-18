"use client";

import { useState, useEffect, startTransition } from "react";
import { createPortal } from "react-dom";
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
  { label: "Inquiries", href: "mailto:lauren@mocknrollbar.com" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Wait for client mount so createPortal works.
  // startTransition defers the state update to avoid the synchronous-setState-in-effect lint error.
  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close menu on route change (deferred via startTransition to satisfy lint)
  useEffect(() => {
    startTransition(() => setMobileMenuOpen(false));
  }, [pathname]);

  // Close menu on Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href.startsWith("mailto")) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  const mobileOverlay = (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          id="mobile-nav"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
          style={{ backgroundColor: "#FCF4E8" }}
          className="fixed inset-0 z-[9999] flex flex-col min-h-screen"
          aria-modal="true"
          role="dialog"
          aria-label="Navigation menu"
        >
          {/* Top bar: logo + close */}
          <div className="flex items-center justify-between px-6 py-5 flex-shrink-0">
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
              className="flex items-center justify-center w-11 h-11 rounded-full bg-slate/8 hover:bg-slate/15 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="#324648"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="2" y1="2" x2="16" y2="16" />
                <line x1="16" y1="2" x2="2" y2="16" />
              </svg>
            </button>
          </div>

          {/* Nav links — centered vertically */}
          <div className="flex flex-col items-center justify-center flex-1 gap-7 px-6 py-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.05, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Link
                  href={link.href}
                  className={`font-body font-semibold text-2xl tracking-tight transition-colors duration-200 ${
                    isActive(link.href)
                      ? "text-slate underline underline-offset-4 decoration-slate/30"
                      : "text-slate/65 hover:text-slate"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="px-6 pb-10 flex-shrink-0 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Button
                href="mailto:lauren@mocknrollbar.com"
                hoverColor="peach-nectar"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Mock &amp; Roll
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-cool-white/80 backdrop-blur-md">
        <nav className="flex items-center justify-between px-6 lg:px-12 py-4 lg:py-6">
          {/* Logo */}
          <Link href="/" aria-label="Mock & Roll Home">
            <Image
              src="/logo.svg"
              alt="Mock & Roll"
              width={240}
              height={60}
              className="h-8 lg:h-16 w-auto"
              unoptimized
            />
          </Link>

          {/* Desktop nav */}
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
            <Button href="mailto:lauren@mocknrollbar.com" hoverColor="peach-nectar">
              Book Mock &amp; Roll
            </Button>
          </div>

          {/* Mobile hamburger — only visible below md */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-11 h-11"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
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
      </header>

      {/* Mobile overlay — portaled to document.body to escape header stacking context */}
      {mounted && createPortal(mobileOverlay, document.body)}
    </>
  );
}
