import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion, scrollToTarget } from "../lib/motion";
import { MARQUEE_ITEMS } from "../data/content";
import { Marquee } from "./Marquee";

/* V5 hero: headline on the left, the morfing film in a FLOATING WINDOW on
   the right. Scroll scrubs the film SMOOTHLY: a render loop eases the
   current frame toward the scroll target, so playback glides instead of
   stepping. Reduced motion: static first frame in the window. */

const FRAME_COUNT = 150;
const framePath = (i: number) =>
  `/frames/hero/f-${String(i + 1).padStart(3, "0")}.jpg`;

export function HeroVideo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
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
    let target = 0; // frame the scroll wants
    let shown = 0; // frame we are easing through (float)
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
        if (Math.round(shown) === i) draw(i);
      };
      frames[i] = img;
    };
    load(0);
    for (let i = 1; i < FRAME_COUNT; i++) load(i);

    // smooth playback: ease the shown frame toward the target every tick
    const tick = () => {
      if (killed) return;
      raf = requestAnimationFrame(tick);
      const diff = target - shown;
      if (Math.abs(diff) < 0.05) return;
      shown += diff * 0.14;
      draw(Math.round(shown));
    };
    raf = requestAnimationFrame(tick);

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        target = self.progress * (FRAME_COUNT - 1);
      },
    });

    // the window floats: drifts up slightly slower than the page
    let winTween: gsap.core.Tween | null = null;
    if (windowRef.current) {
      winTween = gsap.fromTo(
        windowRef.current,
        { y: 30 },
        {
          y: -46,
          ease: "none",
          scrollTrigger: { trigger: wrap, start: "top top", end: "bottom bottom", scrub: 0.4 },
        },
      );
    }
    let textTween: gsap.core.Tween | null = null;
    if (contentRef.current) {
      textTween = gsap.to(contentRef.current, {
        y: -40,
        ease: "none",
        scrollTrigger: { trigger: wrap, start: "top top", end: "bottom bottom", scrub: 0.4 },
      });
    }

    const onResize = () => draw(Math.round(shown));
    window.addEventListener("resize", onResize);
    draw(0);

    return () => {
      killed = true;
      st.kill();
      winTween?.scrollTrigger?.kill();
      winTween?.kill();
      textTween?.scrollTrigger?.kill();
      textTween?.kill();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
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
        <div className="grid flex-1 grid-cols-1 items-center gap-10 px-6 pt-20 md:grid-cols-12 md:px-14 md:pt-0">
          {/* left: type */}
          <div ref={contentRef} className="md:col-span-6 lg:col-span-5">
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

          {/* right: the floating film window */}
          <div className="md:col-span-6 lg:col-span-7">
            <div ref={windowRef} className="seif-hero-window">
              <div className="seif-hero-window-bar">
                <span className="seif-mono" style={{ color: "var(--seif-gray-500)" }}>
                  seif studios, brand film
                </span>
                <span className="seif-hero-window-dot" />
              </div>
              <div style={{ position: "relative", aspectRatio: "16/9" }}>
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
              </div>
            </div>
          </div>
        </div>

        <Marquee items={MARQUEE_ITEMS} />
      </div>
    </div>
  );
}
