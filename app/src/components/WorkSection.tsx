import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion, scrollToTarget } from "../lib/motion";
import { HoverDistort } from "../lib/hover-distort";
import { WORK_CHAPTERS, type WorkPiece } from "../data/content";

/* Work: 7 category chapters as a staggered masonry of media tiles.
   Second beat (C1): shared WebGL canvas ripples the hovered image.
   Videos play only while in view. Images open a lightbox. */

function Tile({
  piece,
  distort,
  onOpen,
}: {
  piece: WorkPiece;
  distort: React.MutableRefObject<HoverDistort | null>;
  onOpen: (p: WorkPiece) => void;
}) {
  const tileRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = mediaRef.current;
    if (!el || piece.kind !== "video") return;
    const video = el as HTMLVideoElement;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "100px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [piece.kind]);

  const enter = (e: React.PointerEvent) => {
    if (piece.kind !== "image") return;
    const tile = tileRef.current;
    const img = mediaRef.current as HTMLImageElement | null;
    if (tile && img && distort.current) {
      distort.current.enter(tile, img);
      distort.current.move(e.clientX, e.clientY);
    }
  };

  return (
    <div className="mb-5 break-inside-avoid" style={{ pageBreakInside: "avoid" }}>
      <div
        ref={tileRef}
        className="seif-tile"
        style={{ aspectRatio: piece.ratio }}
        data-cursor="view"
        onPointerEnter={enter}
        onPointerMove={(e) => distort.current?.move(e.clientX, e.clientY)}
        onPointerLeave={() => distort.current?.leave()}
        onClick={() => onOpen(piece)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onOpen(piece);
        }}
        aria-label={`${piece.title}, ${piece.caption}`}
      >
        {piece.kind === "image" ? (
          <img
            ref={mediaRef as React.RefObject<HTMLImageElement>}
            src={piece.src}
            alt={`${piece.title}: ${piece.caption}`}
            loading="lazy"
          />
        ) : (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={piece.src}
            poster={piece.poster}
            muted
            loop
            playsInline
            preload="none"
          />
        )}
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium" style={{ color: "var(--seif-white)" }}>
          {piece.title}
          <span className="ml-2" style={{ color: "var(--seif-gray-500)" }}>
            {piece.caption}
          </span>
        </p>
        <span className="seif-mono" style={{ color: "var(--seif-gray-500)" }}>
          {piece.tag}
        </span>
      </div>
    </div>
  );
}

export function WorkSection() {
  const rootRef = useRef<HTMLElement>(null);
  const distort = useRef<HoverDistort | null>(null);
  const [open, setOpen] = useState<WorkPiece | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(hover: none)").matches) return;
    distort.current = new HoverDistort();
    return () => {
      distort.current?.destroy();
      distort.current = null;
    };
  }, []);

  // chapter headline slide-ins (transform only, opacity untouched)
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;
    const headers = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter-head]"));
    const tweens = headers.map((h) =>
      gsap.from(h, {
        y: 48,
        ease: "power3.out",
        duration: 0.9,
        scrollTrigger: { trigger: h, start: "top 88%" },
      }),
    );
    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section id="work" ref={rootRef} className="relative px-6 pt-28 md:px-14">
      <p className="seif-eyebrow">Our Work</p>

      {WORK_CHAPTERS.map((ch) => (
        <div key={ch.id} id={`work-${ch.id}`} className="pt-20">
          <div data-chapter-head>
            <h2 className="seif-display" style={{ fontSize: "clamp(1.9rem, 4vw, 3.4rem)" }}>
              {ch.title}
            </h2>
            <p
              className="mt-3 max-w-xl text-base leading-relaxed"
              style={{ color: "var(--seif-gray-300)" }}
            >
              {ch.sub}
            </p>
          </div>
          <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {ch.pieces.map((p) => (
              <Tile key={p.src} piece={p} distort={distort} onOpen={setOpen} />
            ))}
          </div>
        </div>
      ))}

      {/* closing band */}
      <div className="py-32 text-center">
        <h2 className="seif-display" style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.6rem)" }}>
          Creative Without Limits
        </h2>
        <p
          className="mx-auto mt-4 max-w-xl text-base leading-relaxed"
          style={{ color: "var(--seif-gray-300)" }}
        >
          If you can imagine it, we can visualize it. Our AI driven pipeline
          adapts to your vision.
        </p>
        <button
          type="button"
          className="seif-link-arrow mt-8"
          style={{ fontSize: "1.1rem" }}
          onClick={() => scrollToTarget("#contact")}
        >
          Contact Us
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      {/* lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
        >
          <button
            type="button"
            className="absolute right-6 top-5 text-3xl"
            style={{ color: "var(--seif-white)" }}
            aria-label="Close"
            onClick={() => setOpen(null)}
          >
            ×
          </button>
          {open.kind === "image" ? (
            <img
              src={open.src}
              alt={`${open.title}: ${open.caption}`}
              className="max-h-[86vh] max-w-full object-contain"
            />
          ) : (
            <video
              src={open.src}
              poster={open.poster}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="max-h-[86vh] max-w-full object-contain"
            />
          )}
          <p
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm"
            style={{ color: "var(--seif-gray-300)" }}
          >
            {open.title}, {open.caption}
          </p>
        </div>
      )}
    </section>
  );
}

export { ScrollTrigger };
