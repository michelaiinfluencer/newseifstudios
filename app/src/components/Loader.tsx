import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/motion";

/* Intro loader: wordmark + counting percentage, wipes up and unmounts.
   Content underneath is fully rendered the whole time (screenshot-safe);
   the loader self-dismisses in ~1.4s regardless of asset state. */
export function Loader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const num = numRef.current;
    if (!root || !num) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      window.dispatchEvent(new Event("seif:loaded"));
      return;
    }
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        // hand off to the hero: the blob inflates as the curtain lifts
        window.dispatchEvent(new Event("seif:loaded"));
      },
    });
    tl.to(counter, {
      v: 100,
      duration: 2.0,
      ease: "power2.inOut",
      onUpdate: () => {
        num.textContent = String(Math.round(counter.v)).padStart(3, "0");
      },
    }).to(root, {
      yPercent: -100,
      duration: 0.6,
      ease: "power3.inOut",
    });
    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className="seif-loader" aria-hidden="true">
      <img
        src="/assets/Logo/logo3.2.png"
        alt=""
        style={{ width: "min(300px, 62vw)", height: "auto" }}
      />
      <span
        ref={numRef}
        className="seif-mono"
        style={{ color: "var(--seif-red)", fontSize: "0.9rem" }}
      >
        000
      </span>
    </div>
  );
}
