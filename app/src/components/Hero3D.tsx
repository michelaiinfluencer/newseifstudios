import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, scrollToTarget } from "../lib/motion";
import { MARQUEE_ITEMS } from "../data/content";
import { Marquee } from "./Marquee";

/* V8 hero: headline left, the vertical brand film in a floating frame on
   the right. As you scroll, the type slides out left, the film swells
   toward full screen, then dissolves like fog (blur + fade) at its peak.
   Reduced motion: static split layout, film paused on its poster. */
export function Hero3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (prefersReducedMotion()) {
      video.pause();
      return;
    }
    void video.play().catch(() => {
      const kick = () => void video.play().catch(() => {});
      window.addEventListener("pointerdown", kick, { once: true });
    });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const wrap = wrapRef.current;
    const text = textRef.current;
    const film = filmRef.current;
    if (!wrap || !text || !film) return;

    // how far the window's center is from the viewport center right now
    const r = film.getBoundingClientRect();
    const dx = window.innerWidth / 2 - (r.left + r.width / 2);

    const tl = gsap.timeline({
      scrollTrigger: { trigger: wrap, start: "top top", end: "bottom bottom", scrub: 0.45 },
    });
    // the type walks off stage left while the film takes over
    tl.to(text, { xPercent: -130, ease: "power2.in", duration: 0.5 }, 0);
    // the film glides INTO the center of the screen while zooming near fullscreen...
    tl.to(film, { x: dx, scale: 1.68, ease: "power1.inOut", duration: 0.72 }, 0);
    // ...and at its peak dissolves like fog
    tl.to(film, { opacity: 0, filter: "blur(26px)", ease: "power1.in", duration: 0.28 }, 0.72);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div ref={wrapRef} id="top" style={{ height: "260vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100dvh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="grid flex-1 grid-cols-1 items-center gap-8 px-6 pt-24 md:grid-cols-12 md:px-14 md:pt-14">
          <div ref={textRef} className="md:col-span-6 md:pl-10 lg:col-span-5 lg:pl-24" style={{ zIndex: 2 }}>
            <p className="seif-eyebrow">
              Creative AI Studio for Brands, Products and Visual Storytelling
            </p>
            <h1
              className="seif-display mt-5"
              style={{ fontSize: "clamp(2.6rem, 5.4vw, 5.2rem)" }}
            >
              Create Without Limits
            </h1>
            <p
              className="mt-5 max-w-md text-base leading-relaxed"
              style={{ color: "var(--seif-gray-300)" }}
            >
              High end AI generated images and video for brands that want to
              stand out.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-8">
              <button
                type="button"
                className="seif-cta-pill"
                onClick={() => scrollToTarget("#work")}
              >
                Explore the Work
              </button>
              <button
                type="button"
                className="seif-link-arrow"
                onClick={() => scrollToTarget("#contact")}
              >
                Contact Us
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex justify-center md:col-span-6 lg:col-span-7">
            <div
              ref={filmRef}
              className="seif-hero-window"
              style={{ width: "min(60vw, 960px)", willChange: "transform, opacity" }}
            >
              <div className="seif-hero-window-bar">
                <span className="seif-mono" style={{ color: "var(--seif-gray-500)" }}>
                  seif studios, brand film
                </span>
                <span className="seif-hero-window-dot" />
              </div>
              <div style={{ position: "relative", aspectRatio: "16/9" }}>
                <video
                  ref={videoRef}
                  src="/assets/Video/Main/morfing.mp4"
                  poster="/assets/Video/Main/morfing.jpg"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="auto"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <Marquee items={MARQUEE_ITEMS} />
      </div>
    </div>
  );
}
