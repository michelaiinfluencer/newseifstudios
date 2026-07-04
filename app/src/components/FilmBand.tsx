import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/motion";

/* Brand film band: the morfing film in a floating framed window, scrubbed
   SMOOTHLY by scroll (a render loop eases the shown frame toward the scroll
   target so playback glides). Reduced motion: static first frame. */

const FRAME_COUNT = 150;
const framePath = (i: number) =>
  `/frames/hero/f-${String(i + 1).padStart(3, "0")}.jpg`;

export function FilmBand() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    if (prefersReducedMotion()) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.style.display = "block";

    const frames: Array<HTMLImageElement | null> = new Array(FRAME_COUNT).fill(null);
    let target = 0;
    let shown = 0;
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
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight) * 1.14; // crop in
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

    // the journey: small on the left, swells to near fullscreen, exits small right
    let winTl: gsap.core.Timeline | null = null;
    if (windowRef.current) {
      winTl = gsap
        .timeline({
          scrollTrigger: { trigger: wrap, start: "top top", end: "bottom bottom", scrub: 0.45 },
        })
        .fromTo(
          windowRef.current,
          { scale: 0.42, xPercent: -62 },
          { scale: 1, xPercent: 0, duration: 0.4, ease: "power2.inOut" },
        )
        .to(windowRef.current, { scale: 1, xPercent: 0, duration: 0.25 })
        .to(windowRef.current, { scale: 0.42, xPercent: 62, duration: 0.35, ease: "power2.inOut" });
    }

    const onResize = () => draw(Math.round(shown));
    window.addEventListener("resize", onResize);
    draw(0);

    return () => {
      killed = true;
      st.kill();
      winTl?.scrollTrigger?.kill();
      winTl?.kill();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ height: "240vh", position: "relative" }}>
      <div
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
        <div className="w-full px-4 md:px-10">
          <div ref={windowRef} className="seif-hero-window seif-hero-window--journey">
            <div className="seif-hero-window-bar">
              <span className="seif-mono" style={{ color: "var(--seif-gray-500)" }}>
                seif studios, brand film
              </span>
              <span className="seif-hero-window-dot" />
            </div>
            <div style={{ position: "relative", aspectRatio: "16/8.5" }}>
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
    </div>
  );
}
