import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, scrollToTarget } from "../lib/motion";
import { MARQUEE_ITEMS } from "../data/content";
import { Marquee } from "./Marquee";

/* Hero.
   Desktop: headline left, the brand film in a floating frame right; on scroll
   the type slides out left, the film swells to the centre and dissolves.
   Mobile: just the frameless film in the middle, growing as you scroll, then
   the "Create Without Limits" headline. */
export function Hero3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mWrapRef = useRef<HTMLDivElement>(null);
  const mFrameRef = useRef<HTMLDivElement>(null);
  const mVideoRef = useRef<HTMLVideoElement>(null);

  // autoplay both hero videos (only the visible one matters)
  useEffect(() => {
    const play = (v: HTMLVideoElement | null) => {
      if (!v) return;
      if (prefersReducedMotion()) {
        v.pause();
        return;
      }
      void v.play().catch(() => {
        const kick = () => void v.play().catch(() => {});
        window.addEventListener("pointerdown", kick, { once: true });
      });
    };
    play(videoRef.current);
    play(mVideoRef.current);
  }, []);

  // DESKTOP scroll: type exits left, framed film zooms to centre, fog
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    const wrap = wrapRef.current;
    const text = textRef.current;
    const film = filmRef.current;
    if (!wrap || !text || !film) return;

    const r = film.getBoundingClientRect();
    const dx = window.innerWidth / 2 - (r.left + r.width / 2);

    const tl = gsap.timeline({
      scrollTrigger: { trigger: wrap, start: "top top", end: "bottom bottom", scrub: 0.45 },
    });
    tl.to(text, { xPercent: -130, ease: "power2.in", duration: 0.5 }, 0);
    tl.to(film, { x: dx, scale: 2.3, ease: "power1.inOut", duration: 0.72 }, 0);
    tl.to(film, { opacity: 0, filter: "blur(26px)", ease: "power1.in", duration: 0.28 }, 0.72);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // MOBILE scroll: the frameless film grows almost too big for the screen,
  // then fades out.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const wrap = mWrapRef.current;
    const frame = mFrameRef.current;
    if (!wrap || !frame) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: wrap, start: "top top", end: "bottom bottom", scrub: 0.4 },
    });
    tl.fromTo(frame, { scale: 0.85 }, { scale: 1.85, ease: "none", duration: 0.82 }, 0);
    tl.to(frame, { opacity: 0, ease: "power1.in", duration: 0.18 }, 0.82);
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <>
      {/* DESKTOP HERO */}
      <div
        ref={wrapRef}
        id="top"
        className="hidden md:block"
        style={{ height: "260vh", position: "relative" }}
      >
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
          <div className="grid flex-1 grid-cols-12 items-center gap-8 px-14 pt-14">
            <div className="col-span-6 pl-10 lg:col-span-5 lg:pl-24" ref={textRef} style={{ zIndex: 2 }}>
              <p className="seif-eyebrow">
                Creative AI Studio for Brands, Products and Visual Storytelling
              </p>
              <h1 className="seif-display mt-5" style={{ fontSize: "clamp(2.6rem, 5.4vw, 5.2rem)" }}>
                Create Without Limits
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
                High end AI generated images and video for brands that want to
                stand out.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-8">
                <button type="button" className="seif-cta-pill" onClick={() => scrollToTarget("#work")}>
                  Explore the Work
                </button>
                <button type="button" className="seif-link-arrow" onClick={() => scrollToTarget("#contact")}>
                  Contact Us
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="col-span-6 flex justify-center lg:col-span-7">
              <div
                ref={filmRef}
                className="seif-hero-window"
                style={{ width: "min(66vw, 1400px)", willChange: "transform, opacity" }}
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
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Marquee items={MARQUEE_ITEMS} />
        </div>
      </div>

      {/* MOBILE HERO: frameless film in the middle, growing on scroll */}
      <div ref={mWrapRef} className="relative md:hidden" style={{ height: "220vh" }}>
        <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden px-5">
          <div
            ref={mFrameRef}
            className="relative w-full max-w-[440px] overflow-hidden rounded-2xl"
            style={{ aspectRatio: "16/9", willChange: "transform, opacity" }}
          >
            {/* video runs ~8px wider than the frame so the sides are cropped */}
            <video
              ref={mVideoRef}
              src="/assets/Video/Main/morfing.mp4"
              poster="/assets/Video/Main/morfing.jpg"
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              className="absolute top-0 h-full"
              style={{ width: "calc(100% + 16px)", left: "-8px", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      {/* MOBILE headline, after the film */}
      <div className="px-6 pb-28 pt-2 text-center md:hidden">
        <div className="flex justify-center">
          <p className="seif-eyebrow">Creative AI Studio</p>
        </div>
        <h1 className="seif-display mt-4" style={{ fontSize: "clamp(2.4rem, 12vw, 3.4rem)" }}>
          Create Without Limits
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed" style={{ color: "var(--seif-gray-300)" }}>
          High end AI generated images and video for brands that want to stand out.
        </p>
      </div>
    </>
  );
}
