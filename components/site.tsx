"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="logo">
      <div>
        {" "}
        <Image
          src="/images/solomulti_logo_2.png"
          alt="Solo Multi-Link"
          className="logo-image"
          fill
        />
      </div>
      <i></i>
      <strong>
        Solo
        <br />
        <em>Multi-Link</em>
      </strong>
    </Link>
  );
}

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Properties", href: "/properties" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="shell nav">
        <Logo />

        <nav className={menuOpen ? "open" : ""}>
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={pathname === item.href ? "active" : ""}
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/contact"
            className="mobile-contact"
            onClick={() => setMenuOpen(false)}
          >
            Let's talk
          </Link>
        </nav>

        <button
          className="hamburger"
          aria-label="Toggle Menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <Link href="/contact" className="nav-cta">
          Let's talk
          <ArrowRight size={16} />
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="inner-footer">
      <div className="shell footer-content">
        <div>
          © {new Date().getFullYear()} Solo Multi-Link. All rights reserved.
        </div>

        <div>RC 7149846 · Benin, Nigeria</div>
      </div>
    </footer>
  );
}

export function PageHero({
  label,
  title,
}: {
  label: string;
  title: React.ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="shell">
        <div className="crumb">
          <Link href="/">HOME</Link> / {label.toUpperCase()}
        </div>

        <h1>{title}</h1>
      </div>
    </section>
  );
}

export function PageCta() {
  return (
    <section className="page-cta">
      <div className="shell">
        <h2>Ready to make your next move?</h2>

        <Link href="/contact">
          Talk to our team
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
