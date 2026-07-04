import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/motion";

// module-scoped: survives client-side navigation, resets on a real refresh
let shownOnce = false;

/* Intro loader: wordmark + counting percentage, wipes up and unmounts.
   Content underneath is fully rendered the whole time (screenshot-safe);
   the loader self-dismisses in ~1.4s regardless of asset state. */
export function Loader() {
  const [done, setDone] = useState(() => shownOnce);
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (shownOnce) {
      window.dispatchEvent(new Event("seif:loaded"));
      return;
    }
    const root = rootRef.current;
    const num = numRef.current;
    if (!root || !num) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shownOnce = true;
      setDone(true);
      window.dispatchEvent(new Event("seif:loaded"));
      return;
    }
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        shownOnce = true;
        setDone(true);
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
        style={{ width: "min(900px, 86vw)", height: "auto" }}
      />
      <span
        ref={numRef}
        className="seif-mono"
        style={{ color: "var(--seif-red)", fontSize: "2.7rem", letterSpacing: "0.12em" }}
      >
        000
      </span>
    </div>
  );
}
