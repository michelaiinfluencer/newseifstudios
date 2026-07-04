import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";
import { PROCESS_STEPS } from "../data/content";

/* V13 process: the four step cards in ONE HORIZONTAL LINE.
   Each card arrives with its layered entrance (rise + fade, red bar draws,
   number pops, pills ripple), staggered across the row. Mobile stacks. */

export function ProcessSection() {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const row = rowRef.current;
    if (!row) return;

    const cards = Array.from(row.querySelectorAll<HTMLElement>("[data-step-card]"));
    const anims: gsap.core.Timeline[] = cards.map((card, i) => {
      const bar = card.querySelector("[data-bar]");
      const num = card.querySelector("[data-num]");
      const pills = card.querySelectorAll(".seif-pill");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: row, start: "top 82%" },
        delay: i * 0.16,
      });
      tl.from(card, { y: 80, opacity: 0, duration: 0.8, ease: "power3.out" });
      if (bar) tl.from(bar, { scaleX: 0, duration: 0.5, ease: "power2.out" }, "-=0.35");
      if (num)
        tl.from(num, { scale: 1.9, opacity: 0, duration: 0.4, ease: "back.out(2)" }, "-=0.4");
      if (pills.length)
        tl.from(pills, { y: 14, opacity: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }, "-=0.2");
      return tl;
    });

    return () => {
      anims.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <section
      id="process"
      className="px-6 py-32 md:px-14"
      style={{ borderTop: "1px solid var(--seif-gray-700)" }}
    >
      <h2 className="seif-display seif-h2">How We Turn Ideas Into Visuals</h2>
      <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
        Four steps, side by side, from brief to handoff.
      </p>

      <div ref={rowRef} className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {PROCESS_STEPS.map((st) => (
          <div
            key={st.num}
            data-step-card
            className="seif-float-card"
            style={{
              position: "static",
              width: "100%",
              padding: "1.6rem 1.7rem",
              borderTop: "none",
            }}
          >
            <div
              data-bar
              aria-hidden="true"
              style={{
                height: 3,
                background: "var(--seif-red)",
                borderRadius: 2,
                transformOrigin: "left",
                marginBottom: "1.1rem",
              }}
            />
            <div className="flex items-baseline gap-4">
              <span
                data-num
                className="seif-mono inline-block"
                style={{ color: "var(--seif-red)", fontSize: "1.3rem" }}
              >
                {st.num}
              </span>
              <span className="seif-mono" style={{ color: "var(--seif-gray-500)" }}>
                {st.tag}
              </span>
            </div>
            <h3 className="seif-display mt-3" style={{ fontSize: "clamp(1.15rem, 1.5vw, 1.4rem)" }}>
              {st.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
              {st.desc}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {st.pills.map((p) => (
                <span key={p} className="seif-pill">
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
