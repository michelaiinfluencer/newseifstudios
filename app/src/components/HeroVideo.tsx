import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion, scrollToTarget } from "../lib/motion";
import { MARQUEE_ITEMS } from "../data/content";
import { Marquee } from "./Marquee";

/* V4 hero: the brand's morfing film, SCRUBBED BY SCROLL.
   150 frames at 1920w on a canvas inside a sticky viewport; the visitor's
   scroll plays the 12s film. Frame 1 paints immediately (poster under the
   canvas); reduced motion keeps the static poster. */

const FRAME_COUNT = 150;
const framePath = (i: number) =>
  `/frames/hero/f-${String(i + 1).padStart(3, "0")}.jpg`;

export function HeroVideo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    if (prefersReducedMotion()) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.style.display = "block";

    const frames: Array<HTMLImageElement | null> = new Array(FRAME_COUNT).fill(null);
    let current = 0;
    let raf = 0;
    let killed = false;

    const draw = (index: number) => {
      let img: HTMLImageElement | null = null;
      for (let i = index; i >= 0; i--) {
        if (frames[i]?.complete && frames[i]!.naturalWidth > 0) {
          img = frames[i];
          break;
        }
      }
      if (!img) {
        for (let i = 0; i < FRAME_COUNT; i++) {
          if (frames[i]?.complete && frames[i]!.naturalWidth > 0) {
            img = frames[i];
            break;
          }
        }
      }
      if (!img) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    const load = (i: number) => {
      if (killed || frames[i]) return;
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        if (i === current || (i === 0 && current === 0)) {
          raf = requestAnimationFrame(() => draw(current));
        }
      };
      frames[i] = img;
    };
    load(0);
    for (let i = 1; i < FRAME_COUNT; i++) load(i);

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        const next = Math.min(
          FRAME_COUNT - 1,
          Math.floor(self.progress * (FRAME_COUNT - 1)),
        );
        if (next !== current) {
          current = next;
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => draw(current));
        }
      },
    });

    let textTween: gsap.core.Tween | null = null;
    if (contentRef.current) {
      textTween = gsap.to(contentRef.current, {
        y: -70,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });
    }

    const onResize = () => draw(current);
    window.addEventListener("resize", onResize);
    draw(0);

    return () => {
      killed = true;
      st.kill();
      textTween?.scrollTrigger?.kill();
      textTween?.kill();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={wrapRef} id="top" style={{ height: "300vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100dvh",
          overflow: "hidden",
        }}
      >
        {/* static frame 1 under the canvas: instant paint + reduced-motion state */}
        <img
          src="/assets/Video/Main/morfing.jpg"
          alt="Seif Studios brand film"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "none",
          }}
          aria-hidden="true"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 34%, rgba(0,0,0,0) 55%), linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 14%)",
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
            High end AI generated images and video for brands that want to
            stand out.
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
    </div>
  );
}
