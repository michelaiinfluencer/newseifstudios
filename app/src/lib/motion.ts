/* Lenis smooth scroll bridged to GSAP ScrollTrigger.
   Client-only: call inside useEffect. autoRaf: false + gsap.ticker drives
   lenis.raf, per the proven bridge (without it, scrub stutters). */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

let installed = false;
let lenis: Lenis | null = null;

// Register at module load (guarded): child effects (HeroScrub, sections)
// run BEFORE the root's installMotion effect, and an unregistered
// ScrollTrigger.create crashes at runtime.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function installMotion(): () => void {
  if (installed || typeof window === "undefined") return () => {};
  installed = true;

  if (prefersReducedMotion()) {
    return () => {
      installed = false;
    };
  }

  lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
    installed = false;
  };
}

/* Velocity type: [data-vtext] headlines lean and stretch with scroll speed,
   springing back upright at rest. Transform only; skipped on reduced motion. */
export function installVelocityText(): () => void {
  if (typeof window === "undefined" || prefersReducedMotion()) return () => {};
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-vtext]"));
  if (!els.length) return () => {};
  let last = window.scrollY;
  let skew = 0;
  let raf = 0;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    const v = window.scrollY - last;
    last = window.scrollY;
    const target = Math.max(-8, Math.min(8, v * 0.35));
    skew += (target - skew) * 0.09;
    if (Math.abs(skew) < 0.02) return;
    const stretch = 1 + Math.min(0.06, Math.abs(skew) * 0.012);
    for (const el of els) {
      el.style.transform = `skewY(${skew * 0.4}deg) scaleY(${stretch})`;
    }
  };
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    els.forEach((el) => {
      el.style.transform = "";
    });
  };
}

export function scrollToTarget(target: string) {
  if (typeof window === "undefined") return;
  const el = document.querySelector(target);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: 0 });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
  }
}

export { gsap, ScrollTrigger };
