import { useEffect, useRef, useState } from "react";
import type { WorkPiece } from "../data/content";

/* Topic gallery: masonry of media tiles, view-managed video playback, and a
   lightbox. Hover never alters the artwork; a red hairline frame (CSS) is
   the only response. */

function Tile({
  piece,
  onOpen,
}: {
  piece: WorkPiece;
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

  return (
    <div className="mb-5 break-inside-avoid" style={{ pageBreakInside: "avoid" }}>
      <div
        ref={tileRef}
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

export function Gallery({ pieces }: { pieces: WorkPiece[] }) {
  const [open, setOpen] = useState<WorkPiece | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {pieces.map((p) => (
          <Tile key={p.src} piece={p} onOpen={setOpen} />
        ))}
      </div>

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
    </>
  );
}
