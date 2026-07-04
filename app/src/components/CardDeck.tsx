import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { gsap, prefersReducedMotion } from "../lib/motion";
import { WORK_CHAPTERS, type WorkChapter } from "../data/content";

/* V2 centerpiece: the 3D card deck. One card per discipline.
   Layers ride at different translateZ depths inside a perspective container;
   the card tilts toward the pointer, a glare tracks it, a red rim ignites.
   Click = the card's cover expands to fullscreen, then we travel into
   /work/$topic. Touch devices: tap navigates with a quick wipe. */

function Card({ ch, index }: { ch: WorkChapter; index: number }) {
  const navigate = useNavigate();
  const shellRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    const inner = innerRef.current;
    const glare = glareRef.current;
    if (!shell || !inner || !glare) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const rx = gsap.quickTo(inner, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(inner, "rotationY", { duration: 0.6, ease: "power3.out" });
    const gx = gsap.quickTo(glare, "--gx", { duration: 0.4, ease: "power2.out" });
    const gy = gsap.quickTo(glare, "--gy", { duration: 0.4, ease: "power2.out" });

    const onMove = (e: PointerEvent) => {
      const r = shell.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 14);
      rx((0.5 - py) * 12);
      gx(px * 100);
      gy(py * 100);
    };
    const onEnter = () => {
      videoRef.current?.play().catch(() => {});
    };
    const onLeave = () => {
      rx(0);
      ry(0);
      videoRef.current?.pause();
    };
    shell.addEventListener("pointermove", onMove);
    shell.addEventListener("pointerenter", onEnter);
    shell.addEventListener("pointerleave", onLeave);
    return () => {
      shell.removeEventListener("pointermove", onMove);
      shell.removeEventListener("pointerenter", onEnter);
      shell.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // scroll drift: each card floats up at its own rate (transform only)
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || prefersReducedMotion()) return;
    const drift = index % 2 === 0 ? 40 : -34;
    const tween = gsap.fromTo(
      shell,
      { y: drift },
      {
        y: -drift,
        ease: "none",
        scrollTrigger: { trigger: shell, start: "top bottom", end: "bottom top", scrub: 0.8 },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [index]);

  const open = () => {
    const shell = shellRef.current;
    const go = () => navigate({ to: "/work/$topic", params: { topic: ch.id } });
    if (!shell || prefersReducedMotion()) return go();

    // expansion: clone the cover into a fixed overlay and scale it to fullscreen
    const r = shell.getBoundingClientRect();
    const overlay = document.createElement("div");
    overlay.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;z-index:9000;overflow:hidden;background:#000;`;
    const img = document.createElement("img");
    img.src = ch.coverKind === "video" ? (ch.coverPoster ?? ch.cover) : ch.cover;
    img.style.cssText = "width:100%;height:100%;object-fit:cover;";
    overlay.appendChild(img);
    const shade = document.createElement("div");
    shade.style.cssText = "position:absolute;inset:0;background:rgba(0,0,0,0);";
    overlay.appendChild(shade);
    document.body.appendChild(overlay);

    gsap.timeline({ onComplete: go })
      .to(overlay, {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        duration: 0.65,
        ease: "power3.inOut",
      })
      .to(shade, { backgroundColor: "rgba(0,0,0,0.45)", duration: 0.3 }, "<0.3");
    // the topic page removes leftover overlays on mount
  };

  const wide = ch.num === "01" || ch.num === "04" || ch.num === "07";

  return (
    <div
      ref={shellRef}
      className={wide ? "md:col-span-7" : "md:col-span-5"}
      style={{ perspective: "1200px" }}
    >
      <div
        ref={innerRef}
        className="seif-card"
        data-cursor="Open"
        role="link"
        tabIndex={0}
        aria-label={`${ch.title}: open gallery`}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") open();
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="seif-card-media" style={{ transform: "translateZ(0px)" }}>
          {ch.coverKind === "video" ? (
            <video
              ref={videoRef}
              src={ch.cover}
              poster={ch.coverPoster}
              muted
              loop
              playsInline
              preload="none"
            />
          ) : (
            <img src={ch.cover} alt={ch.title} loading={index < 2 ? "eager" : "lazy"} />
          )}
          <div ref={glareRef} className="seif-card-glare" />
        </div>
        <span className="seif-card-num" style={{ transform: "translateZ(70px)" }}>
          {ch.num}
        </span>
        <div className="seif-card-meta" style={{ transform: "translateZ(50px)" }}>
          <h3 className="seif-display" style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.2rem)" }}>
            {ch.title}
          </h3>
          <p className="seif-card-count seif-mono">
            {ch.pieces.length} pieces
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
}

export function CardDeck() {
  return (
    <section id="work" className="px-6 py-32 md:px-14">
      <h2
        className="seif-display"
        style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", maxWidth: "12ch" }}
      >
        Seven Ways We Create
      </h2>
      <p
        className="mt-4 max-w-md text-base leading-relaxed"
        style={{ color: "var(--seif-gray-300)" }}
      >
        Pick a discipline and step inside its gallery.
      </p>
      <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-12">
        {WORK_CHAPTERS.map((ch, i) => (
          <Card key={ch.id} ch={ch} index={i} />
        ))}
      </div>
    </section>
  );
}
