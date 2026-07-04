import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, scrollToTarget } from "../lib/motion";
import { PROCESS_STEPS, AI_STACK, TIMELINE } from "../data/content";

/* Process: vertical timeline with a red progress rail that grows with
   scroll (scaleY transform), the AI stack strip, and the Day 1 to 7 rail. */
export function ProcessSection() {
  const rootRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    const rail = railRef.current;
    if (!root || !rail) return;

    const railTween = gsap.fromTo(
      rail,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.querySelector("[data-steps]"),
          start: "top 75%",
          end: "bottom 55%",
          scrub: 0.6,
        },
      },
    );

    const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
    const tweens = steps.map((s) =>
      gsap.from(s, {
        x: 42,
        ease: "power3.out",
        duration: 0.8,
        scrollTrigger: { trigger: s, start: "top 86%" },
      }),
    );

    return () => {
      railTween.scrollTrigger?.kill();
      railTween.kill();
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <section id="process" ref={rootRef} className="px-6 py-28 md:px-14">
      <h2 className="seif-display" style={{ fontSize: "clamp(2rem, 4.6vw, 3.8rem)" }}>
        How We Turn Ideas Into Visuals
      </h2>
      <p
        className="mt-3 max-w-xl text-base leading-relaxed"
        style={{ color: "var(--seif-gray-300)" }}
      >
        From brief to final delivery, this is exactly how Seif Studios works.
      </p>

      {/* steps + rail */}
      <div data-steps className="relative mt-16 md:ml-6">
        <div
          className="absolute bottom-0 left-0 top-0 hidden w-px md:block"
          style={{ background: "var(--seif-gray-700)" }}
          aria-hidden="true"
        />
        <div
          ref={railRef}
          className="absolute bottom-0 left-0 top-0 hidden w-px origin-top md:block"
          style={{ background: "var(--seif-red)", boxShadow: "0 0 12px rgba(255,0,0,0.7)" }}
          aria-hidden="true"
        />
        <div className="flex flex-col gap-16 md:pl-14">
          {PROCESS_STEPS.map((st) => (
            <div key={st.num} data-step className="max-w-2xl">
              <div className="flex items-baseline gap-4">
                <span
                  className="seif-mono"
                  style={{ color: "var(--seif-red)", fontSize: "1.05rem" }}
                >
                  {st.num}
                </span>
                <span className="seif-mono" style={{ color: "var(--seif-gray-500)" }}>
                  {st.tag}
                </span>
              </div>
              <h3 className="seif-display mt-2" style={{ fontSize: "clamp(1.3rem, 2.6vw, 2rem)" }}>
                {st.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
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
      </div>

      {/* AI stack */}
      <div className="mt-28">
        <h3 className="seif-display" style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)" }}>
          The AI Stack Behind the Work
        </h3>
        <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
          We stay at the frontier of AI tooling, constantly evaluating and
          integrating the best platforms available.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {AI_STACK.map((t) => (
            <div
              key={t.name}
              className="p-5 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: "var(--seif-gray-700)" }}
            >
              <p className="seif-mono" style={{ color: "var(--seif-gray-500)" }}>
                {t.cat}
              </p>
              <h4 className="mt-2 text-base font-semibold">{t.name}</h4>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* delivery rail */}
      <div className="mt-28">
        <h3 className="seif-display" style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)" }}>
          From Brief to Delivered
        </h3>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {TIMELINE.map((t, i) => (
            <div key={t.day} className="relative">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                  style={{ background: "var(--seif-red)", color: "var(--seif-white)" }}
                >
                  {i + 1}
                </span>
                <span className="seif-mono" style={{ color: "var(--seif-gray-500)" }}>
                  {t.day}
                </span>
              </div>
              <h4 className="mt-3 text-base font-semibold">{t.title}</h4>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
                {t.desc}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm" style={{ color: "var(--seif-gray-500)" }}>
          *Up to 7 days for smaller projects, depending on the individual case.
        </p>
      </div>

      {/* CTA band */}
      <div
        className="mt-24 flex flex-col items-center gap-7 py-16 text-center"
        style={{ borderTop: "1px solid var(--seif-gray-700)", borderBottom: "1px solid var(--seif-gray-700)" }}
      >
        <h3 className="seif-display" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
          Ready to Start a Project?
        </h3>
        <button type="button" className="seif-btn-frame" data-magnetic onClick={() => scrollToTarget("#contact")}>
          Contact Us
        </button>
      </div>
    </section>
  );
}
