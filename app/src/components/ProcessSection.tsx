import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";
import { PROCESS_STEPS, AI_STACK, TIMELINE } from "../data/content";

/* V9 process, two blocks:
   1. "The AI Stack" first: flat editorial rows with red indices.
   2. "How We Turn Ideas Into Visuals": title always visible (no pinning),
      then two columns: LEFT = the four step cards stacked one below the
      other (bigger); RIGHT = the workflow timeline, its entries appearing
      as you scroll along a red connecting line that draws itself. */

export function ProcessSection() {
  const flowRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = flowRef.current;
    if (!root) return;

    // step cards rise in one after another
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-step-card]"));
    const cardTweens = cards.map((c) =>
      gsap.from(c, {
        y: 60,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: c, start: "top 92%" },
      }),
    );

    // workflow entries slide in from the right as you scroll
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-flow-item]"));
    const itemTweens = items.map((it) =>
      gsap.from(it, {
        x: 70,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: it, start: "top 90%" },
      }),
    );

    // the connecting line draws itself down the column
    let lineTween: gsap.core.Tween | null = null;
    if (lineRef.current) {
      lineTween = gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            end: "bottom 70%",
            scrub: 0.5,
          },
        },
      );
    }

    return () => {
      [...cardTweens, ...itemTweens].forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      lineTween?.scrollTrigger?.kill();
      lineTween?.kill();
    };
  }, []);

  return (
    <section id="process" className="px-6 pt-28 md:px-14">
      {/* 1 · the AI stack, now leading */}
      <div className="pb-24">
        <h2 className="seif-display" style={{ fontSize: "clamp(1.8rem, 3.6vw, 3rem)" }}>
          The AI Stack Behind the Work
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
          We stay at the frontier of AI tooling, constantly evaluating and
          integrating the best platforms available.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
          {AI_STACK.map((t, i) => (
            <div
              key={t.name}
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
      </div>

      {/* 2 · how we work: steps left, workflow right */}
      <div style={{ borderTop: "1px solid var(--seif-gray-700)" }} className="pt-20">
        <h2 className="seif-display" style={{ fontSize: "clamp(2rem, 4.6vw, 3.8rem)" }}>
          How We Turn Ideas Into Visuals
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
          Four steps on the left, the delivery week on the right.
        </p>

        <div ref={flowRef} className="mt-14 grid grid-cols-1 gap-14 pb-28 lg:grid-cols-12">
          {/* left: the four step cards, stacked */}
          <div className="flex flex-col gap-8 lg:col-span-7">
            {PROCESS_STEPS.map((st) => (
              <div
                key={st.num}
                data-step-card
                className="seif-float-card"
                style={{ position: "static", width: "100%", padding: "2rem 2.2rem" }}
              >
                <div className="flex items-baseline gap-4">
                  <span className="seif-mono" style={{ color: "var(--seif-red)", fontSize: "1.15rem" }}>
                    {st.num}
                  </span>
                  <span className="seif-mono" style={{ color: "var(--seif-gray-500)" }}>
                    {st.tag}
                  </span>
                </div>
                <h3 className="seif-display mt-3" style={{ fontSize: "clamp(1.3rem, 2.2vw, 1.8rem)" }}>
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

          {/* right: the workflow week with its connecting line */}
          <div className="relative lg:col-span-5">
            <div className="sticky top-24">
              <p className="seif-mono mb-8" style={{ color: "var(--seif-gray-500)" }}>
                The Delivery Week
              </p>
              <div className="relative pl-8">
                {/* rail + drawn line */}
                <div
                  className="absolute bottom-2 left-2 top-2 w-px"
                  style={{ background: "var(--seif-gray-700)" }}
                  aria-hidden="true"
                />
                <div
                  ref={lineRef}
                  className="absolute bottom-2 left-2 top-2 w-px origin-top"
                  style={{ background: "var(--seif-red)", boxShadow: "0 0 8px rgba(255,0,0,0.5)" }}
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-9">
                  {TIMELINE.map((t, i) => (
                    <div key={t.day} data-flow-item className="relative">
                      <span
                        className="absolute -left-8 top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold"
                        style={{
                          background: "var(--seif-red)",
                          color: "#fff",
                          transform: "translateX(-40%)",
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="seif-mono" style={{ color: "var(--seif-red)" }}>
                        {t.day}
                      </span>
                      <h4 className="mt-1 text-base font-semibold">{t.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
                        {t.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-8 text-sm" style={{ color: "var(--seif-gray-500)" }}>
                *Up to 7 days for smaller projects, depending on the individual case.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
