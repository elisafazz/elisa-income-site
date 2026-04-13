"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

const navItems = [
  { label: "Blog", href: "/blog" },
  { label: "Tools", href: "/tools" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
];

function NavPill({
  children,
  href,
  setPosition,
}: {
  children: React.ReactNode;
  href: string;
  setPosition: (pos: { left: number; width: number; opacity: number }) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({ width, opacity: 1, left: ref.current.offsetLeft });
      }}
    >
      <Link
        href={href}
        className="relative z-10 block px-4 py-2 text-sm font-medium text-secondary mix-blend-difference transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
}

export function Header() {
  const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-foreground"
        >
          <Image src="/logo.png" alt="ATB" width={40} height={40} className="rounded" />
          AI Tool Breakdown
        </Link>

        <div className="flex items-center gap-2">
          <ul
            className="relative flex items-center rounded-full border border-border/50 bg-surface/50 p-1"
            onMouseLeave={() =>
              setPosition((prev) => ({ ...prev, opacity: 0 }))
            }
          >
            {navItems.map((item) => (
              <NavPill key={item.href} href={item.href} setPosition={setPosition}>
                {item.label}
              </NavPill>
            ))}
            <motion.li
              animate={position}
              className="absolute z-0 h-8 rounded-full bg-accent/20"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </ul>

          <Link
            href="/newsletter"
            className="ml-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Subscribe
          </Link>
        </div>
      </nav>
    </header>
  );
}
