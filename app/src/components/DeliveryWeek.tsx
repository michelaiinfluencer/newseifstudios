import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";
import { TIMELINE } from "../data/content";

/* The workflow week. On desktop the section PINS when it reaches the middle
   of the screen: the page holds still while scrolling draws the red line
   down through the days, and once the line is full the pin releases and the
   page scrolls on. Mobile / reduced-motion: a plain reveal, no pin. */
export function DeliveryWeek() {
  const sectionRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const root = rootRef.current;
    const line = lineRef.current;
    if (!section || !root || !line) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-flow-item]"));
    const desktop = window.matchMedia("(min-width: 768px)").matches;

    if (desktop) {
      // PIN: hold the page with the workflow centered; scrolling scrubs the
      // line down and the days in together. Everything is scrub-linked, so it
      // never gets stuck hidden after a client-side navigation.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "center center",
          end: "+=1000",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1, // smooths the pin engage under Lenis smooth-scroll
          scrub: 0.6,
        },
      });
      tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 1 }, 0);
      tl.fromTo(
        items,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, ease: "power2.out", duration: 0.5, stagger: 0.16 },
        0.05,
      );
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    }

    // mobile: no pin, scrub the line + days as you scroll past
    const itemTweens = items.map((it) =>
      gsap.fromTo(
        it,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          ease: "power2.out",
          scrollTrigger: { trigger: it, start: "top 92%", end: "top 62%", scrub: 0.5 },
        },
      ),
    );
    const lineTween = gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top 60%", end: "bottom 80%", scrub: 0.5 },
      },
    );
    return () => {
      itemTweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      lineTween.scrollTrigger?.kill();
      lineTween.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="workflow"
      className="px-6 pb-20 pt-32 md:px-14 md:pt-40"
    >
      <div className="mx-auto w-full max-w-2xl">
        <h2 className="seif-display seif-h2">The Workflow</h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
          One week, from the first call to delivered files.
        </p>

        <div ref={rootRef} className="relative mt-10 pl-8">
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
          <div className="flex flex-col gap-6">
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
          <p className="mt-8 text-sm" style={{ color: "var(--seif-gray-500)" }}>
            *Up to 7 days for smaller projects, depending on the individual case.
          </p>
        </div>
      </div>
    </section>
  );
}
