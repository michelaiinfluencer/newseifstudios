/* Lenis smooth scroll bridged to GSAP ScrollTrigger.
   Client-only: call inside useEffect. autoRaf: false + gsap.ticker drives
   lenis.raf, per the proven bridge (without it, scrub stutters). */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

let lenis: Lenis | null = null;

// Register at module load (guarded): child effects (HeroScrub, sections)
// run BEFORE the root's installMotion effect, and an unregistered
// ScrollTrigger.create crashes at runtime.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // set as early as possible so the browser never natively restores scroll on
  // a reload (which would fight our own "start at the top" reset).
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function installMotion(): () => void {
  if (typeof window === "undefined" || prefersReducedMotion()) return () => {};

  // Each mount gets its OWN Lenis + ticker fn, captured locally. On a route
  // change the new page can mount before the old page's cleanup runs; using a
  // shared module singleton meant the old cleanup would tear down the new
  // page's Lenis (or a guard would skip creating one), leaving the returned
  // page with a dead scroll->ScrollTrigger bridge so reveals never fired.
  const localLenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
  localLenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => {
    localLenis.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  lenis = localLenis; // module ref just for scrollToTarget()
  requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => {
    gsap.ticker.remove(tick);
    localLenis.destroy();
    if (lenis === localLenis) lenis = null; // only clear if still ours
  };
}

export function scrollToTarget(target: string, immediate = false) {
  if (typeof window === "undefined") return;
  const el = document.querySelector(target);
  if (!el) return;
  if (lenis) {
    // scroll THROUGH Lenis so its internal position stays in sync; a native
    // scrollIntoView while Lenis is active desyncs ScrollTrigger and leaves
    // scroll-reveal sections stuck hidden.
    lenis.scrollTo(el as HTMLElement, { offset: 0, immediate });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  }
}

// Jump to the very top, THROUGH Lenis so it doesn't animate back to a
// restored position. Used on a fresh load / refresh with no hash.
export function scrollToTop() {
  if (typeof window === "undefined") return;
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true });
  } else {
    window.scrollTo(0, 0);
  }
}

export { gsap, ScrollTrigger };
