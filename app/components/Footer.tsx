import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Mocktails", href: "/mocktails" },
  { label: "Packages", href: "/packages" },
  { label: "About", href: "/about" },
  { label: "Book Mock & Roll", href: "mailto:lauren@mocknrollbar.com" },
];

export default function Footer() {
  return (
    <footer className="bg-slate text-cool-white py-16 lg:py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {/* Logo Column — full width on mobile */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
            <Link href="/" aria-label="Mock & Roll Home">
              <Image
                src="/logo.svg"
                alt="Mock & Roll"
                width={160}
                height={40}
                className="h-10 w-auto brightness-0 invert sepia-0"
                style={{
                  filter:
                    "brightness(0) invert(1) sepia(0.1) saturate(0.5) hue-rotate(20deg)",
                }}
                unoptimized
              />
            </Link>
            <p className="font-body text-sm text-cool-white/60 mt-2 max-w-xs">
              Premium mobile mocktail experiences for weddings, celebrations, and every event worth remembering.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-body font-semibold text-cool-white text-sm uppercase tracking-wider mb-2">
              Navigate
            </h3>
            <nav aria-label="Footer navigation" className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-body font-medium text-cool-white/80 hover:text-cool-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Media Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-body font-semibold text-cool-white text-sm uppercase tracking-wider mb-2">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/mocknrollbar?utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Mock & Roll on Instagram"
                className="flex items-center justify-center w-11 h-11 rounded-full border border-cool-white/20 hover:border-cool-white/60 hover:bg-cool-white/10 transition-all duration-200"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-cool-white"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-body font-semibold text-cool-white text-sm uppercase tracking-wider mb-2">
              Contact
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:lauren@mocknrollbar.com"
                className="font-body text-cool-white/80 hover:text-cool-white transition-colors duration-200"
              >
                lauren@mocknrollbar.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-cool-white/10 mt-12 lg:mt-16 pt-8">
          <p className="font-body text-sm text-cool-white/50 text-center">
          © {new Date().getFullYear()} Mock &amp; Roll. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
