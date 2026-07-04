import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, scrollToTarget } from "../lib/motion";
import { PROCESS_STEPS, AI_STACK, TIMELINE } from "../data/content";

/* V7 process: a pinned stage where the four step cards FLY IN as you
   scroll, each settling into a loosely thrown stack (offset + tilt), like
   prints landing on a light table. A red progress dot row tracks the step.
   Mobile / reduced motion: a clean stacked list instead. */

const SLOTS = [
  { x: -0.16, y: -0.1, r: -5 },
  { x: 0.14, y: -0.02, r: 4 },
  { x: -0.1, y: 0.08, r: -3 },
  { x: 0.16, y: 0.13, r: 6 },
];

export function ProcessSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(max-width: 767px)").matches) return; // static list on mobile

    const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-float-card]"));
    if (!cards.length) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // card 1 rests in place from the start (stage never looks empty)
    gsap.set(cards[0], {
      x: SLOTS[0].x * vw,
      y: SLOTS[0].y * vh,
      rotation: SLOTS[0].r,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage.parentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          const idx = Math.min(3, Math.floor(self.progress * 4));
          dotsRef.current?.querySelectorAll("span").forEach((d, i) => {
            (d as HTMLElement).style.background =
              i <= idx ? "var(--seif-red)" : "var(--seif-gray-700)";
          });
        },
      },
    });
    cards.slice(1).forEach((card, i) => {
      const slot = SLOTS[i + 1];
      tl.fromTo(
        card,
        { x: vw * 0.85, y: vh * 0.5, rotation: 18 },
        {
          x: slot.x * vw,
          y: slot.y * vh,
          rotation: slot.r,
          duration: 1,
          ease: "power2.out",
        },
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section id="process" className="pt-28">
      <div className="px-6 md:px-14">
        <h2 data-vtext className="seif-display" style={{ fontSize: "clamp(2rem, 4.6vw, 3.8rem)" }}>
          How We Turn Ideas Into Visuals
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
          From brief to final delivery, this is exactly how Seif Studios works.
          Keep scrolling, the steps land on the table.
        </p>
      </div>

      {/* pinned stage: cards fly in (desktop) */}
      <div className="hidden md:block" style={{ height: "340vh", position: "relative" }}>
        <div
          ref={stageRef}
          style={{
            position: "sticky",
            top: 0,
            height: "100dvh",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {PROCESS_STEPS.map((st, i) => (
            <div key={st.num} data-float-card={i} className="seif-float-card">
              <div className="flex items-baseline gap-4">
                <span className="seif-mono" style={{ color: "var(--seif-red)", fontSize: "1.05rem" }}>
                  {st.num}
                </span>
                <span className="seif-mono" style={{ color: "var(--seif-gray-500)" }}>
                  {st.tag}
                </span>
              </div>
              <h3 className="seif-display mt-3" style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)" }}>
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
          <div
            ref={dotsRef}
            className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-3"
            aria-hidden="true"
          >
            {PROCESS_STEPS.map((st) => (
              <span
                key={st.num}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "var(--seif-gray-700)",
                  transition: "background 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* mobile / reduced-motion: plain stacked steps */}
      <div className="flex flex-col gap-6 px-6 pt-10 md:hidden">
        {PROCESS_STEPS.map((st) => (
          <div key={st.num} className="seif-float-card" style={{ position: "static", width: "100%" }}>
            <div className="flex items-baseline gap-4">
              <span className="seif-mono" style={{ color: "var(--seif-red)" }}>
                {st.num}
              </span>
              <span className="seif-mono" style={{ color: "var(--seif-gray-500)" }}>
                {st.tag}
              </span>
            </div>
            <h3 className="seif-display mt-3" style={{ fontSize: "1.25rem" }}>
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

      <div className="px-6 md:px-14">
        {/* AI stack */}
        <div className="mt-24">
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
                style={{ background: "var(--seif-gray-700)", borderRadius: 12 }}
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
        <div className="mt-24">
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
      </div>
    </section>
  );
}
