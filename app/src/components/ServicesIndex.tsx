import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, scrollToTarget } from "../lib/motion";
import { SERVICES } from "../data/content";

/* Services: numbered full-width index rows over the generated texture plate.
   Hovering a row floats its media preview beside the cursor and turns the
   title red. Clicking scrolls to the matching work chapter. */
export function ServicesIndex() {
  const rootRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const canHover = useRef(false);

  useEffect(() => {
    canHover.current =
      window.matchMedia("(hover: hover)").matches && !prefersReducedMotion();
    const prev = previewRef.current;
    if (!prev || !canHover.current) return;
    const px = gsap.quickTo(prev, "x", { duration: 0.4, ease: "power3.out" });
    const py = gsap.quickTo(prev, "y", { duration: 0.4, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      px(e.clientX + 28);
      py(e.clientY - 110);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const activeService = active !== null ? SERVICES[active] : null;

  return (
    <section
      id="services"
      ref={rootRef}
      className="relative mt-28 px-6 py-24 md:px-14"
      style={{
        backgroundImage: "url(/assets/generated/texture-streaks.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="seif-display" style={{ fontSize: "clamp(2rem, 4.6vw, 3.8rem)" }}>
        AI Visual Production
      </h2>
      <p
        className="mt-3 max-w-xl text-base leading-relaxed"
        style={{ color: "var(--seif-gray-300)" }}
      >
        High end AI generated visuals for campaigns and digital media.
      </p>

      <div className="mt-14" style={{ borderTop: "1px solid var(--seif-gray-700)" }}>
        {SERVICES.map((s, i) => (
          <button
            key={s.num}
            type="button"
            className="group flex w-full flex-col gap-3 py-7 text-left transition-colors md:flex-row md:items-center md:gap-8"
            style={{ borderBottom: "1px solid var(--seif-gray-700)" }}
            onPointerEnter={() => canHover.current && setActive(i)}
            onPointerLeave={() => setActive(null)}
            onClick={() => scrollToTarget(`#work-${s.chapterId}`)}
            aria-label={`${s.title}. ${s.desc} See this work.`}
          >
            <span
              className="seif-mono w-12 shrink-0"
              style={{ color: "var(--seif-gray-500)", fontSize: "1rem" }}
            >
              {s.num}
            </span>
            <span
              className="seif-display flex-1 transition-colors duration-300"
              style={{
                fontSize: "clamp(1.5rem, 3.4vw, 2.8rem)",
                color: active === i ? "var(--seif-red)" : "var(--seif-white)",
              }}
            >
              {s.title}
            </span>
            <span className="flex max-w-md flex-col gap-3 md:items-end">
              <span
                className="text-sm leading-relaxed md:text-right"
                style={{ color: "var(--seif-gray-300)" }}
              >
                {s.desc}
              </span>
              <span className="flex flex-wrap gap-2">
                {s.pills.map((p) => (
                  <span key={p} className="seif-pill">
                    {p}
                  </span>
                ))}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* floating preview follows the cursor */}
      <div
        ref={previewRef}
        className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
        style={{
          width: 260,
          visibility: activeService ? "visible" : "hidden",
        }}
        aria-hidden="true"
      >
        {SERVICES.map((s, i) =>
          s.mediaKind === "image" ? (
            <img
              key={s.num}
              src={s.media}
              alt=""
              loading="lazy"
              style={{
                display: active === i ? "block" : "none",
                width: "100%",
                height: 200,
                objectFit: "cover",
              }}
            />
          ) : (
            <video
              key={s.num}
              src={s.media}
              poster={s.poster}
              muted
              loop
              playsInline
              preload="none"
              ref={(el) => {
                if (!el) return;
                if (active === i) void el.play().catch(() => {});
                else el.pause();
              }}
              style={{
                display: active === i ? "block" : "none",
                width: "100%",
                height: 200,
                objectFit: "cover",
              }}
            />
          ),
        )}
      </div>
    </section>
  );
}
