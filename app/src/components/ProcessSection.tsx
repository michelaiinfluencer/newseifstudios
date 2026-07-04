import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";
import { PROCESS_STEPS, TIMELINE } from "../data/content";

/* V12 process: LEFT = four narrower step cards, each arriving with a
   layered entrance (card rises and fades in, its red top bar draws across,
   number pops, pills ripple in). Cards alternate a slight editorial offset.
   RIGHT = the delivery week on its self-drawing red line. */

export function ProcessSection() {
  const flowRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = flowRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-step-card]"));
    const cardAnims: gsap.core.Timeline[] = cards.map((card, i) => {
      const bar = card.querySelector("[data-bar]");
      const num = card.querySelector("[data-num]");
      const pills = card.querySelectorAll(".seif-pill");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: card, start: "top 88%" },
      });
      tl.from(card, {
        y: 80,
        x: i % 2 === 0 ? -40 : 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      if (bar) tl.from(bar, { scaleX: 0, duration: 0.5, ease: "power2.out" }, "-=0.35");
      if (num)
        tl.from(num, { scale: 1.9, opacity: 0, duration: 0.4, ease: "back.out(2)" }, "-=0.4");
      if (pills.length)
        tl.from(pills, { y: 14, opacity: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }, "-=0.2");
      return tl;
    });

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-flow-item]"));
    const itemTweens = items.map((it) =>
      gsap.from(it, {
        x: 70,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: it, start: "top 90%" },
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
            start: "top 75%",
            end: "bottom 70%",
            scrub: 0.5,
          },
        },
      );
    }

    return () => {
      cardAnims.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      itemTweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      lineTween?.scrollTrigger?.kill();
      lineTween?.kill();
    };
  }, []);

  return (
    <section id="process" className="px-6 pt-28 md:px-14" style={{ borderTop: "1px solid var(--seif-gray-700)" }}>
      <h2 className="seif-display seif-h2">How We Turn Ideas Into Visuals</h2>
      <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
        Four steps on the left, the delivery week on the right.
      </p>

      <div ref={flowRef} className="mt-14 grid grid-cols-1 gap-14 pb-28 lg:grid-cols-12">
        {/* left: four narrower step cards with layered entrances */}
        <div className="flex flex-col gap-10 lg:col-span-6">
          {PROCESS_STEPS.map((st, i) => (
            <div
              key={st.num}
              data-step-card
              className="seif-float-card"
              style={{
                position: "static",
                width: "min(480px, 100%)",
                padding: "1.8rem 2rem",
                marginLeft: i % 2 === 0 ? 0 : "clamp(0px, 6vw, 90px)",
                borderTop: "none",
              }}
            >
              {/* the red bar draws itself */}
              <div
                data-bar
                aria-hidden="true"
                style={{
                  height: 3,
                  background: "var(--seif-red)",
                  borderRadius: 2,
                  transformOrigin: "left",
                  marginBottom: "1.2rem",
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
              <h3 className="seif-display mt-3" style={{ fontSize: "clamp(1.25rem, 2vw, 1.6rem)" }}>
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

        {/* right: the delivery week on its drawing line */}
        <div className="relative lg:col-span-6 lg:pl-10">
          <div className="sticky top-24">
            <p className="seif-mono mb-8" style={{ color: "var(--seif-gray-500)" }}>
              The Delivery Week
            </p>
            <div className="relative pl-8">
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
