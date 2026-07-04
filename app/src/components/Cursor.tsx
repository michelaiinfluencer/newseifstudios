import { useEffect, useRef } from "react";
import { gsap } from "../lib/motion";

/* Spectacle-tier custom cursor: red dot + trailing ring.
   Grows to "View" over [data-cursor="view"], magnetizes [data-magnetic].
   CSS hides it on touch and reduced-motion. */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      dot.classList.add("is-live");
      ring.classList.add("is-live");
      dotX(e.clientX - 4);
      dotY(e.clientY - 4);
      ringX(e.clientX - ring.offsetWidth / 2);
      ringY(e.clientY - ring.offsetHeight / 2);
      const t = e.target as HTMLElement;
      ring.classList.toggle("is-view", !!t.closest('[data-cursor="view"]'));
    };

    const magnets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-magnetic]"),
    );
    const cleanups: Array<() => void> = [];
    magnets.forEach((m) => {
      const mx = gsap.quickTo(m, "x", { duration: 0.3, ease: "power3.out" });
      const my = gsap.quickTo(m, "y", { duration: 0.3, ease: "power3.out" });
      const onEnterMove = (e: PointerEvent) => {
        const r = m.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.25);
        my((e.clientY - (r.top + r.height / 2)) * 0.25);
      };
      const onLeave = () => {
        mx(0);
        my(0);
      };
      m.addEventListener("pointermove", onEnterMove);
      m.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        m.removeEventListener("pointermove", onEnterMove);
        m.removeEventListener("pointerleave", onLeave);
      });
    });

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="seif-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="seif-cursor-ring" aria-hidden="true">
        <span className="seif-cursor-label">View</span>
      </div>
    </>
  );
}
