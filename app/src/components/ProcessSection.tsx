import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";
import { PROCESS_STEPS, AI_STACK } from "../data/content";

/* V8 process: the four step cards fly in as you scroll and settle into a
   STRAIGHT, aligned 2x2 grid (no rotation, no overlap). Each card carries
   its delivery window, merging the old timeline into the steps. Below, the
   AI stack as flat rows with red index accents. Mobile / reduced motion:
   a plain stacked list. */

const DAYS = ["Day 1", "Day 2 to 3", "Day 3 to 6", "Day 7"];

const SLOTS = [
  { x: -0.165, y: -0.195 },
  { x: 0.165, y: -0.195 },
  { x: -0.165, y: 0.195 },
  { x: 0.165, y: 0.195 },
];

export function ProcessSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-float-card]"));
    if (!cards.length) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // anchor every card to the exact stage center; slots offset from there
    gsap.set(cards, { left: "50%", top: "50%", xPercent: -50, yPercent: -50 });
    gsap.set(cards[0], { x: SLOTS[0].x * vw, y: SLOTS[0].y * vh });

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
        { x: vw * 0.85, y: vh * 0.45, xPercent: -50, yPercent: -50 },
        { x: slot.x * vw, y: slot.y * vh, xPercent: -50, yPercent: -50, duration: 1, ease: "power2.out" },
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const CardBody = ({ st, i }: { st: (typeof PROCESS_STEPS)[number]; i: number }) => (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span className="seif-mono" style={{ color: "var(--seif-red)", fontSize: "1.05rem" }}>
            {st.num}
          </span>
          <span className="seif-mono" style={{ color: "var(--seif-gray-500)" }}>
            {st.tag}
          </span>
        </div>
        <span
          className="seif-mono"
          style={{
            color: "var(--seif-red)",
            border: "1px solid var(--seif-red)",
            borderRadius: 999,
            padding: "0.25em 0.8em",
          }}
        >
          {DAYS[i]}
        </span>
      </div>
      <h3 className="seif-display mt-3" style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.45rem)" }}>
        {st.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
        {st.desc}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {st.pills.map((p) => (
          <span key={p} className="seif-pill">
            {p}
          </span>
        ))}
      </div>
    </>
  );

  return (
    <section id="process" className="pt-28">
      <div className="px-6 md:px-14">
        <h2 className="seif-display" style={{ fontSize: "clamp(2rem, 4.6vw, 3.8rem)" }}>
          How We Turn Ideas Into Visuals
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
          Four steps, seven days, from brief to delivered. Keep scrolling, the
          steps take their places.
        </p>
      </div>

      {/* pinned stage (desktop): cards fly in and align */}
      <div className="hidden md:block" style={{ height: "320vh", position: "relative" }}>
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
              <CardBody st={st} i={i} />
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

      {/* mobile / reduced motion: stacked list */}
      <div className="flex flex-col gap-6 px-6 pt-10 md:hidden">
        {PROCESS_STEPS.map((st, i) => (
          <div key={st.num} className="seif-float-card" style={{ position: "static", width: "100%" }}>
            <CardBody st={st} i={i} />
          </div>
        ))}
      </div>

      <div className="px-6 md:px-14">
        <p className="mt-6 text-sm" style={{ color: "var(--seif-gray-500)" }}>
          *Up to 7 days for smaller projects, depending on the individual case.
        </p>

        {/* AI stack: flat editorial rows, red index accents */}
        <div className="mt-24 pb-28">
          <h3 className="seif-display" style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)" }}>
            The AI Stack Behind the Work
          </h3>
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
      </div>
    </section>
  );
}
