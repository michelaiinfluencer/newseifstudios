import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, scrollToTarget } from "../lib/motion";
import { MARQUEE_ITEMS } from "../data/content";
import { Marquee } from "./Marquee";

/* V3 hero: the brand's own morfing film, full-bleed autoplay loop.
   Scroll adds a slow push-in on the video and drifts the text away
   (transform only). Reduced motion: paused video on its poster frame. */
export function HeroVideo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (prefersReducedMotion()) {
      video.pause();
      return;
    }
    void video.play().catch(() => {
      // autoplay blocked: first interaction starts it
      const kick = () => void video.play().catch(() => {});
      window.addEventListener("pointerdown", kick, { once: true });
    });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    const video = videoRef.current;
    const content = contentRef.current;
    if (!root || !video || !content) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 },
    });
    tl.to(video, { scale: 1.12, ease: "none" }, 0).to(content, { y: -90, ease: "none" }, 0);
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div ref={rootRef} id="top" style={{ position: "relative", height: "100dvh", overflow: "hidden" }}>
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
          willChange: "transform",
        }}
        aria-hidden="true"
      />
      {/* readability scrims: lower third for the headline, top band for the nav */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 34%, rgba(0,0,0,0) 55%), linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 12%)",
        }}
        aria-hidden="true"
      />

      <div
        ref={contentRef}
        style={{ position: "absolute", left: 0, right: 0, bottom: "9vh" }}
        className="px-6 md:px-14"
      >
        <p className="seif-eyebrow">
          Creative AI Studio for Brands, Products and Visual Storytelling
        </p>
        <h1
          className="seif-display mt-4"
          style={{ fontSize: "clamp(2.6rem, 7.5vw, 6.4rem)" }}
        >
          Create Without Limits
        </h1>
        <p
          className="mt-4 max-w-xl text-base leading-relaxed"
          style={{ color: "var(--seif-gray-300)" }}
        >
          High end AI generated images and video for brands that want to stand
          out.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-8">
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

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
        <Marquee items={MARQUEE_ITEMS} />
      </div>
    </div>
  );
}
