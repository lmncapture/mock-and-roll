"use client";

import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  hoverColor?: "peach-nectar" | "lime-sorbet" | "pink-lychee" | "rose-petal" | "berry-crush" | "frosted-mint" | "arctic-mist" | "blueberry-dew" | "soft-plum" | "lemon-zest";
  className?: string;
  onClick?: () => void;
}

const hoverColorMap: Record<string, string> = {
  "peach-nectar": "hover:bg-peach-nectar",
  "lime-sorbet": "hover:bg-lime-sorbet",
  "pink-lychee": "hover:bg-pink-lychee",
  "rose-petal": "hover:bg-rose-petal",
  "berry-crush": "hover:bg-berry-crush",
  "frosted-mint": "hover:bg-frosted-mint",
  "arctic-mist": "hover:bg-arctic-mist",
  "blueberry-dew": "hover:bg-blueberry-dew",
  "soft-plum": "hover:bg-soft-plum",
  "lemon-zest": "hover:bg-lemon-zest",
};

export default function Button({
  children,
  href,
  hoverColor = "peach-nectar",
  className = "",
  onClick,
}: ButtonProps) {
  const baseClasses = [
    "inline-block",
    "rounded-pill",
    "bg-slate",
    "text-cool-white",
    "font-body",
    "font-semibold",
    "px-6",
    "py-3",
    "transition-colors",
    "duration-200",
    "ease-in-out",
    "hover:text-slate",
    "focus:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-slate",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-cool-white",
    hoverColorMap[hoverColor] || "hover:bg-peach-nectar",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {children}
    </button>
  );
}
