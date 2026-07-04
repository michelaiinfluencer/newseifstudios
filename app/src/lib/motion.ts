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
