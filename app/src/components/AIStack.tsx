import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";
import { AI_STACK } from "../data/content";

/* The AI Stack as its own full section: as you scroll in, the five tools
   materialize from nothing, one after another, each settling on its place.
   Reduced motion: everything rendered plainly. */
export function AIStack() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const grid = gridRef.current;
    if (!grid) return;
    const items = grid.querySelectorAll("[data-stack-item]");
    const tween = gsap.from(items, {
      opacity: 0,
      y: 44,
      scale: 0.94,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.22,
      scrollTrigger: { trigger: grid, start: "top 82%" },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="stack" className="flex min-h-[70vh] flex-col justify-center px-6 py-28 md:px-14">
      <h2 className="seif-display seif-h2">The AI Stack Behind the Work</h2>
      <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
        We stay at the frontier of AI tooling, constantly evaluating and
        integrating the best platforms available.
      </p>
      <div
        ref={gridRef}
        className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-5"
      >
        {AI_STACK.map((t, i) => (
          <div
            key={t.name}
            data-stack-item
            className="group"
            style={{ borderTop: "2px solid var(--seif-white)", paddingTop: "1rem" }}
          >
            <div className="flex items-baseline justify-between">
              <span className="seif-mono" style={{ color: "var(--seif-red)" }}>
                0{i + 1}
              </span>
              <span className="seif-mono" style={{ color: "var(--seif-gray-500)" }}>
                {t.cat}
              </span>
            </div>
            <h4 className="mt-3 text-base font-semibold transition-colors duration-300 group-hover:text-[#ff0000]">
              {t.name}
            </h4>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
              {t.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
