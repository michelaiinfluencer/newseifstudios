import { useEffect, useRef } from "react";
import { scrollToTarget } from "../lib/motion";

const LINKS = [
  { label: "Work", target: "#work" },
  { label: "Services", target: "#services" },
  { label: "Process", target: "#process" },
];

/* Fixed top bar: transparent over the hero, blurred black once scrolled. */
export function Nav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      el.style.background = window.scrollY > 40 ? "rgba(0,0,0,0.7)" : "transparent";
      el.style.backdropFilter = window.scrollY > 40 ? "blur(10px)" : "none";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-6 transition-colors duration-300 md:px-14"
    >
      <button
        type="button"
        onClick={() => scrollToTarget("#top")}
        aria-label="Seif Studios, back to top"

      >
        <img
          src="/assets/Logo/LogoSSWhite1.2.png"
          alt="Seif Studios"
          style={{ height: 16, width: "auto" }}
        />
      </button>
      <nav className="flex items-center gap-7">
        {LINKS.map((l) => (
          <button
            key={l.target}
            type="button"
            className="seif-nav-link hidden sm:inline-block"
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
    </header>
  );
}
