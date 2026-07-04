import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, scrollToTarget } from "../lib/motion";
import { PROCESS_STEPS, AI_STACK, TIMELINE } from "../data/content";

/* Process (v2, condensed): steps as a tight 2x2 grid with hairline frames,
   then the AI stack strip and the Day 1 to 7 rail. Keeps the landing short. */
export function ProcessSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;
    const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
    const tweens = steps.map((s, i) =>
      gsap.from(s, {
        y: 26,
        ease: "power3.out",
        duration: 0.8,
        delay: (i % 2) * 0.08,
        scrollTrigger: { trigger: s, start: "top 92%" },
      }),
    );
    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <section
      id="process"
      ref={rootRef}
      className="px-6 py-28 md:px-14"
      style={{
        backgroundImage: "url(/assets/generated/texture-streaks.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 data-vtext className="seif-display" style={{ fontSize: "clamp(2rem, 4.6vw, 3.8rem)" }}>
        How We Turn Ideas Into Visuals
      </h2>
      <p
        className="mt-3 max-w-xl text-base leading-relaxed"
        style={{ color: "var(--seif-gray-300)" }}
      >
        From brief to final delivery, this is exactly how Seif Studios works.
      </p>

      {/* steps: 2x2 grid */}
      <div className="mt-14 grid grid-cols-1 gap-px md:grid-cols-2" style={{ background: "var(--seif-gray-700)" }}>
        {PROCESS_STEPS.map((st) => (
          <div key={st.num} data-step className="p-8 md:p-10" style={{ background: "var(--seif-black)" }}>
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
            <h3 className="seif-display mt-3" style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.7rem)" }}>
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
        <button type="button" className="seif-btn-frame" onClick={() => scrollToTarget("#contact")}>
          Contact Us
        </button>
      </div>
    </section>
  );
}
