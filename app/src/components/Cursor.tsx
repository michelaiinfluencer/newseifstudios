import { useEffect, useRef } from "react";
import { gsap } from "../lib/motion";

/* V2 cursor: ONE small dot in mix-blend difference that springs after the
   pointer. Over [data-cursor] surfaces it swells into a solid red badge with
   a mono label ("Open", "View", "Play"). No ring. Hidden on touch and
   reduced-motion, and until the first pointer move. */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const x = gsap.quickTo(dot, "x", { duration: 0.22, ease: "power3.out" });
    const y = gsap.quickTo(dot, "y", { duration: 0.22, ease: "power3.out" });
    const scale = gsap.quickTo(dot, "scale", { duration: 0.3, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      dot.classList.add("is-live");
      x(e.clientX);
      y(e.clientY);
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      if (t) {
        const text = t.dataset.cursor || "Open";
        if (label.textContent !== text) label.textContent = text;
        dot.classList.add("is-badge");
        scale(1);
      } else {
        dot.classList.remove("is-badge");
        scale(1);
      }
    };
    const onDown = () => scale(0.85);
    const onUp = () => scale(1);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={dotRef} className="seif-cursor" aria-hidden="true">
      <span ref={labelRef} className="seif-cursor-text">
        Open
      </span>
    </div>
  );
}
