import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";
import type { WorkPiece } from "../data/content";

/* V4 topic gallery: three real columns (not CSS masonry) so each column can
   drift at its own rate on scroll; tiles rise in with transform-only
   reveals; hover is a red hairline frame plus a whisper of 3D tilt, never a
   zoom. Lightbox v2: animated open, blurred backdrop, prev/next arrows,
   counter, arrow-key navigation. */

function Tile({
  piece,
  index,
  onOpen,
}: {
  piece: WorkPiece;
  index: number;
  onOpen: (p: WorkPiece) => void;
}) {
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

  return (
    <div className="seif-gtile" data-gtile>
      <div
        className="seif-tile"
        style={{ aspectRatio: piece.ratio }}
        data-cursor="View"
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
            loading={index < 3 ? "eager" : "lazy"}
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

export function Gallery({ pieces }: { pieces: WorkPiece[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // split into 3 columns round-robin so columns can drift independently
  const cols: WorkPiece[][] = [[], [], []];
  const idxMap: number[][] = [[], [], []];
  pieces.forEach((p, i) => {
    cols[i % 3].push(p);
    idxMap[i % 3].push(i);
  });

  // tile entrances + per-column scroll drift (transform only)
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;
    const tiles = Array.from(root.querySelectorAll<HTMLElement>("[data-gtile]"));
    const rises = tiles.map((t, i) =>
      gsap.from(t, {
        y: 60,
        duration: 0.9,
        ease: "power3.out",
        delay: (i % 3) * 0.06,
        scrollTrigger: { trigger: t, start: "top 96%" },
      }),
    );
    const columns = Array.from(root.querySelectorAll<HTMLElement>("[data-gcol]"));
    const drifts = columns.map((c, i) =>
      gsap.to(c, {
        y: i === 1 ? -46 : -12,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.7 },
      }),
    );
    return () => {
      [...rises, ...drifts].forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, [pieces]);

  // lightbox keys: Esc close, arrows navigate
  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setOpenIdx((v) => (v === null ? v : (v + 1) % pieces.length));
      if (e.key === "ArrowLeft")
        setOpenIdx((v) => (v === null ? v : (v - 1 + pieces.length) % pieces.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, pieces.length]);

  // lightbox entrance
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (openIdx === null || prefersReducedMotion()) return;
    const box = boxRef.current;
    if (!box) return;
    const media = box.querySelector("[data-lightbox-media]");
    if (media) {
      gsap.fromTo(
        media,
        { scale: 0.9, y: 24 },
        { scale: 1, y: 0, duration: 0.45, ease: "power3.out" },
      );
    }
  }, [openIdx]);

  const open = openIdx !== null ? pieces[openIdx] : null;

  return (
    <>
      <div ref={rootRef} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {cols.map((col, c) => (
          <div key={c} data-gcol className="flex flex-col gap-6" style={{ marginTop: c === 1 ? 56 : 0 }}>
            {col.map((p, i) => (
              <Tile key={p.src} piece={p} index={idxMap[c][i]} onOpen={() => setOpenIdx(idxMap[c][i])} />
            ))}
          </div>
        ))}
      </div>

      {open && (
        <div
          ref={boxRef}
          className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(18px)" }}
          onClick={() => setOpenIdx(null)}
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
        >
          <button
            type="button"
            className="absolute right-6 top-5 text-3xl transition-colors hover:text-[#ff0000]"
            style={{ color: "var(--seif-white)" }}
            aria-label="Close"
            onClick={() => setOpenIdx(null)}
          >
            ×
          </button>
          <span
            className="seif-mono absolute left-6 top-6"
            style={{ color: "var(--seif-gray-500)" }}
          >
            {String((openIdx ?? 0) + 1).padStart(2, "0")} / {String(pieces.length).padStart(2, "0")}
          </span>

          <button
            type="button"
            className="seif-lb-arrow left-3 md:left-8"
            aria-label="Previous piece"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIdx((v) => (v === null ? v : (v - 1 + pieces.length) % pieces.length));
            }}
          >
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            type="button"
            className="seif-lb-arrow right-3 md:right-8"
            aria-label="Next piece"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIdx((v) => (v === null ? v : (v + 1) % pieces.length));
            }}
          >
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          <div data-lightbox-media onClick={(e) => e.stopPropagation()}>
            {open.kind === "image" ? (
              <img
                key={open.src}
                src={open.src}
                alt={`${open.title}: ${open.caption}`}
                className="max-h-[82vh] max-w-[88vw] object-contain"
              />
            ) : (
              <video
                key={open.src}
                src={open.src}
                poster={open.poster}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="max-h-[82vh] max-w-[88vw] object-contain"
              />
            )}
          </div>
          <p
            className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm"
            style={{ color: "var(--seif-gray-300)" }}
          >
            <span className="font-medium" style={{ color: "var(--seif-white)" }}>
              {open.title}
            </span>
            <span className="ml-2">{open.caption}</span>
          </p>
        </div>
      )}
    </>
  );
}
