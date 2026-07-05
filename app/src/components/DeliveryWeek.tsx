import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";
import { TIMELINE } from "../data/content";

/* The workflow week, standing on its own in the middle of the page:
   a centered column where the red line draws itself downward as you
   scroll and each day fades in beside it. */
export function DeliveryWeek() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-flow-item]"));
    const itemTweens = items.map((it) =>
      gsap.from(it, {
        x: 70,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: it, start: "top 88%" },
      }),
    );

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
            // start only once the workflow is well in view, then draw as you
            // keep scrolling down through it. A long end range means the line
            // moves slowly and needs a lot more scroll to complete.
            start: "top 30%",
            end: "bottom top",
            scrub: 0.7,
          },
        },
      );
    }

    return () => {
      itemTweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      lineTween?.scrollTrigger?.kill();
      lineTween?.kill();
    };
  }, []);

  return (
    <section
      id="workflow"
      className="px-6 py-32 md:px-14"
      style={{ borderTop: "1px solid var(--seif-gray-700)" }}
    >
      <div className="mx-auto w-full max-w-2xl">
        <h2 className="seif-display seif-h2">The Workflow</h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
          One week, from the first call to delivered files.
        </p>

        <div ref={rootRef} className="relative mt-14 pl-8">
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
          <div className="flex flex-col gap-12">
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
          <p className="mt-10 text-sm" style={{ color: "var(--seif-gray-500)" }}>
            *Up to 7 days for smaller projects, depending on the individual case.
          </p>
        </div>
      </div>
    </section>
  );
}
