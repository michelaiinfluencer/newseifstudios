import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";

/* The playroom: a canvas physics pit filled with red spheres and
   circle-cropped pieces from the portfolio. Balls drop in when the section
   enters view, collide, and can be flicked with the pointer or finger.
   Reduced motion: balls rest pre-settled (no gravity show). */

const BALL_IMAGES = [
  "/assets/Image/Images/PortfolioImageImage2.jpg",
  "/assets/Image/Models/PortfolioModelImage1.jpg",
  "/assets/Image/Avatars/PortfolioAvatarImage1.jpg",
  "/assets/Image/Products/PortfolioProductImage7.jpg",
  "/assets/Image/Lookbooks/PortfolioLookbookImage3.jpg",
  "/assets/Image/UGC/ImageUGC1.jpg",
  "/assets/Image/Images/PortfolioImageImage5.jpg",
  "/assets/Image/Avatars/PortfolioAvatarImage2.jpg",
  "/assets/Image/Models/PortfolioModelImage3.jpg",
  "/assets/Image/Lookbooks/PortfolioLookbookImage5.jpg",
];

type Ball = {
  x: number;
  y: number;
  px: number;
  py: number;
  r: number;
  img: HTMLImageElement | null; // null = solid red ball
};

export function BallPit() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const calm = prefersReducedMotion();
    let killed = false;
    let raf = 0;
    let running = false;
    const balls: Ball[] = [];
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, down: false };
    let grabbed: Ball | null = null;

    const images: Array<HTMLImageElement | null> = BALL_IMAGES.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      return { w: canvas.clientWidth, h: canvas.clientHeight, dpr };
    };

    const populate = () => {
      const { w, h } = size();
      balls.length = 0;
      const count = w < 700 ? 14 : 22;
      for (let i = 0; i < count; i++) {
        const r = (w < 700 ? 26 : 34) + Math.abs(Math.sin(i * 37.7)) * (w < 700 ? 22 : 34);
        const x = (i / count) * (w - 2 * r) + r + Math.sin(i * 91.3) * 14;
        const y = calm ? h - r - (i % 4) * r * 1.8 : -r - (i % 6) * 130;
        balls.push({
          x,
          y,
          px: x - Math.sin(i * 13.7) * 2,
          py: y,
          r,
          img: i % 2 === 0 ? images[(i / 2) % images.length | 0] : null,
        });
      }
    };

    const step = () => {
      const { w, h } = size();
      const g = calm ? 0 : 0.45;
      for (const b of balls) {
        if (b === grabbed) {
          b.px = b.x;
          b.py = b.y;
          b.x = pointer.x;
          b.y = pointer.y;
          continue;
        }
        const vx = (b.x - b.px) * 0.995;
        const vy = (b.y - b.py) * 0.995 + g;
        b.px = b.x;
        b.py = b.y;
        b.x += vx;
        b.y += vy;
        // pointer shove
        const dx = b.x - pointer.x;
        const dy = b.y - pointer.y;
        const dd = Math.hypot(dx, dy);
        if (dd < b.r + 70 && dd > 0.01) {
          const f = ((b.r + 70 - dd) / (b.r + 70)) * 2.2;
          b.x += (dx / dd) * f + pointer.vx * 0.06;
          b.y += (dy / dd) * f + pointer.vy * 0.06;
        }
        // walls + floor
        if (b.x < b.r) b.x = b.r;
        if (b.x > w - b.r) b.x = w - b.r;
        if (b.y > h - b.r) b.y = h - b.r;
        if (b.y < -600) b.y = -600;
      }
      // collisions (two relaxation passes)
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < balls.length; i++) {
          for (let j = i + 1; j < balls.length; j++) {
            const a = balls[i];
            const c = balls[j];
            const dx = c.x - a.x;
            const dy = c.y - a.y;
            const dist = Math.hypot(dx, dy) || 0.01;
            const min = a.r + c.r;
            if (dist < min) {
              const push = ((min - dist) / dist) * 0.5;
              const ox = dx * push;
              const oy = dy * push;
              if (a !== grabbed) {
                a.x -= ox;
                a.y -= oy;
              }
              if (c !== grabbed) {
                c.x += ox;
                c.y += oy;
              }
            }
          }
        }
      }
    };

    const drawBall = (b: Ball) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.closePath();
      if (b.img && b.img.complete && b.img.naturalWidth > 0) {
        ctx.clip();
        const s = Math.max((b.r * 2) / b.img.naturalWidth, (b.r * 2) / b.img.naturalHeight);
        const dw = b.img.naturalWidth * s;
        const dh = b.img.naturalHeight * s;
        ctx.drawImage(b.img, b.x - dw / 2, b.y - dh / 2, dw, dh);
        ctx.restore();
        // red ring
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r - 1, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,0,0,0.55)";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        const grad = ctx.createRadialGradient(
          b.x - b.r * 0.35,
          b.y - b.r * 0.4,
          b.r * 0.1,
          b.x,
          b.y,
          b.r,
        );
        grad.addColorStop(0, "#ff4a4a");
        grad.addColorStop(0.55, "#e60000");
        grad.addColorStop(1, "#5c0000");
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }
    };

    const frame = () => {
      if (killed || !running) return;
      raf = requestAnimationFrame(frame);
      const { dpr } = size();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      step();
      for (const b of balls) drawBall(b);
      pointer.vx *= 0.8;
      pointer.vy *= 0.8;
    };

    // run only while visible
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          if (balls.length === 0) populate();
          raf = requestAnimationFrame(frame);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "60px" },
    );
    io.observe(host);

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      pointer.vx = p.x - pointer.x;
      pointer.vy = p.y - pointer.y;
      pointer.x = p.x;
      pointer.y = p.y;
    };
    const onDown = (e: PointerEvent) => {
      const p = toLocal(e);
      pointer.x = p.x;
      pointer.y = p.y;
      grabbed =
        balls.find((b) => Math.hypot(b.x - p.x, b.y - p.y) < b.r + 6) ?? null;
    };
    const onUp = () => {
      grabbed = null;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      grabbed = null;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    const onResize = () => populate();
    window.addEventListener("resize", onResize);

    return () => {
      killed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section ref={hostRef} className="px-6 pt-28 md:px-14">
      <h2 data-vtext className="seif-display" style={{ fontSize: "clamp(2rem, 4.6vw, 3.6rem)" }}>
        Have a Play
      </h2>
      <p className="mt-3 max-w-md text-base" style={{ color: "var(--seif-gray-300)" }}>
        The work, loose in the room. Flick it around.
      </p>
      <div
        className="mt-10"
        style={{
          height: "min(62vh, 560px)",
          border: "1px solid var(--seif-gray-700)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
          aria-label="Playful physics pit with portfolio pieces"
          role="img"
        />
      </div>
    </section>
  );
}
