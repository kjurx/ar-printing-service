"use client";

import { useEffect, useState } from "react";

export default function TopNav({ waHref }: { waHref: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".navbar");
    const onScroll = () => {
      el?.classList.toggle("scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`nav-links ${open ? "open" : ""}`}>
        <a href="#home" onClick={() => setOpen(false)}>Home</a>
        <a href="/products" onClick={() => setOpen(false)}>Print Menu</a>
        <a href="/order" onClick={() => setOpen(false)}>Order Now</a>
        <a href="#why" onClick={() => setOpen(false)}>Why Us</a>
        <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
      </nav>
      <a
        className="nav-cta"
        href={waHref}
        target="_blank"
        rel="noopener"
      >
        WhatsApp
      </a>
      <button
        className={`menu-toggle ${open ? "active" : ""}`}
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </>
  );
}