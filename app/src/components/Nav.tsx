import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { scrollToTarget } from "../lib/motion";

const DESKTOP_LINKS = [
  { label: "Work", target: "#work" },
  { label: "Process", target: "#process" },
];

/* Fixed top bar. Desktop: logo + links. Mobile: small logo top-left + a
   hamburger that opens a minimal full-screen menu. */
export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      el.style.background = window.scrollY > 40 ? "rgba(255,255,255,0.78)" : "transparent";
      el.style.backdropFilter = window.scrollY > 40 ? "blur(10px)" : "none";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock page scroll while the menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const line = (i: number) => {
    const base: React.CSSProperties = {
      display: "block",
      width: 24,
      height: 2,
      background: "var(--seif-white)",
      borderRadius: 2,
      transition: "transform 0.3s ease, opacity 0.2s ease",
    };
    if (!open) return base;
    if (i === 0) return { ...base, transform: "translateY(6px) rotate(45deg)" };
    if (i === 1) return { ...base, opacity: 0 };
    return { ...base, transform: "translateY(-6px) rotate(-45deg)" };
  };

  return (
    <>
      <header
        ref={ref}
        className="fixed inset-x-0 top-0 z-[70] flex h-16 items-center justify-between px-6 transition-colors duration-300 md:px-14"
      >
        <button
          type="button"
          onClick={() => scrollToTarget("#top")}
          aria-label="Seif Studios, back to top"
        >
          <img
            src="/assets/Logo/logo3.2.png"
            alt="Seif Studios"
            className="h-8 w-auto md:h-[52px]"
          />
        </button>

        {/* desktop links */}
        <nav className="hidden items-center gap-7 md:flex">
          {DESKTOP_LINKS.map((l) => (
            <button
              key={l.target}
              type="button"
              className="seif-nav-link"
              onClick={() => scrollToTarget(l.target)}
            >
              {l.label}
            </button>
          ))}
          <button
            type="button"
            className="seif-nav-link"
            style={{ color: "var(--seif-red)" }}
            onClick={() => scrollToTarget("#contact")}
          >
            Contact Us
          </button>
        </nav>

        {/* mobile hamburger */}
        <button
          type="button"
          className="flex flex-col gap-[4px] p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span style={line(0)} />
          <span style={line(1)} />
          <span style={line(2)} />
        </button>
      </header>

      {/* mobile full-screen menu */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col justify-center px-8 md:hidden"
          style={{ background: "#ffffff" }}
        >
          <nav className="flex flex-col gap-2">
            <button
              type="button"
              className="seif-menu-link"
              onClick={() => {
                setOpen(false);
                scrollToTarget("#work");
              }}
            >
              Solutions
            </button>
            <Link to="/work" className="seif-menu-link" onClick={() => setOpen(false)}>
              Gallery
            </Link>
            <button
              type="button"
              className="seif-menu-link"
              onClick={() => {
                setOpen(false);
                scrollToTarget("#workflow");
              }}
            >
              Workflow
            </button>
            <button
              type="button"
              className="seif-menu-link"
              style={{ color: "var(--seif-red)" }}
              onClick={() => {
                setOpen(false);
                scrollToTarget("#contact");
              }}
            >
              Contact
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
